<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Build;

class BuildController extends Controller
{
    //index for list of Builds
    public function index()
    {
        $builds = Build::all();
        return view('builds.index', compact('builds'));
    }


    //edit for single Build
    // attributes are repo_name, repo_url, repo_branch, deployment_path, has_submodules
    public function update(Request $request)
    {
        if (Request()->id == null) {
            $build = new Build();
        } else {
            $build = Build::find(Request()->id);
        }
        $build->repo_name = $request->repo_name;
        $build->repo_url = $request->repo_url;
        $build->repo_branch = $request->repo_branch;
        $build->deployment_path = $request->deployment_path;
        $build->has_submodules = $request->has_submodules;
        $build->save();
        return json_encode($build);
    }
}
