<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class opisController extends Controller {

  public function getDepartments() {
    $result = DB::table("dipartimento")->get();

    return response()->json($result);
  }

  public function getCds($department = "") {

    if ($department != NULL && $department != "")
      $result = DB::table("cds")->where("id_dipartimento", $department)->get();
    else
      $result = DB::table("cds")->get();

    return response()->json($result);
  }

  public function getTeachings(Request $request) {

    $result = DB::table("insegnamento");

    if ($request->has('cds') && $request->input("cds") != "") {
      $cds = $request->input('cds');
      $result->where("id_cds", $cds);
    }

    if ($request->has('dipartimento') && $request->input("dipartimento") != "") {
      $department = $request->input('dipartimento');

      $departments = DB::table("cds")->select("id")->where("id_dipartimento", $department)->get();

      $departs = array();
      foreach ($departments as $dp)
        array_push($departs, $dp->id);

      $result->whereIn("id_cds", $departs);
    }

    $result = $result->get();

    return response()->json($result);
  }

  public function getResults(Request $request) {

    $dip = "";
    $cds = DB::table("cds")->select("id");
    $ins = DB::table("insegnamento")->select("id");
    $schede = DB::table("schede");

    if ($request->has("dipartimento") && $request->input("dipartimento") != "") {
      $dip = $request->input("dipartimento");
      $cds->where("id_dipartimento", $dip);
    }

    if ($request->has("cds") && $request->input("cds") != "")
      $cds->where("id", $request->input("cds"));

    if ($request->has("insegnamento") && $request->input("insegnamento") != "")
      $ins->where("id", $request->input("insegnamento"));

    $cds = $cds->get();

    $cds_ids = array();
    foreach($cds as $id)
      array_push($cds_ids, $id->id);

    $ins->whereIn("id_cds", $cds_ids);
    $ins = $ins->get();

    $ins_ids = array();
    foreach($ins as $id)
      array_push($ins_ids, $id->id);

    $schede->whereIn("id_insegnamento", $ins_ids);

    $schede->leftJoin('insegnamento', function($q) {
      $q->on('schede.id_insegnamento', '=', 'insegnamento.id')->on('schede.canale', '=', 'insegnamento.canale');
    });

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
