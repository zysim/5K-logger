<?php

/**
 * PHP version 7.3
 * HomeController.
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
use App\Utilities;
use DB;
use Exception;

/**
 * HomeController.
 *
 * @category A
 * @package  App\Http\Controllers
 * @author   Shep <test@es.com>
 * @license  https://test.com MIT
 * @link     a
 */
class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Returns the home page.
     *
     * @return View
     */
    public function index()
    {
        return view('home');
    }
}
