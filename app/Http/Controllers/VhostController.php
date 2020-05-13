<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use App\Vhost;
use App\Tag;

class VhostController extends Controller
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
    }

    public function index()
    {
        if (request('tag')) {
            $vhosts = Tag::where('name', request('tag'))->firstOrFail()->vhosts;
        } else {
            $vhosts = Vhost::all();
        }

        $this->getRealVhosts("available");
        $this->getRealVhosts("enabled");
       
        
        return view('vhosts.index', ["vhosts" => $vhosts, "realVhosts" => $this->vHostsAvailable]);
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

    public function store()
    {
        $vhost = new Vhost($this->validateVhost());
        $vhost->user_id = 1;
        $vhost->save();
        $vhost->tags()->attach(request('tags'));
        return redirect("/vhosts");
    }

    public function show(Vhost $vhost)
    {
        return view('vhosts.show', ["vhost" => $vhost]);
    }

    public function create()
    {
        return view('vhosts.create', ["tags" => Tag::all()]);
    }

    public function edit(Vhost $vhost)
    {
        return view('vhosts.edit', ["vhost" => $vhost, "tags" => Tag::all()]);
    }

    public function update(Vhost $vhost)
    {
        $vhost->update($this->validateVhost());
        $vhost->tags()->detach(\App\Tag::all());
        $vhost->tags()->attach(request('tags'));
        return redirect($vhost->path());
    }

    private function validateVhost()
    {
        return request()->validate([
            'name' => ['required', 'min:5'],
            'description' => ['required'],
            'config' => ['required'],
            'tags' => 'exists:tags,id'
        ]);
    }
}
