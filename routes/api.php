<?php
// @codingStandardsIgnoreStart

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api', 'throttle:60,1');


Route::middleware('auth.basic.once', 'throttle:60,1')->group(function () {
    Route::get('/add-run', function () {
        return redirect('home');
    });
    Route::post('/add-run', 'RunController@addRun')->name('addRun');

    Route::get('/get-run', function () {
        return redirect('home');
    });
    Route::get('/get-run/{id}', 'RunController@getRunById')->where('id', '^[a-zA-Z0-9]{32}$');
    Route::get('/get-run/all', 'RunController@getAllRuns');
});
