<?php

/**
 * PHP version 7.3
 * NewTimeController.
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
use \Defenestrator\Laravel5\CouchDb\CouchDbConnection;
use DB;
use Log;

/**
 * This controller handles the POST request to record a new set of times.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
class NewTimeController extends Controller
{
    private $_connection;

    /**
     * Constructs a new Controller instance.
     */
    public function __construct()
    {
        $this->_connection = DB::connection('couchdb');
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
     * Records the new set of times.
     *
     * @param Request $request The request containing the data
     *
     * @return RedirectResponse
     */
    public function newTime(Request $request)
    {
        $lapTimes = $this->_compactLapTimes($request);
        $document = [
            'run_date' => $request->input('run_date'),
            'lap_times' => $lapTimes
        ];
        $connection = $this->_connection;
        list($id, $rev) = $connection->postDocument($document);
        Log::info("Document saved with id $id and rev $rev");
        return redirect()->back();
    }
}
