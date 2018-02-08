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

    if ($request->has('cds') || $request->has('dipartimento')) {

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

      $result = $result->rightJoin('schede', 'insegnamento.id', '=', 'schede.id_insegnamento');
    }
    else
      $result = DB::table("schede")->leftJoin("insegnamento", "schede.id_insegnamento", "=", "insegnamento.id");

    if ($request->has("insegnamento") && $request->input("insegnamento") != "")
      $result->where("id_insegnamento", $request->input("insegnamento"));

    $result = $result->get();

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
