<?php


function file_exists_includepath($file) {
    //error_log("include path:".get_include_path());
    if (PATH_SEPARATOR == ':') {
        // split on : unless preceded by phar: what about windows?
        $re = '/(?<!phar):/';
        $paths = preg_split($re, get_include_path());
        //error_log("preg_split: ".print_r($paths,true));
    } else {
        $paths = explode(PATH_SEPARATOR, get_include_path());
        //error_log("explode: ".print_r($paths,true));
    }

    foreach ($paths as $path) {
        //error_log("looking for $file in $path");
        $fullpath = $path . DIRECTORY_SEPARATOR . $file;
        if (file_exists($fullpath)) {
            //return true;
            return $fullpath;
        }
    }
    return false;
}

function myautoload($className) {
    //error_log('attempt to load class:' . $className);
//    $prefixes = array("JSONRPC", "DocServer","DocClient","QuestServer","Twig","c7n","Security","PackageName","EkoCards");
//    $found=false;
//    foreach ($prefixes as $prefix) {
//        if (0 === strpos($className, $prefix)) {
//            $found=true;
//        }
//    }
//    if (!$found) {
//        return;
//    }
    $file = str_replace('_', '/', $className) . '.php';
    //error_log('looking for file: ' . $file);
    if (file_exists_includepath($file)) {
        //error_log('file exists: ' . $file);
        require_once $file;
    } else {
        //error_log('file not found: ' . $file);
    }
}

ini_set('unserialize_callback_func', 'spl_autoload_call');
//spl_autoload_register(array(new self, 'myautoload'));
spl_autoload_register('myautoload');
?>