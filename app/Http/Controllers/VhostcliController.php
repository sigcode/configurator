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


    public function indexReact()
    {
        $enabled = [];
        foreach ($this->vHostsAvailable as $key => $content) {
            foreach ($content as $name => $val) {
                foreach ($this->vHostsEnabled as $k => $v) {
                    if (array_key_exists($name, $v)) {
                        $enabled[] = $name;
                    }
                }
            }
        }
        return view('vhostscli.indexreact', [
            "realVhosts" => $this->vHostsAvailable,
            "enabled" => $enabled,
        ]);
    }
    public function index()
    {
        $enabled = [];
        foreach ($this->vHostsAvailable as $key => $content) {
            foreach ($content as $name => $val) {
                foreach ($this->vHostsEnabled as $k => $v) {
                    if (array_key_exists($name, $v)) {
                        $enabled[] = $name;
                    }
                }
            }
        }

        return view('vhostscli.index', [
            "realVhosts" => $this->vHostsAvailable,
            "enabled" => $enabled,
        ]);
    }

    public function phpversion()
    {
        $version = substr(phpversion(), 0, 3);
        return json_encode($version);
    }

    public function vhoststatus()
    {
        $enabled = [];
        foreach ($this->vHostsAvailable as $key => $content) {
            foreach ($content as $name => $val) {
                foreach ($this->vHostsEnabled as $k => $v) {
                    if (array_key_exists($name, $v)) {
                        $enabled[] = $name;
                    }
                }
            }
        }
        return json_encode(["enabled" => $enabled, "available" => $this->vHostsAvailable]);
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
        if ($command == "reload") {
            $cmd = "sudo service apache2 reload 2>&1";
        } else {
            $cmd = "sudo apachectl $command 2>&1";
        }
        $out = shell_exec($cmd);

        return json_encode($out);
    }

    public function runCertbot()
    {

        $vhost = request()->name;
        $vhost = str_replace(".conf", "", $vhost);
        $vhost .= ".sucv.de";
        if ($vhost != "") {
            $cmd = "sudo certbot --apache -d $vhost --non-interactive --agree-tos 2>&1";
        }
        exec($cmd, $output, $return);
        return ($output);
    }


    public function updatevhost()
    {
        $content = request()->value;
        $name = request()->name;
        $out = $this->saveVhost($content, $name);
        return json_encode($out);
    }

    public function edit(string $param)
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

    private function getRealVhosts(string $type)
    {
        $process = new Process(["ls", "/etc/apache2/sites-" . $type]);
        $process->run();
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }
        $var = "vHosts" . ucfirst($type);
        $vhosts = $process->getOutput();
        $this->$var = array_filter(explode("\n", $vhosts));
        $this->fillVhostContent($type);
    }

    public function variousAjax()
    {
        $type = request()->type;

        switch ($type) {
            case "rename":
                return json_encode($this->renameVhost());
                break;
            case "deleteVhost":
                return json_encode($this->deleteVhost());
                break;
            case "addVhost":
                return json_encode($this->addVhost());
                break;
            case "getServiceState":
                return json_encode($this->getServiceState());
                break;
            case "serviceCommand":
                return json_encode($this->serviceCommand());
                break;
            case "runCertbot":
                return json_encode($this->runCertbot());
                break;
            case "changePHPVersion":
                return json_encode($this->changePHPVersion());
                break;

            default:
                break;
        }
    }

    private function changePHPVersion()
    {
        $version = request()->version;
        if ($version == "") {
            $out = "Fail - something shitty happend?!";
        } else {
            //put dot between 7 and 2
            $version = substr($version, 0, 1) . "." . substr($version, 1, 1);
            $mod = "php" . $version;
            //check if mod is installed
            $cmd = "a2query -m $mod 2>&1";
            $out = shell_exec($cmd);
            if (!preg_match("/disabled by/", $out)) {
                return "PHP $version is not installed \n";
            } else {
                switch ($version) {

                    case "7.4":
                        $insert = "7.4";
                        $cmd = "sudo a2dismod php8.0 php7.4 php8.1 2>&1";
                        $out = shell_exec($cmd);
                        $cmd = "sudo a2enmod php" . $insert;
                        $out .= shell_exec($cmd);
                        $cmd = "sudo service apache2 reload";
                        $out .= "Reloaded Apache2 with PHP 7.4";
                        $out .= shell_exec($cmd);
                        break;
                    case "8.0":
                        $insert = "8.0";
                        $cmd = "sudo a2dismod php8.0 php7.4 php8.1";
                        $out = shell_exec($cmd);
                        $cmd = "sudo a2enmod php" . $insert;
                        $out .= shell_exec($cmd);
                        $cmd = "sudo service apache2 restart";
                        $out .= "Reloaded Apache2 with PHP 8.0";
                        return $out && shell_exec($cmd);
                        break;
                    case "8.1":
                        $insert = "8.1";
                        $cmd = "sudo a2dismod php8.0 php7.4 php8.1";
                        $out = shell_exec($cmd);
                        $cmd = "sudo a2enmod php8.1";
                        $out .= shell_exec($cmd);
                        $cmd = "sudo service apache2 reload";
                        $out .= "Reloaded Apache2 with PHP 8.1";
                        $out .= shell_exec($cmd);
                        break;
                }
            }
        }
        return $out;
    }


    private function serviceCommand()
    {
        $name = request()->name;
        $command = request()->command;

        if ($name == "") {
            $out = "Fail - something shitty happend?!";
        } else {
            $cmd = "sudo service " . $name . " " . $command . " 2>&1";
            $out = shell_exec($cmd);
        }
        return $out;
    }


    private function getServiceState()
    {
        $name = request()->name;

        if ($name == "") {
            $out = "Fail - something shitty happend?!";
        } else {
            $cmd = "sudo service " . $name . " status 2>&1";
            $out = shell_exec($cmd);
        }
        return $out;
    }

    private function renameVhost()
    {
        $old = request()->old;
        $new = request()->new;
        if ($old == "" || $new == "") {
            $out = "Fail - both values need to be filled";
        } else {
            $cmd =
                "sudo delegator xmv sites-available/" .
                $old .
                " sites-available/" .
                $new .
                " 2>&1";
            $out = shell_exec($cmd);
        }
        return "Rename done. " . $out;
    }

    private function deleteVhost()
    {
        $name = request()->name;

        if ($name == "") {
            $out = "Fail - something shitty happend?!";
        } else {
            $cmd = "sudo delegator xrm sites-available/" . $name . " 2>&1";
            $out = shell_exec($cmd);
        }

        return "Delete done. " . $out;
    }

    private function addVhost()
    {
        $name = request()->name;

        if ($name == "") {
            $out = "Fail - something shitty happend?!";
        } else {
            $cmd = "sudo delegator xtouch sites-available/" . $name . " 2>&1";
            $out = shell_exec($cmd);
        }

        return "Create done. " . $out;
    }

    public function update(string $param)
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

    private function fillVhostContent(string $type)
    {
        $var = "vHosts" . ucfirst($type);
        foreach ($this->$var as $key => $vhost) {
            $process = new Process([
                "cat",
                "/etc/apache2/sites-" . $type . "/" . $vhost,
            ]);
            $process->run();
            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }
            $this->$var[$key] = [$vhost => $process->getOutput()];
        }
    }

    private function saveVhost(string $content, string $filename)
    {
        $cnt = 0;
        $lines = explode("\r\n", $content);
        foreach ($lines as $line) {
            if ($cnt === 0) {
                $cmd =
                    "echo '$line' | sudo delegator xtee  sites-available/" .
                    $filename;
            } else {
                $cmd =
                    "echo '$line' | sudo delegator xtee -a sites-available/" .
                    $filename;
            }

            $out = shell_exec($cmd);
            $cnt++;
        }
        return $out;
    }
}
