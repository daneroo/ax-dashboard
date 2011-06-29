<?php

class Axial_AppConfig_Config {

    // This class reads environment variables, typically set in a json file
    // whose location is determined by an .htaccess file
    /*
      Here is an example .htacces file
      --------------------------------------------
      <Files appConfig.json>
      Order allow,deny
      Deny from all
      </Files>
      SetEnv axAppConfigFile 'appConfig.json'
      --------------------------------------------
      Here is an example appConfig.json
      {
      "env":"production",
      "docserver":{
      "url":"http://ci-docserver.axialdev.net/index.php",
      "clients":{
      "quests":{
      "account":"questuser",
      "passwd":"questsekret",
      "dbName":"forms",
      "collectionName":"quests"
      },
      "users":{
      "account":"questuser",
      "passwd":"questsekret",
      "dbName":"forms",
      "collectionName":"users"
      }
      }
      }
      }
      --------------------------------------------
     */
    static $values = NULL;

    static function loadIfNotLoaded() {
        if (self::$values == NULL) {
            $configFileName = getenv("axAppConfigFile");
            if ($configFileName != null && file_exists($configFileName)) {
                //error_log("AppConfig_Config load:: loading from " . $configFileName);
                self::$values = json_decode(file_get_contents(getenv("axAppConfigFile")), true);
                //error_log("AppConfig_Config : " . json_encode(self::$values));
            } else {
                error_log("Environment::axAppConfigFile not found (" . $configFileName . ")");
                // so we don't keep doing this...
                self::$values = array();
            }
        }
    }

    function get($key) {
        self::loadIfNotLoaded();
        //error_log("I am inside Axial_AppConfig_Config get(".$key.") = ".  json_encode(self::$values[$key]));
        return self::$values[$key];
    }

    function example() {
        $cfg = new Axial_AppConfig_Config();
        $doc = $cfg->get("docserver");
        $svcURL = $doc["url"];
    }

}

?>