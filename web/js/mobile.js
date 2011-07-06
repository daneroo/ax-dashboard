$.log = function(m) {
    if (window && window.console && window.console.log) {
        window.console.log(arguments.length == 1 ? m : arguments);
    }
};

$(document).ready(function() {
  /*
  var palette = {
    ekoform-thing1:{
      //css:'',
      tmpl:'bla-widget.html'
      json:fn()
      afterrender:{
        $(this).live()
      }
    }
  }*/
  var lorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vulputate faucibus adipiscing. Morbi sit amet ante vel nisl ultrices commodo vitae nec urna. Etiam bibendum eros id dui tincidunt hendrerit. In vel risus purus, in dignissim eros. Aliquam ullamcorper euismod nulla sed vehicula. Morbi vitae dui sed massa ultrices gravida sit amet eget odio. Nam iaculis ultrices consequat. Nulla faucibus ligula quis eros suscipit sed viverra lacus scelerisque. Sed venenatis mi nec elit tincidunt placerat. Nulla sed lacinia neque. Nulla ullamcorper magna at nibh aliquet rutrum ultricies quam facilisis. In pharetra, quam vitae tristique pulvinar, magna justo laoreet neque, non tristique leo sapien sed purus. Praesent enim sapien, fermentum quis cursus et, sodales in velit. Nunc vel eros justo, gravida suscipit eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin suscipit dolor at nulla aliquam vel fringilla libero ullamcorper.',
  'Sed iaculis vulputate massa sed euismod. Proin id nunc in erat porttitor lacinia lobortis ac dui. Sed ultricies semper dolor a sollicitudin. Donec a dapibus dui. Aenean dictum lacus id neque blandit laoreet. Aliquam iaculis nulla sit amet orci dignissim ut convallis lectus egestas. Quisque elementum fringilla turpis, sit amet faucibus felis fermentum nec. Duis tellus nunc, aliquet eget ultricies vitae, fringilla non est. Nulla nec mauris sapien. Phasellus aliquet, diam at aliquam porttitor, est eros posuere ante, quis tempus odio felis vitae mi. Phasellus sed eros diam. Fusce non mauris ac urna tempus sollicitudin.',
  'Nam vehicula ligula non risus porttitor quis egestas urna aliquam. Integer velit dui, rutrum sit amet aliquam commodo, faucibus sed ipsum. Suspendisse vitae eros quis est venenatis molestie in eu sapien. Integer luctus sollicitudin lobortis. Fusce id justo at diam fermentum cursus ut quis nisl. Aliquam erat volutpat. Fusce eget tincidunt leo. Aenean vel nisi id ligula placerat dictum. Morbi lacus tellus, feugiat ut volutpat et, adipiscing sit amet nibh. Cras eu sem sit amet mauris faucibus dapibus. Maecenas dolor orci, consequat ac congue ac, mollis et nisl. Aenean pellentesque, quam non tristique adipiscing, leo est iaculis ipsum, non tincidunt enim massa vel sem. Curabitur luctus, nisl vitae pellentesque cursus, mi nulla laoreet nibh, eu pharetra orci nunc nec est. Ut imperdiet neque et augue fringilla sagittis.',
  'Proin luctus porttitor condimentum. Sed ac mi nibh, vitae aliquet erat. Nulla facilisi. Praesent ornare semper luctus. Aenean vitae orci in purus interdum porttitor in quis mauris. Fusce nec ipsum ante, eu sagittis magna. Morbi nec enim ante. Morbi nec pretium enim. Proin sapien urna, dignissim vitae laoreet sed, tincidunt non elit. Cras lobortis purus enim, id auctor ipsum. Phasellus in turpis faucibus turpis dignissim varius a at enim. Donec hendrerit, ante vel faucibus fringilla, odio orci adipiscing sem, id venenatis quam lacus vel urna.'
  ]
  var widgets = {
    h:{},
    p:{},
    img:{},
    map:{},
  }
  
  function templateForWidgetType(type){
    var templates={
      header:"header-widget"
    }
    var t = templates[type] || "other-widget";
    return t;
  }
  function renderPageWidgets(pageElt){
    pageElt.find('div[data-role=content] .widget').each(function(){
      var item = $(this).tmplItem();
      var tpl = templateForWidgetType(item.data.type);
      $(this).html($.tmpl(tpl,item.data));
    });
    
  }
  var site1 = [  
  { id : 'home', name:'Home', icon:'home',widgets:[
   {type: 'header', level:1,label:'Home'},
    {type:'p', label:lorem[0]}
  ]},
  { id : 'about', name:'About', icon:'info',widgets:[
   {type: 'header', level:1,label:'About'},
   {type:'p', label:lorem[1]}
  ]},
  { id : 'products', name:'Products', icon:'grid',widgets:[
   {type: 'header', level:1,label:'Products'},
    {type:'p', label:lorem[2]}
  ]},
  { id : 'contact', name:'Contact',icon:'star', widgets:[
   {type: 'header', level:1,label:'Contact'},
   {type: 'map', "latlng":{"lat":45.699338,"lng":-71.46033899999998}}
  ] }  
  ];
  $.log("jQuery ready");

  // template loader init - 
  // modified to use named templates...
  var tmpls=['page','header','footer','navbarItm','widget','header-widget','other-widget'];
  var tmplBase='/tmpl/';
  var loadingDfds=[];
  $.each(tmpls,function(index,tmplName){
    var tmplUrl = tmplBase+tmplName+'.html';
    $.tmpload(tmplName, tmplUrl);
    loadingDfds.push($.tmpload(tmplName));
  });
  $.when.apply($,loadingDfds).then(function(/*tmpl,data*/){
    //console.log('then',arguments.length);
    $.tmpl( 'page', site1,{site:site1}).appendTo( "body" );

    $('div[data-role=page]').live('pagebeforeshow pagebeforehide pageshow pagehide',function(event,ui){
      console.log('-',event.type,':',[$(this),ui.prevPage,ui.nextPage]);
    });
    $('div[data-role=page]').live('pagebeforeshow',function(event,ui){
      renderPageWidgets($(this));
    });
    
    $.mobile.changePage( $('#home'), { transition: "fade"} );
  });  
    
});

$(document).bind("mobileinit", function(){
    $.log("mobileinit");
    $.mobile.page.prototype.options.addBackBtn=true;

    /*
    $('#notexist').live('pagebeforecreate',function(event){
        $.log('This page was just inserted into the dom!');
    });
    $('#minisite-step1').live('pagecreate',function(event){
        $.log('This page was just enhanced by jQuery Mobile!');
    });
    */
});
