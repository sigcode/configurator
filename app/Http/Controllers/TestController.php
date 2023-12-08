<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Test;
use App\TestProcess;

class TestController extends Controller
{

    const TEST_OUTPUT_DIR = "/cypress/results/";
    const TEST_MOCHA_OUTPUT_DIR = "/mochawesome-report/";
    const TEST_TARGET_DIR = "/bundles/";
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

    public function runTest(Request $request, TestProcess $process = null)
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

        if ($test->test_command != null) {
            $command = $createFolderAndGoToIt . ' && ' . $test->test_command;
            $output = shell_exec($command);
            $process->output .= $command . "\n";
            // $process->output .= $output;
            $process->save();
            $this->mergeAndMargeTestResults($test, $process);
            $this->cleanupTests($test, $process);
            $this->sendMailwithTestReportUrl($test, $process);
        }
        $process->status = 'success';
        $process->finished_at = date('Y-m-d H:i:s');
        $process->save();
        $this->runQueue($request->id);
        return json_encode(['status' => 'success']);
    }

    private function sendMailwithTestReportUrl($test, $process)
    {
        $process_id = $process->id;
        $deployment_path = $test->deployment_path;
        $url = "https://" . preg_replace("/\/var\/www\//", "", $deployment_path) . ".sguenther.codesrv.it/bundles/" . $process_id . "/mochawesome-report/mochawesome.html";
        $to = "simon.guenther@sucurema.com";
        $subject = 'Test Report for ' . $test->repo_name;
        $message = 'Test Report for ' . $test->repo_name . ' is available at ' . $url;
        $headers = "From: admin@test.sguenther.codesrv.it\r\n" .
            "Reply-To: admin@test.sguenther.codesrv.it\r\n" .
            "X-Mailer: PHP/" . phpversion();
        mail($to, $subject, $message, $headers);
    }

    private function mergeAndMargeTestResults($test, $process)
    {
        // merge cypress results
        $command = "rm " . $test->deployment_path . self::TEST_OUTPUT_DIR . "mochawesome.json";
        $output = shell_exec($command);
        $process->output .= $command . "\n";
        $process->output .= $output;
        $process->save();
        $command = 'npx mochawesome-merge ' . $test->deployment_path . self::TEST_OUTPUT_DIR . '*.json > ' . $test->deployment_path . self::TEST_OUTPUT_DIR . 'mochawesome.json';
        $output = shell_exec($command);
        $process->output .= $command . "\n";
        $process->output .= $output;
        $process->save();
        // merge mocha results
        $targetDir =  $test->deployment_path . self::TEST_TARGET_DIR . $process->id . '/';
        //mkdir -p $targetDir
        $command = "mkdir -p " . $targetDir;
        $output = shell_exec($command);
        $process->output .= $command . "\n";
        $process->output .= $output;
        $command = "cd " . $targetDir . ' && npx marge ' . $test->deployment_path . self::TEST_OUTPUT_DIR . 'mochawesome.json ';
        $output = shell_exec($command);
        $process->output .= $command . "\n";
        $process->output .= $output;
        $process->save();

        // move bundled tests to target dir
        // $command = 'mkdir -p ' . $test->deployment_path . self::TEST_TARGET_DIR . $test->id . '/' . ' && mv ' . $test->deployment_path . self::TEST_MOCHA_OUTPUT_DIR . ' mochawesome.html ' . $test->deployment_path . self::TEST_TARGET_DIR . $test->id . '/';
        // $output = shell_exec($command);
        // $process->output .= $command . "\n";
        // $process->output .= $output;
        $process->save();
    }


    private function cleanupTests($test, $process)
    {
        // remove old test results
        $command = "rm " . $test->deployment_path . self::TEST_OUTPUT_DIR . "*.json";
        $output = shell_exec($command);
        $process->output .= $command . "\n";
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
            $command = $createFolderAndGoToIt . ' && ' . $test->post_command;
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
