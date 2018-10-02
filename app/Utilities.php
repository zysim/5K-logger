<?php

namespace App;

use DB;

class Utilities
{
    /**
     * Remove a token from a string.
     *
     * @param string|regex $search  The token to remove from a string
     * @param string       $subject The subject to remove $search from
     */
    public static function str_remove($search, string $subject)
    {
        return implode('', explode($search, $subject));
    }
}
