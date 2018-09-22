<?php

use App\Http\Controllers\NewTimeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */


Route::get('/', function () {
    return view('main');
});

Route::post('add-new-time', 'NewTimeController@newTime')->name('addNew');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
