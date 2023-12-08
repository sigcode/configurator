<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TestProcess;

class TestProcessController extends Controller
{
    //index for list of Buidprocess by test id
    public function index($id)
    {
        $testprocesses = TestProcess::where('test_id', $id)->get();
        return view('testprocesses.index', compact('testprocesses'));
    }

    public function delete(Request $request)
    {
        $testprocess = TestProcess::find($request->id);
        $testprocess->delete();
        return json_encode(['status' => 'deleted']);
    }
}
