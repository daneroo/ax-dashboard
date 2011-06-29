<?php

/**
  @author daniel.lauzon
  @JsonRpcHelp("This is the description of the service")
  @JsonRpcHelp("This is another description of the service")
 */
class MongoWrapper {

    private $dbName = NULL;
    private $collectionName = NULL;

    private function rewriteMongoIn(&$any) {
        if (is_array($any)) { // or is_object?
            foreach ($any as $key => $value) {
                $any[$key] = $this->rewriteMongoIn($value);
            }
        } else if (is_string($any)) {
            $prefix = substr($any, 0, 3);
            if ($prefix == "FN:") {
                return new MongoCode(substr($any, 3));
            } else if ($prefix == "RE:") {
                return new MongoRegex(substr($any, 3));
            } else if ($prefix == "ID:") {
                return new MongoId(substr($any, 3));
            }
        }
        return $any;
    }

    // replaces MongoId classes for "ID:<hexId>" string
    private function rewriteMongoOut(&$any) {
        if (is_array($any)) { // or is_object?
            foreach ($any as $key => $value) {
                $any[$key] = $this->rewriteMongoOut($value);
            }
        } else if (is_object($any) && "MongoId" == get_class($any)) {
            $idStr = "ID:" . $any;
            return $idStr;
        }
        return $any;
    }

    function __construct($dbname, $collectionname) {
        $this->dbName = $dbname;
        $this->collectionName = $collectionname;
    }

    private function getDB() {
        // persistent connection
        $m = new Mongo("mongodb://localhost/", array("persist" => "onlyone"));
        $db = $m->selectDB($this->dbName);
        return $db;
    }

    private function getCollection() {
        $db = $this->getDB();
        $collection = $db->selectCollection($this->collectionName);
        return $collection;
    }

    public function saveDoc($doc) {
        //error_log("saveDoc: " . json_encode(array(Config::$dbName => Config::$collectionName, "d" => $doc)));

        $collection = $this->getCollection();
        $this->rewriteMongoIn($doc);
        // here we have _id as a MongoId
        $collection->save($doc);
        $db = $this->getDB();
        // this form is for db.eval: javascript native MongoId becomes ObjectId
        $idQy = "{_id:ObjectId(\"" . $doc["_id"] . "\")}";
        $db->execute("c7nDocs(db." . $this->collectionName . ",{$idQy})");
        // now rewrite the _id as a string
        //$doc["decorated"] = "Aftersave...";
        $this->rewriteMongoOut($doc);
        return $doc;
    }

    public function deleteDoc($id) {
        $collection = $this->getCollection();

        //true if it works
        return $collection->remove(array('_id' => $this->rewriteMongoIn($id)), true);
        ;
    }

    public function unique($field) {
        $db = $this->getDB();
        $result = $db->command(array("distinct" => $this->collectionName, "key" => $field));


        usort($result["values"], "isort");
        return $result["values"];
    }

    /**
      @JsonRpcHelp("retreive: query,fields,sort,page")
     */
    public function findDocs($query = NULL, $fields = NULL, $sortfields = NULL, $page = array(1, -1)) {
        $cursor = $this->cursorForDocs($query, $fields, $sortfields, $page);
        $pagedDocs = array_values(iterator_to_array($cursor));
        $this->rewriteMongoOut($pagedDocs);
        return $pagedDocs;
    }

    /**
      @JsonRpcHelp("count: query,fields,sort,page")
     */
    public function countDocs($query = array(), $fields=array(), $sortfields = NULL, $page = array(1, -1)) {
        $cursor = $this->cursorForDocs($query, $fields, $sortfields, $page);
        return $cursor->count();
    }

    private function cursorForDocs($query = NULL, $fields = NULL, $sortfields = NULL, $page = NULL) {
        $collection = $this->getCollection();

        $this->rewriteMongoIn($query);

        //1-search criteria, 2-field selection
        if ($query === NULL) { //default : select all documents
            $query = array();
        }
        if ($fields === NULL) { // default: select all fields
            $fields = array();
        }
        $cursor = $collection->find($query, $fields);

        // 3-sort
        if (isset($sortfields) and $sortfields !== NULL) {
            $cursor->sort($sortfields);
        }


        // 4-paging
        $pageSize = 10;  //default pageSize
        if ($page) {

            if (isset($page[1])) {
                $pageSize = intval($page[1]);
            }
            if ($pageSize > 0) {
                if (isset($page[0])) {
                    $pageNumber = intval($page[0]);
                    $zeroBasedPageNumber = $pageNumber - 1;
                    $cursor->skip($zeroBasedPageNumber * $pageSize);
                    $cursor = $cursor->limit($pageSize);
                }
            }
        }

        return $cursor;
    }

    /**
      @JsonRpcHelp("group: keys,initial,reduce,condition,finalize")
     */
    public function groupDocs($keys, array $initial, $reduce, $condition=null, $finalize=null) {
        /*
          public array MongoCollection::group  ( mixed $keys  , array $initial  , MongoCode $reduce  [, array $options = array()  ] )
         * options may include condition, or finalize
         *
         */

        $keys = $this->rewriteMongoIn($keys);
        $reduce = $this->rewriteMongoIn($reduce);
        $options = array();
        if ($condition) {
            $condition = $this->rewriteMongoIn($condition);
            $options['condition'] = $condition;
        }
        if ($finalize) {
            $finalize = $this->rewriteMongoIn($finalize);
            $options['finalize'] = $finalize;
        }
        $collection = $this->getCollection();
        $groupedDocs = $collection->group($keys, $initial, $reduce, $options);
        $this->rewriteMongoOut($groupedDocs);
        return $groupedDocs["retval"];
    }

}

function isort($a, $b) {
    return strtolower($a) > strtolower($b);
}

?>
