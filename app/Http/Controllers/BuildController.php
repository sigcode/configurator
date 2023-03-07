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
        $build->build_key = $request->build_key == null ? '' : $request->build_key;
        $build->post_command = $request->post_command;
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

    public function run(Request $request, BuildProcess $process = null)
    {
        $processes = $this->findRunningProcesses($request->id);
        if ($processes->count() > 0) {
            $this->queueProcess($request->id);
            return json_encode(['status' => 'queued']);
        } else if ($process != null) {
            $build = Build::find($request->id);
            $type = $build->build_type;
            $process->status = 'running';
            $process->started_at = date('Y-m-d H:i:s');
            $process->output = 'Build started at ' . $process->started_at . "\n";
            $process->command = "";
            $process->save();
        } else {
            $build = Build::find($request->id);
            $type = $build->build_type;
            $process = new BuildProcess();
            $process->build_id = $build->id;
            $process->status = 'running';
            $process->started_at = date('Y-m-d H:i:s');
            $process->output = 'Build started at ' . $process->started_at . "\n";
            $process->command = "";
            $process->save();
        }
        ini_set('max_execution_time', 0);
        session_write_close();
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
        if ($build->post_command != null) {
            $command = $createFolderAndGoToIt . ' && ' . $build->post_command;
            $output = shell_exec($command);
            $process->output .= $command . "\n";
            $process->output .= $output;
            $process->save();
        }
        $process->status = 'success';
        $process->finished_at = date('Y-m-d H:i:s');
        $process->save();
        $this->runQueue($request->id);
        return json_encode(['status' => 'success']);
    }


    public function flushDeploymentPath(Request $request)
    {
        $build = Build::find($request->id);
        $command = 'rm -rf ' . $build->deployment_path;
        $output = shell_exec($command);
        return json_encode(['status' => 'success']);
    }

    private function runQueue($buildId)
    {
        $process = BuildProcess::where('build_id', $buildId)->where('status', 'queued')->first();
        if ($process != null) {
            $request = new Request();
            $request->id = $buildId;
            $this->run($request, $process);
        }
    }

    private function queueProcess($buildId)
    {
        $process = new BuildProcess();
        $process->build_id = $buildId;
        $process->status = 'queued';
        $process->save();
    }

    private function findRunningProcesses($buildId)
    {
        $processes = BuildProcess::where('build_id', $buildId)->where('status', 'running')->get();
        return $processes;
    }


    public function hook(Request $request)
    {
        $build = Build::where('build_key', $request->key);
        if ($build->count() > 0) {
            $build = $build->first();
            $request->id = $build->id;
            $this->run($request);
            return json_encode(['status' => 'running']);
        } else {
            return json_encode(['status' => 'error']);
        }
    }
}
