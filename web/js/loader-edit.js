function dashboard_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script type="text/javascript" src="'+scripts[i]+'"><\/script>')
  };
};

/* TODO 
  find the base url for all local script... abolute / for now
  use protocol relative urls for 'local' scripts
  http://paulirish.com/2010/the-protocol-relative-url/
*/  
dashboard_load([
  // json2
  "http://cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js",

  // jquery
  "https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js",
  "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js",

  // jQ Templates
  "http://ajax.aspnetcdn.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js",
  // jQ Template loader
  //"/js/tmpload-v1.0.min.js",
  "/js/tmpload-v1.0.js",

  "/js/common.js", 
  "/js/edit.js", 

  // _underscore.js
  //"http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.1.6/underscore-min.js",
  //"http://cdnjs.cloudflare.com/ajax/libs/underscore.string/1.1.4/underscore.string.min.js",

  // google maps
  "http://maps.google.com/maps/api/js?sensor=false",

  // google visualisation
  "http://www.google.com/jsapi",
  //"http://dygraphs.com/dygraph-combined.js", //http://dygraphs.com/
  //"http://dygraphs.com/dygraph-dev.js",

  "/js/data.js"
  ]);
