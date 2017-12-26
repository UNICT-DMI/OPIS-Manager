<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class opisController extends Controller {

  public function getDepartments() {
    $result = DB::table("dipartimento")->get();

    return response()->json($result);
  }

}
