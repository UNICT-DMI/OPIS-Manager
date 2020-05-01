<?php

namespace App\Models;

use App\Traits\OpisUtilities;
use App\Traits\FixSpecialChars;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Teaching extends Model
{
    use OpisUtilities, 
        FixSpecialChars; 

    protected $table = 'insegnamento'; 

    public $timestamps = false; 

    /**
     * @override of model find method 
     * 
     * @return Teaching
    */
    public static function find(int $id, string $academicYear = null)
    {
        $academicYear = $academicYear == null
            ? self::getLastAcademicYear('insegnamento')
            : $academicYear; 

        return self::where('id', $id)
                ->where('anno_accademico', $academicYear)
                ->first() ?? null; 
    }

    /**
     * Cerca un insegnamento includendo anche l'identificativo 
     * del modulo nella ricerca. 
     * 
     */
    public static function findWithModule (int $id) 
    {
        return self::where('id', $id)
                ->orWhere('id_modulo', $id)
                ->orderBy('anno_accademico', 'DESC')
                ->first(); 
    }

    /**
     * Ritorna le schede relative ad un insegnamento. 
     * 
     * @review: Controllare che funzioni come la versione
     *          precedente
     * 
     */
    public function getForms (string $canale = null) : array
    {
        $forms = DB::SELECT(
            <<<SQL
                SELECT      *
                FROM        schede S
                WHERE       S.id_insegnamento = ?
                AND         (S.canale LIKE 'no' OR S.canale LIKE '?')
                ORDER BY    anno_accademico
            SQL, [$this->id, $canale == null ? '%%' : $canale]
        ); 

        return $this->fixSpecialCharacters($forms); 
    }
}
