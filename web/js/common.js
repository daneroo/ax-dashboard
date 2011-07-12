$.log = function(m) {
    if (window && window.console && window.console.log) {
        window.console.log(arguments.length == 1 ? m : arguments);
    }
};
function templateForWidgetType(type){
    var templates={
        header:"widget-header",
        p:"widget-paragraph",
        map:'widget-map',
        gdocviz:'widget-gdocviz'
    }
    var t = templates[type] || "widget-other";
    return t;
}
function renderPage(page,site,topSelector){
    var pageSelect = $('#'+page.id); 
    if (pageSelect.length>0){
        pageElt=$(pageSelect[0]);
        console.log("rendering inner only for page:",page.id,pageElt);
        pageElt.html($.tmpl( 'page-inner', page,{
            site:site
        }));
    } else {
        console.log("rendering outer page:",page.id);
        $.tmpl( 'page', page,{
            site:site
        }).appendTo( topSelector );
    }
}
function renderPageWidgets(pageElt){
  // ?? div[data-role=content] 
    var pageItem = pageElt.tmplItem();
    $.log('render::pageItem.data',pageItem.data);
    pageElt.find('.widget').each(function(){
      var item = $(this).tmplItem();
      var wtype = item.data.type;
      var tpl = templateForWidgetType(wtype);
      //$(this).html('');
      $(this).html($.tmpl(tpl,item.data));

      if ('map'==wtype){
        renderMap($(this).find('.gmap')[0],item.data);
      } else if ('gdocviz'==wtype){
        console.log('rendering a map');
        renderGDocViz($(this).find('.gdocviz')[0],item.data);
      }
    });  
}

function renderGDocViz(element,widgetData) {
  function handlePipeline(response) {
    if (response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    }

    var data = response.getDataTable();
    visualization = new google.visualization.ColumnChart(element);
    visualization.draw(data, {
      //width: 600,
      height: 300, 
      //hAxis: {title: 'Date'},
      title: 'Axial Pipeline'
    });
  }
  // To see the data that this visualization uses, browse to
  // https://spreadsheets.google.com/spreadsheet/ccc?key=0AqeKhjFW4mTFdFpNY1czS3ppZmlhMFhGc2NoMUtpRnc#gid=1
  var query = new google.visualization.Query(widgetData.url);

  // Send the query with a callback function.
  query.send(handlePipeline);

  }
