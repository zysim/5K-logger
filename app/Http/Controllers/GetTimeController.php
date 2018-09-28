<?php

/**
 * PHP version 7.3
 * GetTImeController.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * Gets time.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
class GetTimeController extends Controller
{

    private $_connection;

    /**
     * Creates a new GetTimeControllre instance.
     * This handles the time doc API requests.
     */
    public function __construct()
    {
        $this->_connection = DB::connection('couchdb');
        $this->middleware('auth');
    }

    /**
     * Gets the time.
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
}
