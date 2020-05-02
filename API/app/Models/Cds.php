<?php

namespace App\Models;

use App\Traits\OpisUtilities;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

/** Corso di Laurea (CDS) model */

class Cds extends Model
{
    use OpisUtilities; 

    protected $table = 'cds'; 

    public $timestamps = false; 

    /**
     * @override of model find method 
     * 
     * Il Cds è identificato da id, anno accademico e id del dipartimento. 
     * Tuttavia, nella version precedente il dipartimento non è menzionato.
     * Fino alla review, non includeremo il dipartimento tra le chiavi primarie.
     * 
     * @return Cds
    */
    public static function find(int $id, string $academicYear = null) : Cds
    {
        $academicYear = $academicYear == null
            ? self::getLastAcademicYear('cds')
            : $academicYear; 

        return self::where('id', $id)
                ->where('anno_accademico', $academicYear)
                ->first() ?? null; 
    }


    /**
     * Reperisci la lista dei cds relativamente
     * all'anno più recente registrato. 
     * 
     * @return array 
     */
    public static function getNewer () : array
    {   
        return DB::SELECT(
            <<<SQL
                SELECT  * 
                FROM    cds 
                WHERE   anno_accademico = (
                    SELECT MAX(anno_accademico) 
                    FROM cds
                )
            SQL
        ); 
    }
    

    /**
     * Reperisci la lista degli insegnamenti legati
     * al corso di studi.
     *  
     *  @return array
     */
    public function getTeachings () : array 
    {
        return DB::SELECT(
            <<<SQL
                SELECT  * 
                FROM    insegnamento 
                WHERE   id_cds = ? 
                AND     anno_accademico = (
                    SELECT  MAX(anno_accademico) 
                    FROM    insegnamento
                )
            SQL, 
            [$this->id] 
        );
    }

    /**
     * Reperisci tutte le schede relative al 
     * corso di studi in un anno accademico 
     * passato nei parametri
     * 
     * @return array
     */
    public function getFormsByAcademicYear (string $academicYear) : array 
    {
        return DB::select(
            <<<SQL
                SELECT		*
                FROM 		schede S 
                RIGHT JOIN 	insegnamento I
                ON		    S.id_insegnamento = I.id
                AND 		S.canale = I.canale
                AND		    S.id_modulo = I.id_modulo
                AND 		S.anno_accademico = I.anno_accademico
                AND 		S.id_cds = I.id_cds 
                WHERE 		S.anno_accademico = ?
                AND 		S.id_cds = ?
                ORDER BY	I.anno ASC; 
            SQL, 
            [$academicYear, $this->id]
        ); 
    }


}
