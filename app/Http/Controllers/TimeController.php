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
        $this->middleware('auth');
    }

    /**
     * Records the new set of times.
     *
     * @param Request $request The request containing the data
     *
     * @return RedirectResponse
     */
    public function addTime(Request $request)
    {
        $lapTimes = $this->_compactLapTimes($request);
        $document = [
            'id' => $this->_getUuid(),
            'run_date' => $request->input('run_date'),
            'lap_times' => $lapTimes
        ];
        $connection = $this->_connection;
        $connection->postDocument($document);
        // TODO: check for errors
        return redirect()->back();
    }

    /**
     * Gets the time and sends the time to React to be rendered to the front.
     *
     * @param string $id The document Id.
     *
     * @return JsonResponse The JSON of the document if `$id` is valid. Otherwise, a
     *                      404 error with a JSON object containing an error message
     *                      is supplied.
     */
    public function getTime(string $id)
    {
        // Get the document by ID, then work on the response body
        // TODO: Use a query to find the document instead
        try {
            $doc = $this->_connection->findDocument($id)->body;
            // If document doesn't exist, throw an Exception
            if (empty($doc)) {
                throw new Exception("No such document");
            }
            $data = $this->_extractData($doc);

            return response()->json($data, 200);
        } catch (Exception $e) {
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
        // Ensure lap times are sorted
        ksort($laps);
        // Compact lap times into an array
        return array_values($laps);
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
        [$keys, $values] = array_divide(array_except($time, ['_id', '_rev']));
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
        return Utilities::str_replace('-', Str::uuid());
    }
}
