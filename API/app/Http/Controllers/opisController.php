<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


//devo capire da dove vengono chiamate queste funzioni quando eseguo una chiamata get, così da poterne creare una che mi torni tutti i dati di UN INSEGNAMENTO IN BASE AD UN ANNO
class opisController extends Controller {

  
    
  public function getDepartments() {
    $result = DB::select("SELECT * FROM dipartimento WHERE anno_accademico = (SELECT MAX(anno_accademico) FROM dipartimento)");
    return response()->json($result);
  }

  public function getCds($department = "") {

    if ($department != NULL && $department != "") {
      $result = DB::select("SELECT * FROM cds WHERE id_dipartimento=$department AND anno_accademico = (SELECT MAX(anno_accademico) FROM cds)");
    }
    else {
      $result = DB::select("SELECT * FROM cds WHERE anno_accademico = (SELECT MAX(anno_accademico) FROM cds)");
    }

    return response()->json($result);
  }

    
    //prima la chiave primaria sul db era ID e Canale, con l'aggiunta del campo "anno_accademico" diventa ID, Canale ed Anno accademico.
    // in questa getTeachings bisogna aggiungere l'anno accademico nella where. Supponendo di avere nel db diversi record riguardanti lo stesso insegnamento in relazione al canale ED ANNO ACCADEMICO
    // se nella where non specifico l'anno ( che non so come dovrà essere passato alla funzione tramite questo oggetto Request passato come parametro) il risultato sarà errato.
  
    public function getTeachings($cds) {
    if ($cds != "") {
      $result = DB::select("SELECT * FROM insegnamento WHERE id_cds=$cds AND anno_accademico = (SELECT MAX(anno_accademico) FROM insegnamento)");
      return response()->json($result);
    }
  }
    
    public function getSchedeAboutTeaching(Request $request){
        $id_ins = $request->input("id_ins");
        $canale = "S.canale='no'";

        if ($request->has("canale")) {
            $canale = $request->input("canale");
            str_replace("%20"," ",$canale);

            $canale = "(S.canale='".$canale."' OR S.canale='no')";
        }

        $result = DB::select("SELECT * FROM schede S  WHERE S.id_insegnamento='".$id_ins."' AND ".$canale." ORDER BY anno_accademico");

        foreach ($result as $key=>$value) {
          $result[$key]->eta = str_replace("'", '"', $result[$key]->eta);
          $result[$key]->eta = str_replace("u00a0", " ", $result[$key]->eta);
          $result[$key]->eta = (array) json_decode($result[$key]->eta);

          $result[$key]->anno_iscr = str_replace("u00a0", " ", $result[$key]->anno_iscr);
          $result[$key]->anno_iscr = str_replace("'", '"', $result[$key]->anno_iscr);
          $result[$key]->anno_iscr = (array) json_decode($result[$key]->anno_iscr);

          $result[$key]->num_studenti = str_replace("u00a0", " ", $result[$key]->num_studenti);
          $result[$key]->num_studenti = str_replace("'", '"', $result[$key]->num_studenti);
          $result[$key]->num_studenti = (array) json_decode($result[$key]->num_studenti);

          $result[$key]->ragg_uni = str_replace("u00a0", " ", $result[$key]->ragg_uni);
          $result[$key]->ragg_uni = str_replace("'", '"', $result[$key]->ragg_uni);
          $result[$key]->ragg_uni = (array) json_decode($result[$key]->ragg_uni);

          $result[$key]->studio_gg = str_replace("u00a0", " ", $result[$key]->studio_gg);
          $result[$key]->studio_gg = str_replace("'", '"', $result[$key]->studio_gg);
          $result[$key]->studio_gg = (array) json_decode($result[$key]->studio_gg);

          $result[$key]->studio_tot = str_replace("u00a0", " ", $result[$key]->studio_tot);
          $result[$key]->studio_tot = str_replace("'", '"', $result[$key]->studio_tot);
          $result[$key]->studio_tot = (array) json_decode($result[$key]->studio_tot);

          $result[$key]->domande = str_replace("u00a0", " ", $result[$key]->domande);
          $result[$key]->domande = str_replace("'", '"', $result[$key]->domande);
          $result[$key]->domande = (array) json_decode($result[$key]->domande);

          $result[$key]->domande_nf = str_replace("u00a0", " ", $result[$key]->domande_nf);
          $result[$key]->domande_nf = str_replace("'", '"', $result[$key]->domande_nf);
          $result[$key]->domande_nf = (array) json_decode($result[$key]->domande_nf);

          $result[$key]->motivo_nf = str_replace("u00a0", " ", $result[$key]->motivo_nf);
          $result[$key]->motivo_nf = str_replace("l'esame", "l esame", $result[$key]->motivo_nf);
          $result[$key]->motivo_nf = str_replace("l'att", "l att", $result[$key]->motivo_nf);
          $result[$key]->motivo_nf = str_replace("'", '"', $result[$key]->motivo_nf);
          $result[$key]->motivo_nf = str_replace("'", '"', $result[$key]->motivo_nf);
          $result[$key]->motivo_nf = str_replace("l esame", "l'esame", $result[$key]->motivo_nf);
          $result[$key]->motivo_nf = str_replace("l att", "l'att", $result[$key]->motivo_nf);
          $result[$key]->motivo_nf = (array) json_decode($result[$key]->motivo_nf);

          $result[$key]->sugg = str_replace("u00a0", " ", $result[$key]->sugg);
          $result[$key]->sugg = str_replace("u00e0", "à", $result[$key]->sugg);
          $result[$key]->sugg = str_replace("l'att", "l att", $result[$key]->sugg);
          $result[$key]->sugg = str_replace("d'esame", "d esame", $result[$key]->sugg);
          $result[$key]->sugg = str_replace("'", '"', $result[$key]->sugg);
          $result[$key]->sugg = str_replace("l att", "l'att", $result[$key]->sugg);
          $result[$key]->sugg = str_replace("d esame", "d'esame", $result[$key]->sugg);
          $result[$key]->sugg = (array) json_decode($result[$key]->sugg);

          $result[$key]->sugg_nf = str_replace("u00a0", " ", $result[$key]->sugg_nf);
          $result[$key]->sugg_nf = str_replace("u00e0", "à", $result[$key]->sugg_nf);
          $result[$key]->sugg_nf = str_replace("l'att", "l att", $result[$key]->sugg_nf);
          $result[$key]->sugg_nf = str_replace("d'esame", "d esame", $result[$key]->sugg_nf);
          $result[$key]->sugg_nf = str_replace("'", '"', $result[$key]->sugg_nf);
          $result[$key]->sugg_nf = str_replace("l att", "l'att", $result[$key]->sugg_nf);
          $result[$key]->sugg_nf = str_replace("d esame", "d'esame", $result[$key]->sugg_nf);
          $result[$key]->sugg_nf = (array) json_decode($result[$key]->sugg_nf);
        }
        return response()->json($result);
    }

