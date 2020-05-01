<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'dipartimento'; 

    public $timestamps = false; 

    /**
     * @override of model find method 
     * 
     * @return Department
    */
    public static function find(int $id, string $academicYear = null)
    {
        $academicYear = $academicYear == null
            ? self::getLastAcademicYear()
            : $academicYear; 

        return self::where('id', $id)
                ->where('anno_accademico', $academicYear)
                ->first() ?? null; 
    }

    /**
     * Ritorna l'anno più recente registrato nella tabella cds
     * 
     * @return string 
     */
    private static function getLastAcademicYear() : string 
    {
        return $academicYear = DB::table('dipartimento')
                                ->max('anno_accademico');  
    }

    /**
     * Reperisci la lista dei dipartimenti relativamente
     * all'anno più recente registrato. 
     * 
     * @return array 
     */
    public static function getNewer () : array
    {   
        return DB::SELECT(
            <<<SQL
                SELECT  * 
                FROM    dipartimento 
                WHERE   anno_accademico = (
                    SELECT MAX(anno_accademico) 
                    FROM dipartimento
                )
            SQL
        ); 
    }

    /**
     * Reperisci la lista dei corsi di studio (cds) legati
     * al dipartimento. 
     * 
     * @note:   ricordatevi di eseguire il binding dei parametri
     *          passati alle query raw con il query builder
     * 
     *  @return array
     */
    public function getCds () : array 
    {
        return DB::SELECT(
            <<<SQL
                SELECT  * 
                FROM    cds 
                WHERE   id_dipartimento = ? 
                AND     anno_accademico = (
                    SELECT  MAX(anno_accademico) 
                    FROM    cds
                )
            SQL, 
            [$this->id] 
        ); 
    }
}
