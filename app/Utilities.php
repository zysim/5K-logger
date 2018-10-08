<?php

namespace App;

use DB;
use Exception;

class Utilities
{
    /**
     * Remove a token from a string.
     *
     * @param string|regex $search  The token to remove from a string
     * @param string       $subject The subject to remove $search from
     *
     * @return string A copy of `$search` with `$subject` removed from it
     */
    public static function strRemove($search, string $subject)
    {
        return implode('', explode($search, $subject));
    }

    /**
     * Creates a JsonResponse object containing the success message
     *
     * @param string $message The message to render in the frontend
     * @param int    $code    The status code to send to the frontend
     * @param array  $data    Extra data to add to the response, if any
     *
     * @return Illuminate\Http\JsonResponse The JsonResponse object containing data
     *                                      supplied
     */
    public static function successJsonResponse(
        string $message,
        int $code = 200,
        array $data = []
    ) {
        return response()->json(array_merge(['message' => $message], $data), $code);
    }

    /**
     * Creates a JsonResponse object containing the exception
     *
     * @param Exception $e The Exception instance with the data to send to the
     *                     frontend
     *
     * @return Illuminuate\Http\JsonResponse The JsonResponse object containing data
     *                                       from the Exception
     */
    public static function exceptionJsonResponse(Exception $e)
    {
        return response()->json(['error' => $e->getMessage()], $e->getCode());
    }
}
