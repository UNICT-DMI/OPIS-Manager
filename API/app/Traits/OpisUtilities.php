<?php 

namespace App\Traits; 

use Illuminate\Support\Facades\DB;

trait OpisUtilities 
{

    /**
     * Spesso è necessario reperire l'anno più recente registrato
     * in una tabella, questa trait aggiunge un metodo statico per
     * reperire tale dato
     * 
     */

    public static function getLastAcademicYear (string $table)
    {
        return DB::table($table)->max('anno_accademico'); 
    }
}