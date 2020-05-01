<?php 

namespace App\Traits; 

use Illuminate\Support\Facades\DB;

trait FixSpecialChars 
{

    /**
     * La vita è brutta
     * 
     */

    public static function fixSpecialCharacters (array $form)
    {
        foreach ($form as $key => $value) {

            $form[$key]->eta = str_replace("'", '"', $form[$key]->eta);
            $form[$key]->eta = str_replace("u00a0", " ", $form[$key]->eta);
            $form[$key]->eta = (array) json_decode($form[$key]->eta);
      
            $form[$key]->anno_iscr = str_replace("u00a0", " ", $form[$key]->anno_iscr);
            $form[$key]->anno_iscr = str_replace("'", '"', $form[$key]->anno_iscr);
            $form[$key]->anno_iscr = (array) json_decode($form[$key]->anno_iscr);
      
            $form[$key]->num_studenti = str_replace("u00a0", " ", $form[$key]->num_studenti);
            $form[$key]->num_studenti = str_replace("'", '"', $form[$key]->num_studenti);
            $form[$key]->num_studenti = (array) json_decode($form[$key]->num_studenti);
      
            $form[$key]->ragg_uni = str_replace("u00a0", " ", $form[$key]->ragg_uni);
            $form[$key]->ragg_uni = str_replace("'", '"', $form[$key]->ragg_uni);
            $form[$key]->ragg_uni = (array) json_decode($form[$key]->ragg_uni);
      
            $form[$key]->studio_gg = str_replace("u00a0", " ", $form[$key]->studio_gg);
            $form[$key]->studio_gg = str_replace("'", '"', $form[$key]->studio_gg);
            $form[$key]->studio_gg = (array) json_decode($form[$key]->studio_gg);
      
            $form[$key]->studio_tot = str_replace("u00a0", " ", $form[$key]->studio_tot);
            $form[$key]->studio_tot = str_replace("'", '"', $form[$key]->studio_tot);
            $form[$key]->studio_tot = (array) json_decode($form[$key]->studio_tot);
      
            $form[$key]->domande = str_replace("u00a0", " ", $form[$key]->domande);
            $form[$key]->domande = str_replace("'", '"', $form[$key]->domande);
            $form[$key]->domande = (array) json_decode($form[$key]->domande);
      
            $form[$key]->domande_nf = str_replace("u00a0", " ", $form[$key]->domande_nf);
            $form[$key]->domande_nf = str_replace("'", '"', $form[$key]->domande_nf);
            $form[$key]->domande_nf = (array) json_decode($form[$key]->domande_nf);
      
            $form[$key]->motivo_nf = str_replace("u00a0", " ", $form[$key]->motivo_nf);
            $form[$key]->motivo_nf = str_replace("l'esame", "l esame", $form[$key]->motivo_nf);
            $form[$key]->motivo_nf = str_replace("l'att", "l att", $form[$key]->motivo_nf);
            $form[$key]->motivo_nf = str_replace("'", '"', $form[$key]->motivo_nf);
            $form[$key]->motivo_nf = str_replace("'", '"', $form[$key]->motivo_nf);
            $form[$key]->motivo_nf = str_replace("l esame", "l'esame", $form[$key]->motivo_nf);
            $form[$key]->motivo_nf = str_replace("l att", "l'att", $form[$key]->motivo_nf);
            $form[$key]->motivo_nf = (array) json_decode($form[$key]->motivo_nf);
      
            $form[$key]->sugg = str_replace("u00a0", " ", $form[$key]->sugg);
            $form[$key]->sugg = str_replace("u00e0", "à", $form[$key]->sugg);
            $form[$key]->sugg = str_replace("l'att", "l att", $form[$key]->sugg);
            $form[$key]->sugg = str_replace("d'esame", "d esame", $form[$key]->sugg);
            $form[$key]->sugg = str_replace("'", '"', $form[$key]->sugg);
            $form[$key]->sugg = str_replace("l att", "l'att", $form[$key]->sugg);
            $form[$key]->sugg = str_replace("d esame", "d'esame", $form[$key]->sugg);
            $form[$key]->sugg = (array) json_decode($form[$key]->sugg);
      
            $form[$key]->sugg_nf = str_replace("u00a0", " ", $form[$key]->sugg_nf);
            $form[$key]->sugg_nf = str_replace("u00e0", "à", $form[$key]->sugg_nf);
            $form[$key]->sugg_nf = str_replace("l'att", "l att", $form[$key]->sugg_nf);
            $form[$key]->sugg_nf = str_replace("d'esame", "d esame", $form[$key]->sugg_nf);
            $form[$key]->sugg_nf = str_replace("'", '"', $form[$key]->sugg_nf);
            $form[$key]->sugg_nf = str_replace("l att", "l'att", $form[$key]->sugg_nf);
            $form[$key]->sugg_nf = str_replace("d esame", "d'esame", $form[$key]->sugg_nf);
            $form[$key]->sugg_nf = (array) json_decode($form[$key]->sugg_nf);

        }

        return $form; 
    }
}