<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Traits\FixSpecialChars;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\RetrieveOpis;

class OpisController extends Controller
{
    use FixSpecialChars; 
    /**
     * Ritorna i dati riguardanti le schede opis dell'anno 
     * indicato (obbligatoriamente) nella richiesta
     * 
     * REFACTOR IN CORSO.
     * Questa funzione fa troppe cose. 
     * Andrebbe splittata in API differenti
     * 
     */
    // public function getOpisResults (RetrieveOpis $request)
    // {
    //     /** Seleziono gli id di tutti i corsi di studio */
    //     $cds = DB::table('cds')
    //         ->select('id')
    //         ->get(); 
        
    //     /** Seleziono gli id degli insegnamenti di questo anno accademico */
    //     $ins = DB::table('insegnamento')
    //         ->where('anno_accademico', $request->anno_accademico)    
    //         ->select('id'); 
        
    //     /** Seleziono le schede di questo anno accademico */
    //     $forms = DB::table('schede')
    //         ->where('anno_accademico', $request->anno_accademico);     

    //     /** Seleziono il corso di studi se necessario */
    //     if ($request->has('cds'))
    //         $cds->where('id', $request->cds); 

    //     /** Seleziono l'insegnamento se necessario */
    //     if ($request->has('insegnamento'))
    //         $ins->where('id', $request->insegnamento);
        
    //     $cdsIdentifiers = array(); 

    //     /** inutile */
    //     foreach($cds as $id) {
    //         array_push($cdsIdentifiers, $id->id);
    //     }
        
    //     $ins = $ins->whereIn('id_cds', $cdsIdentifiers)
    //                 ->get(); 
        
    //     /** inutile */
    //     $insIdentifiers = array();
    //     foreach($ins as $i) 
    //         array_push($insIdentifiers, $i->id);

    //     /** Seleziono le schede degli insegnamenti selezionati */
    //     $forms->whereIn("id_insegnamento", $insIdentifiers);

    //     /** Filtro ulteriormente in base agli insegnamenti */
    //     $forms->rightJoin('insegnamento', function($q) {
    //         $q->on('schede.id_insegnamento', '=', 'insegnamento.id')
    //           ->on('schede.canale',          '=', 'insegnamento.canale')
    //           ->on('schede.id_modulo',       '=', 'insegnamento.id_modulo')
    //           ->on('schede.anno_accademico', '=', 'insegnamento.anno_accademico')
    //           ->on('schede.id_cds',          '=', 'insegnamento.id_cds');
    //     })->orderBy("anno", "ASC");

    //     $result = $this->fixSpecialCharacters($forms->get()); 

    //     return response()->json($result, Response::HTTP_OK); 
    // }

    // da inserire qui
    public function getForms () 
    {
        // put logics here ...
    }

    // da spostare sul CdsController
    public function getFormsByCds ()
    {
        // put logics here ...
    }

    // da spostare sul TeachingController
    public function getFormsByTeaching ()
    {
        // put logic here ...
    }
}
