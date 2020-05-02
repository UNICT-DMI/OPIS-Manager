<?php

namespace App\Http\Controllers;

use App\Models\Cds;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\RetrieveOpis;

class CdsController extends Controller
{
    /**
     * Ottieni una lista di tutti i cds relativi
     * all'ultimo anno accademico (scelta effettuata 
     * nella versione precedente). 
     */
    public function index () 
    {
        $newerCds = Cds::getNewer();     

        return response()->json($newerCds, Response::HTTP_OK); 
    }

    /**
     * Ottieni tutti gli insegnamenti di un CDS relativi
     * all'ultimo anno accademico (scelta effettuata 
     * nella versione precedente). 
     */
    public function getTeachings (int $cds)
    {
        $cds = Cds::find($cds); 

        if (null === $cds) 
            return response()->json([], Response::HTTP_NOT_FOUND); 

        return response()->json($cds->getTeachings(), Response::HTTP_OK); 
    }

    /**
     * Ottieni tutte le schede di un CDS relative ad un anno
     * accademico passato nella query (obbligatorio)
     */
    public function getForms (int $cds, RetrieveOpis $request)
    {
        $cds = Cds::find($cds); 

        if (null === $cds) 
            return response()->json([], Response::HTTP_NOT_FOUND); 

        return response()->json(
            $cds->getFormsByAcademicYear($request->anno_accademico), 
            Response::HTTP_OK
        ); 
    }
}
