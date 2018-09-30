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

Route::get('/user', function(Request $request) {
    return $request->user();
})->middleware('auth:api', 'throttle:60,1');


Route::middleware('auth.basic.once', 'throttle:60,1')->group(function() {
    Route::get('/add-time', function () {
        return redirect('home');
    });
    Route::post('/add-time', 'TimeController@addTime')->name('addTime');

    Route::get('/get-time', function () {
        return redirect('home');
    });
    Route::get('/get-time/{id}', 'TimeController@getTime');
});
