<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Classes\ConfigWriter;

class SettingsController extends Controller
{
    
    // filepath
    const CODESERVER_ENV_FILE = "/userdata/codesrv.conf";

    // PATH =
    const CODESERVER_PATH        ='/home/www-data/code-server3:/usr/bin:/usr/:/bin';
    
    // PASSWORD = 
    const CODESERVER_DEFAULT_PW = "1540ph";

    // the fileformat is quite simple
    // we use a key - value pair
    // VAR="CONTENT"

    private function renderCodeServerConfigFile(string $path = null, string $passwort = null) {

        $file = config('app.codeserverconfig', self::CODESERVER_ENV_FILE);
        $config = [
            'PATH' => (!empty($path) ? $path : self::CODESERVER_PATH),
            'PASSWORD' => (!empty($passwort) ? $passwort : self::CODESERVER_DEFAULT_PW)
        ];
    
        return ConfigWriter::write($config, $file);

    }

    public function index() {
        
        
        $file = config('app.codeserverconfig', self::CODESERVER_ENV_FILE);
        $codeServerConfig = ConfigWriter::read($file);

        if (count($codeServerConfig) == 0) {
            $codeServerConfig = [
                'PATH' => self::CODESERVER_PATH,
                'PASSWORD' => self::CODESERVER_DEFAULT_PW
            ];
        }
        
        return view('settings.index', ['codeServerConfig' => (object) $codeServerConfig]);
    }

    public function updateCodeServerConfig(Request $request) {

        $validatedData = $request->validate([
            'PATH' => 'required',
            'PASSWORD' => 'required',
        ]);

        $config = [
            'PATH' => $request->PATH,
            'PASSWORD' => $request->PASSWORD
        ];

        $this->renderCodeServerConfigFile($request->PATH, $request->PASSWORD);

        return back();

    }


}
