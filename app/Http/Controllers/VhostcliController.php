<?php

namespace App\Http\Controllers;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Http\Request;

class VhostcliController extends Controller
{
    private $vHostsAvailable = [];
    private $vHostsEnabled = [];
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->getRealVhosts("available");
        $this->getRealVhosts("enabled");
    }

    
    public function index()
    {
        $enabled = [];
        foreach($this->vHostsAvailable as $key => $content) {
            foreach($content as $name => $val) {
                foreach($this->vHostsEnabled as $k => $v) {
                    if(array_key_exists($name, $v)) {
                        $enabled[] = $name;
                    } 
                }
                
            }
            
        }
        
        return view('vhostscli.index', ["realVhosts" => $this->vHostsAvailable, "enabled" => $enabled]);
    }

    public function startStopVhost()
    {
        $name = request()->name;
        $type = request()->type;
        if ($type == "true") {
            $cmd = "sudo a2ensite $name";
        } else {
            $cmd = "sudo a2dissite $name";
        }
        $out = shell_exec($cmd);
        return json_encode($out);
    }

    public function apachectl()
    {
        
        $command = request()->command;
        $cmd = "sudo apachectl $command 2>&1";
        $out = shell_exec($cmd);

        return json_encode($out);
    }


    public function edit(String $param)
    {
        
        $vhost = null;
        foreach ($this->vHostsAvailable as $key => $con) {
            foreach ($con as $name => $content) {
                if ($name == $param) {
                    $vhost = $content;
                }
            }
        }
        
        return view('vhostscli.edit', ["content" => $vhost, "name" => $param]);
    }

    private function getRealVhosts(String $type)
    {
        $process = new Process(["ls", "/etc/apache2/sites-".$type]);
        $process->run();
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }
        $var = "vHosts".ucfirst($type);
        $vhosts = $process->getOutput();
        $this->$var = array_filter(explode("\n", $vhosts));
        $this->fillVhostContent($type);
    }

    public function variousAjax()
    {
        $type = request()->type;

        switch($type) {
            case "rename":
                return json_encode($this->renameVhost());
            break;
            default;
            break;
        }
    }

    private function renameVhost()
    {
        $old = request()->old;
        $new = request()->new;
        if ($old == "" || $new == "") {
            $out = "Fail - both values need to be filled";
        } else {
            $cmd = "sudo mv /etc/apache2/sites-available/".$old." /etc/apache2/sites-available/".$new. " 2>&1";
            $out = shell_exec($cmd);
        }
       
        return "Rename done. ". $out;
    }

    public function update(String $param)
    {
        $vhost = null;
        foreach ($this->vHostsAvailable as $key => $con) {
            foreach ($con as $name => $content) {
                if ($name == $param) {
                    $vhost[$name] = $content;
                }
            }
        }

        $new = request()->request->get("content");
        $old = $vhost[$param];

        $this->saveVhost($new, $param);
        return redirect("/vhosts");
    }

    private function fillVhostContent(String $type)
    {
        $var = "vHosts".ucfirst($type);
        foreach ($this->$var as $key => $vhost) {
            $process = new Process(["cat", "/etc/apache2/sites-".$type."/".$vhost]);
            $process->run();
            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }
            $this->$var[$key] = [$vhost => $process->getOutput()];
        }
    }

    private function saveVhost(String $content, String $filename)
    {
        $cnt = 0;
        $lines = explode("\r\n", $content);
        foreach ($lines as $line) {
            if ($cnt === 0) {
                $cmd = "echo '$line' | sudo tee  /etc/apache2/sites-available/".$filename;
            } else {
                $cmd = "echo '$line' | sudo tee -a /etc/apache2/sites-available/".$filename;
            }
            
            $out = shell_exec($cmd);
            $cnt++;
        }
    }
}
