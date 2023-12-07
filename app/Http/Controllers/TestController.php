<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Test;
use App\TestProcess;

class TestController extends Controller
{
    //index for list of Builds
    public function index()
    {
        $tests = Test::all();
        return view('tests.index', compact('tests'));
    }

    public function all()
    {
        $tests = Test::all();
        return json_encode($tests);
    }


    //edit for single Test
    // attributes are repo_name, repo_url, repo_branch, deployment_path, has_submodules
    public function update(Request $request)
    {
        if (Request()->id == null) {
            $test = new Test();
        } else {
            $test = Test::find(Request()->id);
        }
        $test->repo_name = $request->repo_name == null ? '' : $request->repo_name;
        $test->repo_url = $request->repo_url == null ? '' : $request->repo_url;
        $test->repo_branch = $request->repo_branch == null ? 'master' : $request->repo_branch;
        $test->deployment_path = $request->deployment_path == null ? '' : $request->deployment_path;
        $test->test_key = $request->test_key == null ? '' : $request->test_key;
        $test->post_command = $request->post_command;
        $test->test_command = $request->test_command;
        $test->save();
        return json_encode($test);
    }

    public function getProcesses(Request $request)
    {
        $test = Test::find($request->id);
        return json_encode($test->testProcesses);
    }


    public function delete(Request $request)
    {
        $test = Test::find($request->id);
        $test->delete();
        return json_encode(['status' => 'deleted']);
    }

    public function run(Request $request, TestProcess $process = null)
    {
        $processes = $this->findRunningProcesses($request->id);
        if ($processes->count() > 0) {
            $this->queueProcess($request->id);
            return json_encode(['status' => 'queued']);
        } else if ($process != null) {
            $test = Test::find($request->id);
            $process->status = 'running';
            $process->started_at = date('Y-m-d H:i:s');
            $process->output = 'Test started at ' . $process->started_at . "\n";
            $process->command = "";
            $process->save();
        } else {
            $test = Test::find($request->id);
            $process = new TestProcess();
            $process->test_id = $test->id;
            $process->status = 'running';
            $process->started_at = date('Y-m-d H:i:s');
            $process->output = 'Test started at ' . $process->started_at . "\n";
            $process->command = "";
            $process->save();
        }
        ini_set('max_execution_time', 0);
        session_write_close();
        $createFolderAndGoToIt = 'mkdir -p ' . $test->deployment_path . ' && cd ' . $test->deployment_path;

        $checkIfRepoExists = $createFolderAndGoToIt  . ' && if [ -d .git ]; then echo "true"; else echo "false"; fi';
        $output = shell_exec($checkIfRepoExists);
        $output = strval($output);
        $process->output .= "Repo exists: " . ($output == "true\n" ? 'true' : 'false') . "\n";
        $process->save();

        $cloneRepo = 'git clone ' . $test->repo_url . ' .';
        $pullAndCheckoutBranch = 'git pull && git checkout ' . $test->repo_branch;

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
        if ($test->has_submodules == true) {
            $command =  $createFolderAndGoToIt . ' && git submodule update --init ';
            $output = shell_exec($command);
            $process->output .= $command . "\n";
            $process->output .= $output;
            $process->save();
        }
        if ($test->post_command != null) {
            $command =  $test->post_command;
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
        $test = Test::find($request->id);
        $command = 'rm -rf ' . $test->deployment_path;
        $output = shell_exec($command);
        return json_encode(['status' => 'success']);
    }

    private function runQueue($testId)
    {
        $process = TestProcess::where('test_id', $testId)->where('status', 'queued')->first();
        if ($process != null) {
            $request = new Request();
            $request->id = $testId;
            $this->run($request, $process);
        }
    }

    private function queueProcess($testId)
    {
        $process = new TestProcess();
        $process->test_id = $testId;
        $process->status = 'queued';
        $process->save();
    }

    private function findRunningProcesses($testId)
    {
        $processes = TestProcess::where('test_id', $testId)->where('status', 'running')->get();
        return $processes;
    }


    public function hook(Request $request)
    {
        $test = Test::where('test_key', $request->key);
        if ($test->count() > 0) {
            $test = $test->first();
            $request->id = $test->id;
            $this->run($request);
            return json_encode(['status' => 'running']);
        } else {
            return json_encode(['status' => 'error']);
        }
    }
}
