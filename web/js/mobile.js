$.log = function(m) {
    if (window && window.console && window.console.log) {
        window.console.log(arguments.length == 1 ? m : arguments);
    }
};

function gen_page(id,header,content){
    var page = {};
    page.elt =  $('<div data-role="page" data-url="' + id + '" id="' +id + '" />')
    page.header = $('<div data-role="header" />');
    if (header) page.header.html(header);
    page.content = $('<div data-role="content" />');
    if (content) page.content.html(content);
    page.elt.append(page.header);
    page.elt.append(page.content);
    return page;
}
function create_page(page_id) {
    // make sure it does not exist already
    if ($("#"+page_id).length>0){
        $.log('skipping page: '+page_id+' already exists');
        return;
    } else {
        $.log('creating page: '+page_id);
    }
    var nupage = gen_page(page_id,'<h1>EkoForms!</h1>', 'Loading ' + page_id + ' text...<br><a href="#ekohome">return to home screen</a>');
    $('body').append(nupage.elt);   
    // do we call page() on 
    nupage.elt.page();

    $.log('done creating page: '+page_id);
    getQuest(page_id,function(quest){
        $.log('starting quest render');
    });
}

$(document).ready(function() {
  $.log("jQuery ready");
  $('#byNone').click(function(){drawTable();});
  $('#byDate').click(function(){drawTable('byDate');});
  $('#byQuest').click(function(){drawTable('byQuest');});
  $.template( 'pageTmpl', $('#pageTmpl') );
  $.template( 'footerTmpl', $('#footerTmpl') );
  $.template( 'navbarItmTmpl', $('#navbarItmTmpl') );
  $.tmpl( 'pageTmpl', [
    { id : 'about', header:'About' },
    { id : 'metrics', header:'Metrics' },
    { id : 'favs', header:'Favorites' },
    { id : 'help', header:'Help' }  
  ]).appendTo( "body" );
});

$(document).bind("mobileinit", function(){
    $.log("mobileinit");

    /*
    $('#notexist').live('pagebeforecreate',function(event){
        $.log('This page was just inserted into the dom!');
    });
    $('#minisite-step1').live('pagecreate',function(event){
        $.log('This page was just enhanced by jQuery Mobile!');
    });
    */
});
