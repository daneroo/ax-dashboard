<?php

// STUB - START
$APPROOT = dirname(__FILE__);
$LIBDIR = dirname($APPROOT) . DIRECTORY_SEPARATOR . 'lib';
set_include_path(get_include_path() . PATH_SEPARATOR . $LIBDIR);
require_once 'Axial/Autoload/Exec.php';
// STUB - END

//header("Content-Type: text/plain");

function selfURL() {
    $s = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
    $protocol = strleft(strtolower($_SERVER["SERVER_PROTOCOL"]), "/") . $s;
    $port = ($_SERVER["SERVER_PORT"] == "80") ? "" : (":" . $_SERVER["SERVER_PORT"]);
    return $protocol . "://" . $_SERVER['SERVER_NAME'] . $port . $_SERVER['REQUEST_URI'];
}

function strleft($s1, $s2) {
    return substr($s1, 0, strpos($s1, $s2));
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  //$_REQUEST["q"]
  //$_SERVER["REQUEST_URI"] = /service.php/coco?q=234
  //$_SERVER["PATH_INFO"]	/coco
  $metrics = new Metrics();
  if ($_SERVER["PATH_INFO"]=="/ekoforms/answersByDate") {
    $response=$metrics->answersByDate();
  } else if ($_SERVER["PATH_INFO"]=="/ekoforms/answersByQuestByDate") {
      $response=$metrics->answersByQuestByDate();
  } else if ($_SERVER["PATH_INFO"]=="/ekoforms/questInfoLookup") {
        $response=$metrics->questInfoLookup();
  } else {
        $selfurl = selfURL();
        $response = array("header"=>"Dashboard","message"=>"The url to connect to this service is: $selfurl");
  }
  $responseContentType = "application/json; charset=utf-8";
  header("Content-Type: " . $responseContentType);
  echo json_encode($response);
}
?>