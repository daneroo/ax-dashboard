google.load("visualization", "1", {packages:["corechart","table"]});
google.setOnLoadCallback(function(){
  drawPipeline();
  drawTable();
});

// returls a root relative url
// path should start with a slash
function getEndpointURL(path){
  path = path||'/';
  var u = window.location.protocol+'//'+window.location.host;
  if (window.location.port!=""){
    u+=":"+window.location.port;
  }
  u+=path;
  return u;
}
// svc shoud start with a slash
function serviceURL(svc){
  return getEndpointURL('/service.php'+svc);      
}


function getAnswersByDate(callback){
    var url = serviceURL('/ekoforms/answersByDate');    
    console.log("-byDate");
    $.getJSON(url, function(data) {
      //console.log(data);
      if (callback){
        callback(data);
      }
    });
}

function getAnswersByQuestByDate(callback){
    var url = serviceURL('/ekoforms/answersByQuestByDate');    
    console.log("-byQuestByDate");
    $.getJSON(url, function(data) {
      //console.log("+byQuestByDate",data);
      if (callback){
        callback(data);
      }
    });
}

function drawChart() {  
  var data = {
    cols: [
    {id: 'date', label: 'Date', type: 'date'},
    {id: 'answers', label: 'Answers', type: 'number'}],
    rows: [/*{c:[{v: new Date("2011/06/21")}, {v: 7}]},*/]
  };
  getAnswersByDate(function(rows){
    if (rows && rows.length>0){
      for (var i=0;i<rows.length;i++){
        var row=rows[i];
        data.rows.push({c:[{v: new Date(row.date)}, {v: row.total}]});
      }
    }
    if (data.rows.length>30){
      data.rows = data.rows.slice(-30);
    }
    var datatable = new google.visualization.DataTable(data,0.6);
    new google.visualization.DateFormat({pattern: 'MMM d'}).format(datatable, 0);
    
    var chart = new google.visualization.ColumnChart(document.getElementById('viz'));
    chart.draw(datatable , {
      width: 800, height: 240, 
      //hAxis: {title: 'Date'},
      title: 'Answers by Date'
    });
    
  });
}

function drawTable(how) {  
  // how is "byDate",byQuest else no group
  var data = {
    cols: [
    {id: 'date', label: 'Date', type: 'date'},
    {id: 'questName', label: 'Quest', type: 'string'},
    {id: 'answers', label: 'Answers', type: 'number'}],
    rows: [/*{c:[{v: new Date("2011/06/21")}, {v: 7}]},*/]
  };
  getAnswersByQuestByDate(function(rows){
    if (rows && rows.length>0){
      for (var i=0;i<rows.length;i++){
        var row=rows[i];
        data.rows.push({c:[{v: new Date(row.date)}, {v: row.quest_name}, {v: row.total}]});
      }
    }
    if (false && data.rows.length>30){
      data.rows = data.rows.slice(-30);
    }
    var datatable = new google.visualization.DataTable(data,0.6);
    
    new google.visualization.DateFormat({pattern: 'MMM d'}).format(datatable, 0);
    var groupBy = (how=="byQuest")?[1]:[0]
    var grouped_datatable = google.visualization.data.group(
          datatable, groupBy,
          [{'column': 2, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);
      
    var dt_to_show = (how=="byDate"||how=="byQuest")?grouped_datatable:datatable;
    var chart = new google.visualization.Table(document.getElementById('tbl'));
    chart.draw(dt_to_show , {
      width: 600, height: 400, 
      //hAxis: {title: 'Date'},
      title: 'Answers by Date'
    });
    var chart2 = new google.visualization.LineChart(document.getElementById('viz'));
    chart2.draw(grouped_datatable , {
      width: 600, height: 300, 
      //hAxis: {title: 'Date'},
      title: 'Answers by Date'
    });
    
    
  });
}


function drawPipeline() {
  // To see the data that this visualization uses, browse to
  // https://spreadsheets.google.com/spreadsheet/ccc?key=0AqeKhjFW4mTFdFpNY1czS3ppZmlhMFhGc2NoMUtpRnc#gid=1
  var query = new google.visualization.Query(
      'https://spreadsheets.google.com/spreadsheet/tq?range=A1:B11&gid=1&key=0AqeKhjFW4mTFdFpNY1czS3ppZmlhMFhGc2NoMUtpRnc');
  
  // Send the query with a callback function.
  query.send(handlePipeline);
}

function handlePipeline(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  visualization = new google.visualization.ColumnChart(document.getElementById('pipeline'));
  visualization.draw(data, {
    width: 600, height: 300, 
    //hAxis: {title: 'Date'},
    title: 'Axial Pipeline'
  });
}