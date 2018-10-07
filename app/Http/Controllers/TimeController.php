<?php

/**
 * PHP version 7.3
 * TimeController.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
declare (strict_types = 1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Time;
use App\Utilities;
use \Defenestrator\Laravel5\CouchDb\CouchDbConnection;
use DB;
use Log;
use Illuminate\Support\Str;

/**
 * This controller manages requests to add/get/update/delete time documents.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
class TimeController extends Controller
{
    private $_connection;
    private const CREATED = "201 Created";
    private const CONFLICT = "409 Conflict";

    /**
     * Constructs a new Controller instance.
     */
    public function __construct()
    {
        $this->_connection = DB::connection('couchdb');
    }

    /**
     * Records the new set of times to the database.
     *
     * @param Request $request The request containing the data
     *
     * @return void
     */
    public function addTime(Request $request)
    {
        $lapTimes = $this->_compactLapTimes($request);
        $document = [
            'id' => $this->_getUuid(),
            'runDate' => $request->input('run_date'),
            'lapTimes' => $lapTimes
        ];
        [$id, $rev] = $this->_connection->postDocument($document);
        // TODO: check for errors
        return response()->json(['id' => $id, 'rev' => $rev]);
    }

    /**
     * Gets the time and sends the time to React to be rendered to the front.
     *
     * @param Request $request The request
     * @param string  $id      The document Id.
     *
     * @return JsonResponse The JSON of the document if `$id` is valid. Otherwise, a
     *                      404 error with a JSON object containing an error message
     *                      is supplied.
     */
    public function getTimeById(Request $request, string $id)
    {
        // Get the document by ID, then work on the response body
        // TODO: Use a query to find the document instead
        try {
            $doc = $this->_connection->findDocument($id);
            $body = $doc->body;
            // If document doesn't exist, throw an Exception
            if (empty($body)) {
                throw new Exception("No such document");
            }
            $data = $this->_extractData($body);

            return response()->json($data, 200);
        } catch (Exception $e) {
            // Send the error to the frontend
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    /**
     * Gets all times from the design document.
     *
     * @param Request $request The request object
     *
     * @return JsonResponse The list of all time docs, or a 404 error
     */
    public function getAllTimes(Request $request)
    {
        try {
            $limit = 20;
            // Execute the design doc view
            $query = $this->_connection->createViewQuery('times', 'times');
            $result = $query->execute()->toArray();
            // Rename the result keys for the frontend
            $times = array_map(
                function ($time) {
                    return [
                        'id' => $time['id'],
                        'runDate' => $time['key'],
                        'lapTimes' => $time['value']
                    ];
                },
                $result
            );
            return response()->json($times, 200);
        } catch (Excpetion $e) {
            // Send the error to the frontend
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    /**
     * Updates the existing time document.
     *
     * @param Request $request The request containing the doc to update
     *
     * @return RedirectResponse
     */
    public function updateTime(Request $request)
    {
        // TODO: Build this
        // Check if the time doc exists
        // Update time, and check if the update is successful
    }

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
            array_push($r, [intval($v[$i]), intval($v[$i+1]), intval($v[$i+2])]);
        }
        return $r;
    }

    /**
     * Prepares the document to be sent to React.
     *
     * @param array $time The document
     *
     * @return array
     */
    private function _extractData(array $time)
    {
        [$keys, $values] = array_divide($time, ['_id', '_rev']);
        array_walk(
            $keys,
            function (&$key) {
                $key = camel_case($key);
            }
        );
        return array_combine($keys, $values);
    }

    /**
     * Gets a UUID for creating a new time document.
     * This takes Str::uuid and removes the dashes that method creates.
     *
     * @return string A UUID
     */
    private function _getUuid()
    {
        return Utilities::str_remove('-', (string)Str::uuid());
    }
}
