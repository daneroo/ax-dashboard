
var globalEditor = {daniel:true};

$(document).ready(function() {
    $.log("jQuery Edit  ready");
    siteCtx = globalSite;

    // template loader init - 
    // modified to use named templates...
    var tmpls=['page','page-inner','page-header','page-footer','page-navbarItm',
    'widget-base','widget-header','widget-paragraph',
    'widget-map','widget-gdocviz','widget-other',
    'widget-edit-header'
    ];
    var tmplBase='/tmpl-edit/';
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
            renderPage(page,siteCtx.site,'#editor');
        });
        
        $('#editor').accordion({ 
          collapsible: true,
          changestart: function(event, ui) { 
            //$.log('acordion change',ui.newHeader);
            var item = ui.newContent.tmplItem();
            //$.log('change',item);
            globalSite.events.push({name:'navigate',id:item.data.id});
            renderPageWidgets(ui.newContent); // jQuery object, activated content
            $('#editor').accordion("resize");
          }
        });
        $('#editor').accordion("activate",false);
        $('.widget h3').live('click',function(){
          var item = $(this).tmplItem();
          console.log('clicked: ',item);
          var clone = $.extend({},item.data,{id:item.parent.data.id})
          $(this).parent().html($.tmpl('widget-edit-header',clone));
        })
        $('.widget .widget-edit-header').live('change',function(){
          var value = $(this).attr('value');
          var item = $(this).tmplItem();
          var wtype = item.data.type;
          var tpl = templateForWidgetType(wtype);
          console.log('changed from: ',item.data.label);
          globalSite.site.pages[0].widgets[0].label=value;
          item.data.label = value;
          //$(this).parent().html($.tmpl('widget-header',item.data));
          $(this).parent().html($.tmpl('widget-header',globalSite.site.pages[0].widgets[0]));
          console.log('changed to: ',value);
          console.log(item);
          globalSite.events.push({name:'render',id:item.data.id});
          
        })

    });  
    
});

