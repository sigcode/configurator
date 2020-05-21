<?php

use Illuminate\Support\Facades\Route;

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
    return view('welcome');
});
Route::get('/dashboard', function () {
    return view('welcome');
});
Route::get('/dashboard2', function () {
    return view('welcome2');
});
Auth::routes();
Route::get('/vhosts', 'VhostcliController@index')->name("vhosts.index");
Route::post('/vhosts', 'VhostController@store');

Route::get('/vhosts/create', 'VhostController@create')->name("vhosts.create");
Route::get('/vhosts/{vhost}', "VhostcliController@show")->name("vhosts.show");
Route::get('/vhosts/{vhost}/edit', "VhostcliController@edit")->name("vhosts.edit");

Route::put('/vhosts/{vhost}', "VhostcliController@update")->name("vhosts.update");
Route::post('/vhosts/startStopVhost', "VhostcliController@startStopVhost")->name("vhosts.startStop");
Route::post('/vhosts/apachectl', "VhostcliController@apachectl")->name("vhosts.apachectl");
Route::post('/vhosts/variousAjax', "VhostcliController@variousAjax")->name("vhosts.div");

// settings
Route::get("/settings", "SettingsController@index")->name("settings.index");
Route::post("/settings/updateCodeServer", "SettingsController@updateCodeServerConfig")->name("settings.update");