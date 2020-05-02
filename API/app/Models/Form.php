<?php

namespace App\Models;

use App\Traits\OpisUtilities;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use OpisUtilities; 

    protected $table = 'schede'; 

    public $timestamps = false; 

    /**
     * @return array 
     */
    public static function getAllByAcademicYear (string $academicYear) : array
    {
        return DB::select(
            <<<SQL
                SELECT		*
                FROM 		schede S 
                RIGHT JOIN 	insegnamento I
                ON			S.id_insegnamento = I.id
                AND 		S.canale = I.canale
                AND			S.id_modulo = I.id_modulo
                AND 		S.anno_accademico = I.anno_accademico
                AND 		S.id_cds = I.id_cds 
                WHERE 		S.anno_accademico = ?
                ORDER BY	I.anno ASC;  
            SQL, [$academicYear]
        ); 
    }

}
