<?php

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

Route::group(['prefix' => 'v2'],  function() { 
        
    /**
     * Insieme di API per la risorsa Department
     * 
     */
    Route::get('dipartimento', 'DepartmentController@index')
        ->name('dipartimento.index'); 

    Route::get('dipartimento/{department}/cds', 'DepartmentController@getCds')
        ->name('dipartimento.cds'); 

    /**
     * Insieme di API per la risorsa Cds (Corso di laurea)
     * 
     */
    Route::get('cds', 'CdsController@index')
        ->name('cds.index'); 

    Route::get('cds/{cds}/insegnamenti', 'CdsController@getTeachings')
        ->name('cds.insegnamenti'); 

    Route::get('cds/{cds}/schede', 'CdsController@getForms')
        ->name('cds.schede'); 

    /**
     * Insieme di API per la risorsa Teaching (insegnamento)
     * 
     */
    Route::get('insegnamento/{teaching}', 'TeachingController@show')
        ->name('insegnamento.show'); 

    Route::get('insegnamento/{teaching}/schede', 'TeachingController@getForms')
        ->name('insegnamento.schede'); 

    /**
     * Insieme di API per i risultati delle schede OPIS 
     * 
     */
    Route::get('schede', 'FormController@getByAcademicYear')
        ->name('schede.index'); 

}); 