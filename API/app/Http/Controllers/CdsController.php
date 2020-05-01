<?php

namespace App\Http\Controllers;

use App\Models\Cds;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CdsController extends Controller
{
    public function index () 
    {
        $newerCds = Cds::getNewer();     

        return response()->json($newerCds, Response::HTTP_OK); 
    }

    public function getTeachings (int $cds)
    {
        $cds = Cds::find($cds); 

        if (null === $cds) 
            return response()->json([], Response::HTTP_NOT_FOUND); 

        return response()->json($cds->getTeachings(), Response::HTTP_OK); 
    }
}
