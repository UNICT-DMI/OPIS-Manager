<?php

namespace App\Models;

use App\Traits\OpisUtilities;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use OpisUtilities; 

    protected $table = 'dipartimento'; 

    public $timestamps = false; 

    /**
     * @override of model find method 
     * 
     * @return Department
    */
    public static function find(int $id, string $academicYear = null) : Department
    {
        if (null === $academicYear) {

            $academicYear = self::getLastAcademicYear('dipartimento'); 
        }

        return self::where('id', $id)
                ->where('anno_accademico', $academicYear)
                ->first() ?? null; 
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