   public function getResults(Request $request) {

    $dip = "";
    $cds = DB::table("cds")->select("id");
    $ins = DB::table("insegnamento")->select("id");
    $schede = DB::table("schede");

    /*if ($request->has("dipartimento") && $request->input("dipartimento") != "") {
      $dip = $request->input("dipartimento");
      $cds->where("id_dipartimento", $dip);
    }*/

    if ($request->has("cds") && $request->input("cds") != "")
      $cds->where("id", $request->input("cds"));

    if ($request->has("insegnamento") && $request->input("insegnamento") != "")
      $ins->where("id", $request->input("insegnamento"));

    //inserisco selezione anno 
      
    $anno_accademico = "";
    if ($request->has("anno_accademico") && $request->input("anno_accademico") != "")  {
        $anno_accademico = $request->input("anno_accademico");
        $ins->where("insegnamento.anno_accademico", $anno_accademico);

        $schede->where("schede.anno_accademico", $anno_accademico);
    } else {
      return "Inserisci anno_accademico";
    }
  
    $cds = $cds->get();

    $cds_ids = array();
    foreach($cds as $id) {
      array_push($cds_ids, $id->id);
    }

    $ins->whereIn("id_cds", $cds_ids);
    $ins = $ins->get();

    $ins_ids = array();
    foreach($ins as $i) {
      array_push($ins_ids, $i->id);
    }

    $schede->whereIn("id_insegnamento", $ins_ids);

    $schede->rightJoin('insegnamento', function($q) {
      $q->on('schede.id_insegnamento', '=', 'insegnamento.id')
        ->on('schede.canale',          '=', 'insegnamento.canale')
        ->on('schede.id_modulo',       '=', 'insegnamento.id_modulo')
        ->on('schede.anno_accademico', '=', 'insegnamento.anno_accademico')
        ->on('schede.id_cds',          '=', 'insegnamento.id_cds');
    });

    // echo str_replace_array('?', $schede->getBindings(), $schede->toSql());
    $result = $schede->get();

    // convert string to JSON
    foreach ($result as $key=>$value) {
      $result[$key]->eta = str_replace("'", '"', $result[$key]->eta);
      $result[$key]->eta = str_replace("u00a0", " ", $result[$key]->eta);
      $result[$key]->eta = (array) json_decode($result[$key]->eta);

      $result[$key]->anno_iscr = str_replace("u00a0", " ", $result[$key]->anno_iscr);
      $result[$key]->anno_iscr = str_replace("'", '"', $result[$key]->anno_iscr);
      $result[$key]->anno_iscr = (array) json_decode($result[$key]->anno_iscr);

      $result[$key]->num_studenti = str_replace("u00a0", " ", $result[$key]->num_studenti);
      $result[$key]->num_studenti = str_replace("'", '"', $result[$key]->num_studenti);
      $result[$key]->num_studenti = (array) json_decode($result[$key]->num_studenti);

      $result[$key]->ragg_uni = str_replace("u00a0", " ", $result[$key]->ragg_uni);
      $result[$key]->ragg_uni = str_replace("'", '"', $result[$key]->ragg_uni);
      $result[$key]->ragg_uni = (array) json_decode($result[$key]->ragg_uni);

      $result[$key]->studio_gg = str_replace("u00a0", " ", $result[$key]->studio_gg);
      $result[$key]->studio_gg = str_replace("'", '"', $result[$key]->studio_gg);
      $result[$key]->studio_gg = (array) json_decode($result[$key]->studio_gg);

      $result[$key]->studio_tot = str_replace("u00a0", " ", $result[$key]->studio_tot);
      $result[$key]->studio_tot = str_replace("'", '"', $result[$key]->studio_tot);
      $result[$key]->studio_tot = (array) json_decode($result[$key]->studio_tot);

      $result[$key]->domande = str_replace("u00a0", " ", $result[$key]->domande);
      $result[$key]->domande = str_replace("'", '"', $result[$key]->domande);
      $result[$key]->domande = (array) json_decode($result[$key]->domande);

      $result[$key]->domande_nf = str_replace("u00a0", " ", $result[$key]->domande_nf);
      $result[$key]->domande_nf = str_replace("'", '"', $result[$key]->domande_nf);
      $result[$key]->domande_nf = (array) json_decode($result[$key]->domande_nf);

      $result[$key]->motivo_nf = str_replace("u00a0", " ", $result[$key]->motivo_nf);
      $result[$key]->motivo_nf = str_replace("l'esame", "l esame", $result[$key]->motivo_nf);
      $result[$key]->motivo_nf = str_replace("l'att", "l att", $result[$key]->motivo_nf);
      $result[$key]->motivo_nf = str_replace("'", '"', $result[$key]->motivo_nf);
      $result[$key]->motivo_nf = str_replace("'", '"', $result[$key]->motivo_nf);
      $result[$key]->motivo_nf = str_replace("l esame", "l'esame", $result[$key]->motivo_nf);
      $result[$key]->motivo_nf = str_replace("l att", "l'att", $result[$key]->motivo_nf);
      $result[$key]->motivo_nf = (array) json_decode($result[$key]->motivo_nf);

      $result[$key]->sugg = str_replace("u00a0", " ", $result[$key]->sugg);
      $result[$key]->sugg = str_replace("u00e0", "à", $result[$key]->sugg);
      $result[$key]->sugg = str_replace("l'att", "l att", $result[$key]->sugg);
      $result[$key]->sugg = str_replace("d'esame", "d esame", $result[$key]->sugg);
      $result[$key]->sugg = str_replace("'", '"', $result[$key]->sugg);
      $result[$key]->sugg = str_replace("l att", "l'att", $result[$key]->sugg);
      $result[$key]->sugg = str_replace("d esame", "d'esame", $result[$key]->sugg);
      $result[$key]->sugg = (array) json_decode($result[$key]->sugg);

      $result[$key]->sugg_nf = str_replace("u00a0", " ", $result[$key]->sugg_nf);
      $result[$key]->sugg_nf = str_replace("u00e0", "à", $result[$key]->sugg_nf);
      $result[$key]->sugg_nf = str_replace("l'att", "l att", $result[$key]->sugg_nf);
      $result[$key]->sugg_nf = str_replace("d'esame", "d esame", $result[$key]->sugg_nf);
      $result[$key]->sugg_nf = str_replace("'", '"', $result[$key]->sugg_nf);
      $result[$key]->sugg_nf = str_replace("l att", "l'att", $result[$key]->sugg_nf);
      $result[$key]->sugg_nf = str_replace("d esame", "d'esame", $result[$key]->sugg_nf);
      $result[$key]->sugg_nf = (array) json_decode($result[$key]->sugg_nf);
    }

    return response()->json($result);
  }

}
