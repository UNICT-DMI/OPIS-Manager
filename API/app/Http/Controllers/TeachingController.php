<?php

namespace App\Http\Controllers;

use App\Models\Teaching;
use Illuminate\Http\Request;
use App\Traits\OpisUtilities;
use Illuminate\Http\Response;
use App\Http\Requests\RetrieveForms;

class TeachingController extends Controller
{ 
    public function show (int $teaching) 
    {
        $teaching = Teaching::findWithModule($teaching); 

        if (null === $teaching) {

            return response()->json([], Response::HTTP_NOT_FOUND);
        } 

        return response()->json($teaching, Response::HTTP_OK); 
    }
    

    public function getForms(int $teaching, RetrieveForms $request) 
    {
        $teaching = Teaching::find($teaching); 

        if (null === $teaching) {

            return response()->json([], Response::HTTP_NOT_FOUND);
        } 
        
        return response()->json(
            $teaching->getForms($request->canale), 
            Response::HTTP_OK
        ); 
    }
}