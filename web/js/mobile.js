
pollParent =function(){
  var siteCtx = parent.globalSite
  var events = siteCtx.events;
  if (events.length>0){
    var event = events.shift();
    $.log('got event: ',event);
    if ('navigate'==event.name && event.id){
      $.mobile.changePage( $('#'+event.id));
    } else if ('render'==event.name && event.id){
      renderPageWidgets($('#'+event.id));
      //$.mobile.changePage( $('#'+event.id));
    }
    
  }
}

$(document).ready(function() {
    $.log("jQuery ready");
    var siteCtx = null;
    if (parent == self){
      $.log("jQuery mobile top frame");
      siteCtx = globalSite;
    } else {
      $.log("jQuery mobile inner frame");
      siteCtx = parent.globalSite;
      setInterval(pollParent,100);
    }

    

    // template loader init - 
    // modified to use named templates...
    var tmpls=['page','page-inner','page-header','page-footer','page-navbarItm',
    'widget-base','widget-header','widget-paragraph',
    'widget-map','widget-gdocviz','widget-other'
    ];
    var tmplBase='/tmpl/';
    var loadingDfds=[];
    $.each(tmpls,function(index,tmplName){
        var tmplUrl = tmplBase+tmplName+'.html';
        $.tmpload(tmplName, tmplUrl);
        loadingDfds.push($.tmpload(tmplName));
    });
    // use apply to pass the array as individual params
    $.when.apply($,loadingDfds).then(function(/*tmpl,data*/){
        console.log('then:',arguments.length);
        $.each(siteCtx.site.pages,function(index,page){
            renderPage(page,siteCtx.site,'body');
        })

        $('div[data-role=page]').live('pagebeforeshow',function(event,ui){
            renderPageWidgets($(this));
        });

        // There is a race here assuming that when $.mobile.activePage is set,
        // It is safe to navigate to a new page (home) by default
        function goHomeWhenReady(){
            if ($.mobile && $.mobile.activePage) {
                var activePageId =$.mobile.activePage.attr('id');
                console.log('active page:',activePageId,' hash:',location.hash);
                if (activePageId=='splash'){
                    startHash = location.hash || '#home';
                    console.log('going to :',startHash);
                    $.mobile.changePage( $(startHash));
                }
            } else {
                console.log('not ready to go home!')
                setTimeout(goHomeWhenReady,10);
            }
        }
        goHomeWhenReady();
    });  
    
});

$(document).bind("mobileinit", function(){
    $.log("mobileinit");
    $.mobile.page.prototype.options.addBackBtn=true;
    var events = 'pagebeforecreate pagecreate pagebeforehide pagebeforeshow pagehide pageshow';
    if(0)$('div[data-role=page]').live(events,function(event,ui){
        console.log('-',event.type,':',[$(this),ui.prevPage,ui.nextPage]);
    });
});
