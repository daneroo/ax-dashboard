google.load("visualization", "1", {packages:["corechart","table"]});
google.setOnLoadCallback(drawTable);

var endpointurl = 'http://' + window.location.host + window.location.pathname.replace('mobile.html', 'service.php');    
function getAnswersByDate(callback){
    var url = endpointurl+'/ekoforms/answersByDate';    
    console.log("-byDate");
    $.getJSON(url, function(data) {
      //console.log(data);
      if (callback){
        callback(data);
      }
    });
}

function getAnswersByQuestByDate(callback){
    var url = endpointurl+'/ekoforms/answersByQuestByDate';    
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