/*
J8Z 1P1 : 45.465715,-75.75516700000003
J8Y 6T7 : 45.453885,-75.73012299999999
J1N 2K7 : 45.368559,-71.99262700000003
*/
function renderMap(element,widgetData) {
    //console.log('wData',widgetData);
    var geocoder = new google.maps.Geocoder();
    var myOptions = {
        zoom: 15,
        //center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(element, myOptions);
    var markersArray=[];
    var markerBounds = new google.maps.LatLngBounds();
    if (widgetData.locations && widgetData.locations.length>0){
        for (var i = 0; i < widgetData.locations.length; i++) {
            var location = widgetData.locations[i];
            var latlng = new google.maps.LatLng(location.latlng.lat,location.latlng.lng);
            if (location.latlng){
                //console.log(location);
                var marker = new google.maps.Marker({
                    position: latlng,//location.latlng,
                    map: map,
                    title: location.label
                });
                markersArray.push(marker);
                markerBounds.extend(latlng);
            }
        }
        map.fitBounds(markerBounds);
    }   
}

globalSite={events:[]};
(function(siteCtx){  
  var lorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vulputate faucibus adipiscing. Morbi sit amet ante vel nisl ultrices commodo vitae nec urna. Etiam bibendum eros id dui tincidunt hendrerit. In vel risus purus, in dignissim eros. Aliquam ullamcorper euismod nulla sed vehicula. Morbi vitae dui sed massa ultrices gravida sit amet eget odio. Nam iaculis ultrices consequat. Nulla faucibus ligula quis eros suscipit sed viverra lacus scelerisque. Sed venenatis mi nec elit tincidunt placerat. Nulla sed lacinia neque. Nulla ullamcorper magna at nibh aliquet rutrum ultricies quam facilisis. In pharetra, quam vitae tristique pulvinar, magna justo laoreet neque, non tristique leo sapien sed purus. Praesent enim sapien, fermentum quis cursus et, sodales in velit. Nunc vel eros justo, gravida suscipit eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin suscipit dolor at nulla aliquam vel fringilla libero ullamcorper.',
  'Sed iaculis vulputate massa sed euismod. Proin id nunc in erat porttitor lacinia lobortis ac dui. Sed ultricies semper dolor a sollicitudin. Donec a dapibus dui. Aenean dictum lacus id neque blandit laoreet. Aliquam iaculis nulla sit amet orci dignissim ut convallis lectus egestas. Quisque elementum fringilla turpis, sit amet faucibus felis fermentum nec. Duis tellus nunc, aliquet eget ultricies vitae, fringilla non est. Nulla nec mauris sapien. Phasellus aliquet, diam at aliquam porttitor, est eros posuere ante, quis tempus odio felis vitae mi. Phasellus sed eros diam. Fusce non mauris ac urna tempus sollicitudin.',
  'Nam vehicula ligula non risus porttitor quis egestas urna aliquam. Integer velit dui, rutrum sit amet aliquam commodo, faucibus sed ipsum. Suspendisse vitae eros quis est venenatis molestie in eu sapien. Integer luctus sollicitudin lobortis. Fusce id justo at diam fermentum cursus ut quis nisl. Aliquam erat volutpat. Fusce eget tincidunt leo. Aenean vel nisi id ligula placerat dictum. Morbi lacus tellus, feugiat ut volutpat et, adipiscing sit amet nibh. Cras eu sem sit amet mauris faucibus dapibus. Maecenas dolor orci, consequat ac congue ac, mollis et nisl. Aenean pellentesque, quam non tristique adipiscing, leo est iaculis ipsum, non tincidunt enim massa vel sem. Curabitur luctus, nisl vitae pellentesque cursus, mi nulla laoreet nibh, eu pharetra orci nunc nec est. Ut imperdiet neque et augue fringilla sagittis.',
  'Proin luctus porttitor condimentum. Sed ac mi nibh, vitae aliquet erat. Nulla facilisi. Praesent ornare semper luctus. Aenean vitae orci in purus interdum porttitor in quis mauris. Fusce nec ipsum ante, eu sagittis magna. Morbi nec enim ante. Morbi nec pretium enim. Proin sapien urna, dignissim vitae laoreet sed, tincidunt non elit. Cras lobortis purus enim, id auctor ipsum. Phasellus in turpis faucibus turpis dignissim varius a at enim. Donec hendrerit, ante vel faucibus fringilla, odio orci adipiscing sem, id venenatis quam lacus vel urna.'
  ]
  var site1 = {
      name:'Axial Micro',
      pages:[{
          id : 'home', 
          name:'Home', 
          icon:'home',
          widgets:[{
              type: 'header', 
              level:1,
              label:'Home'
          },{
              type:'p', 
              label:lorem[0]
          }]
      },{
          id : 'about', 
          name:'About', 
          icon:'info',
          widgets:[{
              type: 'header', 
              level:1,
              label:'About'
          },{
              type:'p', 
              label:lorem[1]
          }]
      },{
          id : 'products', 
          name:'Products', 
          icon:'grid',
          widgets:[{
              type: 'header', 
              level:1,
              label:'Products'
          },{
              type:'p', 
              label:lorem[2]
          }]
      },{
          id : 'contact', 
          name:'Contact',
          icon:'star', 
          widgets:[{
              type: 'header', 
              level:1,
              label:'Contact'
          },{
              type: 'map', 
              locations:[{
                  label:'Axial-Gatineau (J8Y 6T7)',
                  "latlng":{
                      "lat":45.453885,
                      "lng":-75.73012299999999
                  }
              },{
                  label:'Axial-Sherbrooke (J1N 2K7)',
                  "latlng":{
                      "lat":45.368559,
                      "lng":-71.99262700000003
                  }
              }]
          }]
      },{
          id : 'pipeline', 
          name:'Pipeline', 
          icon:'grid',
          widgets:[{
              type: 'header', 
              level:1,
              label:'Pipeline'
          },{
              type:'gdocviz', 
              url:'https://spreadsheets.google.com/spreadsheet/tq?range=A1:B11&gid=1&key=0AqeKhjFW4mTFdFpNY1czS3ppZmlhMFhGc2NoMUtpRnc'                
          }]
      }]
  };
  siteCtx.site=site1;
})(globalSite);

