<?php

namespace App\Classes;

class ConfigWriter {

    public static function write(array $config, string $file) : bool {

        if (!is_array($config)) {
            return false;
        }

        if (empty($file)) {
            return false;
        }

        $content = "";

        foreach ($config as $key => $value) {
            $content .= ($content == "" ? "" : "\n") . strtoupper($key) . "=" . '"' . $value ."'";
        }

        $path = dirname($file);
        if (!is_dir($path)) {

            if( !mkdir($path, 755, true) ) {
                die('NO PERMISSIONS TO ACCESS'. $path);
            }

        }

        if (file_put_contents($file, $content) === false) {
            return false;
        }

        return true;

    }

    public static function read(string $file) : array {

        if (!file_exists($file)) {
            return [];
        }

        $content = file_get_contents($file);

        if ($content === false || !is_string($content)) {
            return [];
        }

        $elements = explode("\n", $content);

        if (!is_array($elements)) {
            return [];
        }

        $keyValue = [];

        foreach ($elements as $stringLine) {
            
            // since it's techically allowed to use "=" in a configuration, we shall use the FIRST occurence of "="
            // and split the string there
            $pos = strpos($stringLine, "=");
            if ($pos === false) {
                continue;
            }

            $key   = substr($stringLine, 0, $pos);
            $value = substr($stringLine, $pos + 1);

            $keyValue[$key] = substr($value, 1, -1);

        }

        return $keyValue;

    }


}