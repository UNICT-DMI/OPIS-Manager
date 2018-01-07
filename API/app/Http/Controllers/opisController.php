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

        $result = $result->rightJoin('schede', 'insegnamento.id', '=', 'schede.id_insegnamento')->get();
      }
      else
        $result = DB::table("schede")->get();

      return response()->json($result);
    }

}
