<?php

namespace App;

use DB;

class Utilities
{
    /**
     * Remove a token from a string.
     * 
     * @param mixed $search The token to remove from a string
     */
    public static function str_remove(mixed $search, mixed $subject)
    {
        return implode('', explode($search, $subject));
    }
}
