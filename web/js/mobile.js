$.log = function(m) {
    if (window && window.console && window.console.log) {
        window.console.log(arguments.length == 1 ? m : arguments);
    }
};

var nextJsonInvocationId=31416;
function jsonrpc(endpointurl,methodName,params,callbackFunction){
    var async=false;
    if (callbackFunction){
        async=true;
    }
    var requestContentType="application/json; charset=utf-8";
    var requestParamWrapper = {
        id: nextJsonInvocationId++,
        method: methodName,
        params: params
    };
    //var dataToPost = $.toJSON(requestParamWrapper);
    var dataToPost = JSON.stringify(requestParamWrapper);
    var response;
    //$.log("invoking: "+dataToPost);
    $.ajax({
        type: 'POST',
        async: async,
        url: endpointurl,
        dataType: 'json',
        contentType: requestContentType,
        data: dataToPost,
        success: function(data, textStatus) {
            response=data;
            //$.log("invoke success");
            //$.log(data);
            if (callbackFunction) {
                callbackFunction(response.result);
            }
        },
        error:function(xhr, textStatus, errorThrown){
            $.log(errorThrown);
        }
    });
    if (async) {
        return requestParamWrapper.id;
    }
    return response.result;
}
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
    nupage.elt.page();
    //add a link on the home screen to navaigate to the new page (just so nav isn't broken if user goes from new page to home screen)
    $('#ekohome div[data-role="content"]').append('<br><br><a href="#' + page_id + '">go to ' + page_id + ' page</a>');
    //refresh the home screen so new link is given proper css
    $('#ekohome div[data-role="content"]').page();
    $.log('done creating page: '+page_id);
    $.log('spawning quest render request');
    qpfix = 'qxx-';
    getQuest(page_id,function(quest){
        $.log('starting quest render');
        for (s=0;s<quest.steps.length;s++) {
            //$.log(quest.steps[s]);
            var fieldsElt = $('<div class="fields" />');
            // ?? <form action="#" method="get"></form>            
            for (f=0;f<quest.steps[s].fields.length;f++) {
                var field = quest.steps[s].fields[f];
                if (field.deleted) continue;
                if ("h1"==field.display_option || "span"==field.display_option) {
                    fieldsElt.append($('<'+field.display_option+' />').append(field.label));
                } else if (field.subtype=='input' || field.subtype=='email' || field.subtype=='choice' ){
                    $.log(field);
                    var fc = $('<div data-role="fieldcontain" />');
                    var fid='f'+field.name;
                    fc.append($('<label for="'+fid+'" />').text(field.label));
                    if (field.subtype!='choice'){
                        fc.append($('<input type="text" name="'+fid+'" id="'+fid+'" value=""  />'));
                    } else {
                        var sel = $('<select name="'+fid+'" id="'+fid+'" data-native-menu="false" />');
                        sel.append($('<option />').text('Choisir une option'));
                        for (var o=0;o<field.options.length;o++){
                            var option = field.options[o];
                            sel.append($('<option />').attr("value",option.name).text(option.label));
                        }
                        fc.append(sel);
                    }
                    fieldsElt.append(fc);
                } else {
                    $.log(field);
                }
            }
            var next = (s<(quest.steps.length-1))?
            '<a href="#'+qpfix+(s+1)+'" data-icon="arrow-r" class="ui-btn-right">Suivant</a>':
            '<a href="#ekohome" data-icon="arrow-r" class="ui-btn-right">Envoyer</a>';
            var step = gen_page(qpfix+s,'<h1>'+quest.name+'</h1>'+next);
            step.content.append(fieldsElt);
            $('body').append(step.elt);   
            step.elt.page();
        }
        $.mobile.changePage('#'+qpfix+0);
        
    });
}

$(document).ready(function() {
  $('#byNone').click(function(){drawTable();});
  $('#byDate').click(function(){drawTable('byDate');});
  $('#byQuest').click(function(){drawTable('byQuest');});
    $("#dynapage").click(function(){
        var minisiteId = 'ID:4df8c724c9519cad5a000002';
        var fbdemoId = 'ID:4df10622c9519c8116000000';
        var qid = minisiteId;
        create_page(qid);
        $.mobile.changePage('#'+qid, "pop", false, true);
    });
    //check if hash exists and that it is not for the home screen
    if (window.location.hash.length>1 && window.location.hash != '#ekohome') {
        page_id = window.location.hash.substring(1);
        $.log('looking for page:'+page_id);
        create_page(page_id);
    }
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
