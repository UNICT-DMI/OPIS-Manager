<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\RetrieveOpis;

class FormController extends Controller
{
    public function getByAcademicYear (RetrieveOpis $request)
    {
        $forms = Form::getAllByAcademicYear($request->anno_accademico); 

        return response()->json($forms, Response::HTTP_OK); 
    }
}
