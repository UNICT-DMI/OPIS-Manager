<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DepartmentController extends Controller
{
    public function index () 
    {
        $newerDepartments = Department::getNewer();     

        return response()->json($newerDepartments, Response::HTTP_OK); 
    }

    public function getCds (int $department)
    {
        $department = Department::find($department); 

        if (null === $department) {

            return response()->json([], Response::HTTP_NOT_FOUND); 
        }

        return response()->json($department->getCds(), Response::HTTP_OK); 
    } 
}
