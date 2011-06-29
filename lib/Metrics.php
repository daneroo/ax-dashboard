<?php
class Metrics {
  //groupDocs($keys, array $initial, $reduce, $condition=null, $finalize=null)
  private $mw = NULL;
  function __construct() {
      $this->mw =new MongoWrapper('forms_dev','quests');
  }
  function questInfoLookup(){
    // make a lokup for quest_id -> quest_name, account_id, account.name

    $accounts = $this->mw->findDocs(array("_doctype"=>"account"),array("name"=>true));
    //{"_account_id":true,"_values.name":true, "_creation_date":true, "_modification_date":true}
    $accountNameForId=array();
    foreach ($accounts as $key => $account) {
      $accountNameForId[$account["_id"]]=$account["name"];
    }
    $quests = $this->mw->findDocs(array("_doctype"=>"quest"),array(
      "_account_id"=>true,
      "_values.name"=>true,
      "_creation_date"=>true,
      "_modification_date"=>true));
    $lookup=array();
    foreach ($quests as $key => $quest) {
      $accId = "ID:".$quest["_account_id"];
      $lookup[$quest["_id"]] = array(
        "account_id"=>$accId,
        "account_name"=>array_key_exists($accId,$accountNameForId)?$accountNameForId[$accId]:"Unknown",
        "quest_name"=>$quest["_values"]["name"]
      );
    }
    return $lookup;
  }
  function answersByQuestByDate(){
    $since=date("Y-m-d", strtotime("-30day"));
    $keys = "FN:function(doc) { return { quest_id:doc._quest_id,date:doc._creation_date.substring(0,10)}; }";
    $initial=array("total"=>0);
    $reduce="FN:function(doc,agg) { agg.total += 1; }";
    $condition=array("_doctype"=>"answer","_is_deleted"=>0,"_creation_date"=>array('$gt'=>$since));
    //if ($since)
    $finalize=null;
    $response=$this->mw->groupDocs($keys, $initial, $reduce, $condition);
    
    $questInfoLookup = $this->questInfoLookup();
    //return $questInfoLookup;
    foreach ($response as &$row) {
      if (array_key_exists($row["quest_id"],$questInfoLookup)){
        $questInfo = $questInfoLookup[$row["quest_id"]];
        $row["account_id"] = $questInfo["account_id"];
        $row["account_name"] = $questInfo["account_name"];
        $row["quest_name"] = $questInfo["quest_name"];
      } else {
        // how about a null name ...
        error_log("cannot find questInfo for ".$row["quest_id"]);
      }
    }
    return $response;
  }
  function answersByDate(){
    $keys = "FN:function(doc) { return {date:doc._creation_date.substring(0,10)}; }";
    $initial=array("total"=>0);
    $reduce="FN:function(doc,agg) { agg.total += 1; }";
    $condition=array("_doctype"=>"answer","_is_deleted"=>0);
    //if ($since)
    $finalize=null;
    $response=$this->mw->groupDocs($keys, $initial, $reduce, $condition);
    return $response;
  }
}
?>