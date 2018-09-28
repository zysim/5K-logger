<?php

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

Route::view('/', 'main')->name('main');

// Authentication routes
Route::namespace('Auth')->group(function() {
    Route::get('/login', 'LoginController@showLoginForm')->name('login');
    Route::post('/login', 'LoginController@login');

    Route::get('/register', 'RegisterController@showRegistrationForm')->name('register');
    Route::post('/register', 'RegisterController@register');

    Route::get('/logout', 'LoginController@logout')->name('logout');

    Route::name('password.')->group(function() {
        Route::get('/reset-password/{token?}', 'ResetPasswordController@showResetForm')->name('request');
    });
    Route::post('/reset-password', 'ResetPasswordController@reset');
});

// Routes for when I'm signed in
Route::middleware(['auth'])->group(function () {
    Route::get('/home', 'HomeController@index')->name('home');
});
