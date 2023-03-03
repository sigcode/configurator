<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Build;
use App\BuildProcess;

class BuildController extends Controller
{
    //index for list of Builds
    public function index()
    {
        $builds = Build::all();
        return view('builds.index', compact('builds'));
    }

    public function all()
    {
        $builds = Build::all();
        return json_encode($builds);
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
        $build->repo_name = $request->repo_name == null ? '' : $request->repo_name;
        $build->repo_url = $request->repo_url == null ? '' : $request->repo_url;
        $build->repo_branch = $request->repo_branch == null ? 'master' : $request->repo_branch;
        $build->deployment_path = $request->deployment_path == null ? '' : $request->deployment_path;
        $build->has_submodules = $request->has_submodules;
        $build->build_target = $request->build_target == null ? '' : $request->build_target;
        $build->build_type = $request->build_type == null ? 'ant' : $request->build_type;
        $build->save();
        return json_encode($build);
    }

    public function getProcesses(Request $request)
    {
        $build = Build::find($request->id);
        return json_encode($build->buildProcesses);
    }


    public function delete(Request $request)
    {
        $build = Build::find($request->id);
        $build->delete();
        return json_encode(['status' => 'deleted']);
    }

    public function run(Request $request)
    {
        $build = Build::find($request->id);
        $type = $build->build_type;
        $process = new BuildProcess();
        $process->build_id = $build->id;
        $process->status = 'running';
        $process->started_at = date('Y-m-d H:i:s');
        $process->output = 'Build started at ' . $process->started_at . "\n";
        $process->status = 'pending';
        $process->command = "";
        $process->save();
        switch ($type) {
            case 'git':
                $createFolderAndGoToIt = 'mkdir -p ' . $build->deployment_path . ' && cd ' . $build->deployment_path;

                $checkIfRepoExists = $createFolderAndGoToIt  . ' && if [ -d .git ]; then echo "true"; else echo "false"; fi';
                $output = shell_exec($checkIfRepoExists);
                $output = strval($output);
                $process->output .= "Repo exists: " . ($output == "true\n" ? 'true' : 'false') . "\n";
                $process->save();

                $cloneRepo = 'git clone ' . $build->repo_url . ' .';
                $pullAndCheckoutBranch = 'git pull && git checkout ' . $build->repo_branch;

                if ($output == "true\n") {
                    $command = $createFolderAndGoToIt . ' && ' . $pullAndCheckoutBranch;
                    $output = shell_exec($command);
                    $process->output .= $command . "\n";
                    $process->output .= $output;
                    $process->save();
                } else {
                    $command = $createFolderAndGoToIt . ' && ' . $cloneRepo . ' && ' . $pullAndCheckoutBranch;
                    $output = shell_exec($command);
                    $process->output .= $command . "\n";
                    $process->output .= $output;
                    $process->save();
                }
                if ($build->has_submodules == true) {
                    $command =  $createFolderAndGoToIt . ' && git submodule update --init ';
                    $output = shell_exec($command);
                    $process->output .= $command . "\n";
                    $process->output .= $output;
                    $process->save();
                }
                break;
            case 'ant':
                $command = 'cd ' . $build->deployment_path . ' && ant ' . $build->build_target;
                break;
        }
        $process->status = 'success';
        $process->finished_at = date('Y-m-d H:i:s');
        $process->save();

        return json_encode(['status' => 'running']);
    }
}
