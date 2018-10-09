<?php

/**
 * PHP version 7.3
 * RunController.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
declare (strict_types = 1);

namespace App\Http\Controllers;

use App;
use App\Run;
use App\Utilities;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Log;

/**
 * This controller manages requests to add/get/edit/delete run documents.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
class RunController extends Controller
{
    /**
     * The CouchDB client retrieved from the connection
     *
     * @var    \Doctrine\CouchDB\CouchDBClient
     * @access private
     */
    private $_client;

    /**
     * Compacts the lap times into a dict for storage.
     *
     * @param Request $request The HTTP request object
     *
     * @return array
     */
    private function _compactLapTimes(Request $request)
    {
        // Get lap times
        $laps = array_filter(
            $request->all(),
            function ($key) {
                return starts_with($key, "lap");
            },
            ARRAY_FILTER_USE_KEY
        );
        // Push [<lap_i_m>, <lap_i_s>, <lap_i_ms>] into $r
        // Key order and the fact it's all in threes is already ensured.
        // So we can just do the for loop
        $r = [];
        $v = array_values($laps);
        for ($i = 0; $i < count($v); $i += 3) {
            array_push($r, [intval($v[$i]), intval($v[$i + 1]), intval($v[$i + 2])]);
        }
        return $r;
    }

    /**
     * Gets the doc from the query array with date `$date`
     *
     * Takes the docs retrieved by the view query and returns the one doc that's got
     * the date that matches `$date`.
     *
     * @param array  $docs The result of the view query
     * @param string $date The date to search for in `$docs`
     *
     * @return array The singular doc
     * @throws Exception An exception if no doc with `$date` is found
     */
    private function _filterDocFromDate(array $docs, string $date)
    {
        $doc = array_filter(
            $docs,
            function ($d) use ($date) {
                return $d['runDate'] === $date;
            }
        );
        if (empty($doc)) {
            throw new Exception("Doc not found with date $date", 404);
        }
        return $this->_renameDocKeys($doc[0]);
    }

    /**
     * Gets the run doc by its ID
     *
     * @param string $id The ID to hunt for
     *
     * @return array The doc itself
     * @throws Exception An Exception containing the error message and status code if
     *                   the search was not successful
     */
    private function _getDocById(string $id)
    {
        $response = $this->_client->findDocument($id);
        if ($response->status >= 400) {
            throw new Exception($response->body['reason'], $response->status);
        }
        return $response->body;
    }

    /**
     * Gets a UUID for creating a new run document.
     * This takes Str::uuid and removes the dashes that method creates.
     *
     * @return string A UUID
     */
    private function _getUuid()
    {
        return Utilities::str_remove('-', (string)Str::uuid());
    }

    /**
     * Rename keys of the query result to match those in the database
     *
     * @param array $doc The run document
     *
     * @return array The same document with the renamed keys
     */
    private function _renameDocKeys(array $doc)
    {
        return [
            'id' => $doc['id'],
            'runDate' => $doc['key'],
            'lapTimes' => $doc['value']
        ];
    }

    /**
     * Constructs a new Controller instance.
     */
    public function __construct()
    {
        $connection = DB::connection('couchdb');
        $this->_client = $connection->getCouchDb();
    }

    /**
     * Records the new set of runs to the database.
     *
     * @param Request $request The request containing the data
     *
     * @return void
     */
    public function addRun(Request $request)
    {
        try {
            $lapTimes = $this->_compactLapTimes($request);
            $document = [
                'id' => $this->_getUuid(),
                'runDate' => $request->input('run_date'),
                'lapTimes' => $lapTimes
            ];
            [$id] = $this->_client->postDocument($document);
            return Utilities::successJsonResponse(
                'Run successfully saved',
                201,
                ['id' => $id]
            );
        } catch (Exception $e) {
            return Utilities::exceptionJsonResponse($e);
        }
    }

    /**
     * Delete the run with the given ID in `$request`
     *
     * @param Request $request The HTTP request object that has the ID of the run to
     *                         delete
     *
     * @return JsonResponse
     */
    public function deleteRun(Request $request)
    {
        try {
            $run = $this->_getDocById($request->input('id'));
            $this->_client->deleteDocument($run['id'], $run['rev']);
            return Utilities::successJsonResponse(
                'Document successfully deleted',
                200,
                $run['id']
            );
        } catch (Exception $e) {
            return Utilities::exceptionJsonResponse($e);
        }
    }

    /**
     * Updates the existing run document.
     *
     * @param Request $request The request containing the doc to update
     *
     * @return JsonResponse
     */
    public function editRun(Request $request)
    {
        try {
            $run = $this->_getDocById($request->input('id'));
            $updateData = array_replace(
                $run,
                [
                    'runDate' => $request->input('runDate') || $run['runDate'],
                    'lapTimes' => $request->input('lapTimes') || $run['lapTimes']
                ]
            );
            [$id, $newRev] = $this->_client
                ->putDocument($updateData, $id, $run['rev']);
            return Utilities::successJsonResponse(
                'Update successful',
                200,
                ['id' => $id]
            );
        } catch (Exception $e) {
            return Utilities::exceptionJsonResponse($e);
        }
    }

    /**
     * Gets all runs from the design document.
     *
     * @param Request $request The request object
     *
     * @return JsonResponse The list of all run docs, or an error
     */
    public function getAllRuns(Request $request)
    {
        try {
            // Execute the design doc view
            $query = $this->_client->createViewQuery('runs', 'list');
            $result = $query->execute();
            // Error handling
            if (array_key_exists('error', $result)) {
                if ($result['reason'] === 'missing') {
                    throw new Exception($result['reason'], 404);
                }
                throw new Exception($result['reason'], 500);
            }
            // Rename the result keys for the frontend
            $runs = array_map(
                function ($doc) {
                    return $this->_renameDocKeys($doc);
                },
                $result->toArray()
            );
            if (App::environment('local')) {
                Log::debug('Querying successful');
            }
            return response()->json($runs, 200);
        } catch (Exception $e) {
            return Utilities::exceptionJsonResponse($e);
        }
    }
}
