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
Route::get('/vhostsReact', 'VhostcliController@indexreact')->name("vhosts.indexreact");
Route::post('/vhosts', 'VhostController@store');

Route::get('/vhosts/create', 'VhostController@create')->name("vhosts.create");
Route::get('/vhosts/{vhost}', "VhostcliController@show")->name("vhosts.show");
Route::get('/vhosts/{vhost}/edit', "VhostcliController@edit")->name("vhosts.edit");
Route::post('/vhosts/phpversion', "VhostcliController@phpversion")->name("vhosts.phpversion");
Route::post('/vhosts/vhoststatus', "VhostcliController@vhoststatus")->name("vhosts.vhoststatus");
Route::post('/vhosts/updatevhost', "VhostcliController@updatevhost")->name("vhosts.updatevhost");
Route::put('/vhosts/{vhost}', "VhostcliController@update")->name("vhosts.update");
Route::post('/vhosts/startStopVhost', "VhostcliController@startStopVhost")->name("vhosts.startStop");
Route::post('/vhosts/apachectl', "VhostcliController@apachectl")->name("vhosts.apachectl");
Route::post('/vhosts/variousAjax', "VhostcliController@variousAjax")->name("vhosts.div");

// settings
Route::get("/settings", "SettingsController@index")->name("settings.index");
Route::post("/settings/updateCodeServer", "SettingsController@updateCodeServerConfig")->name("settings.update");



//Builds
Route::get("/builds", "BuildController@index")->name("builds.index")->middleware('auth');
Route::post("/builds/update", "BuildController@update")->name("builds.update")->middleware('auth');
Route::post("/builds/all", "BuildController@all")->name("builds.all")->middleware('auth');
Route::post("/builds/run", "BuildController@run")->name("builds.run")->middleware('auth');
Route::post("/builds/delete", "BuildController@delete")->name("builds.delete")->middleware('auth');
Route::post("/builds/flushDeploymentPath", "BuildController@flushDeploymentPath")->name("builds.flushDeploymentPath")->middleware('auth');
Route::post("/processes/delete", "BuildProcessController@delete")->name("processes.delete")->middleware('auth');
Route::post("/builds/getProcesses", "BuildController@getProcesses")->name("builds.getProcesses")->middleware('auth');
//BuildProcesses by Build
Route::get("/builds/{build}/buildprocesses", "BuildProcessesController@index")->name("buildprocesses.index")->middleware('auth');

//BuildProcesses single
Route::get("/buildprocesses/{buildprocess}", "BuildProcessesController@show")->name("buildprocesses.show")->middleware('auth');
