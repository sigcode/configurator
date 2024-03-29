<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BuildProcess;

class BuildProcessController extends Controller
{
    //index for list of Buidprocess by build id
    public function index($id)
    {
        $buildprocesses = BuildProcess::where('build_id', $id)->get();
        return view('buildprocesses.index', compact('buildprocesses'));
    }

    public function delete(Request $request)
    {
        $buildprocess = BuildProcess::find($request->id);
        $buildprocess->delete();
        return json_encode(['status' => 'deleted']);
    }
}
