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

Route::get('/', function () {
    return view('welcome');
});

// Route::group(['prefix' => 'api'], function() {

//   Route::get("dipartimento",                "opisController@getDepartments"); [fatta]
//   Route::get("cds",                         "opisController@getCds"); [fatta]
//   Route::get("cds/{department}",            "opisController@getCds"); [fatta]
//   Route::get("insegnamento/{cds}",          "opisController@getTeachings"); [fatta]
//   Route::get("schedeInsegnamento",          "opisController@getSchedeAboutTeaching"); [fatta]
//   Route::get("schede",                      "opisController@getResults");
//   Route::get("materia/{id}",                "opisController@getSubject");

// });
