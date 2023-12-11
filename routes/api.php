<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post("/builds/hook", "BuildController@hook")->name("builds.hook");
Route::get("/builds/hook", "BuildController@hook")->name("builds.hook");
Route::post("/tests/hook", "TestController@hook")->name("tests.hook");
Route::get("/tests/hook", "TestController@hook")->name("tests.hook");
Route::post("/tests/testhook", "TestController@testhook")->name("builds.testhook");
Route::get("/tests/testhook", "TestController@testhook")->name("builds.testhook");
