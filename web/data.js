google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {
  var dt = new google.visualization.DataTable(
    {
      cols: [{id: 'task', label: 'Task', type: 'string'},
      {id: 'hours', label: 'Hours per Day', type: 'number'}],
      rows: [{c:[{v: 'Work'}, {v: 11}]},
      {c:[{v: 'Eat'}, {v: 2}]},
      {c:[{v: 'Commute'}, {v: 2}]},
      {c:[{v: 'Watch TV'}, {v:2}]},
      {c:[{v: 'Sleep'}, {v:7, f:'7.000'}]}
      ]
    },
    0.6
  );
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Year');
  data.addColumn('number', 'Sales');
  data.addColumn('number', 'Expenses');
  data.addRows(4);
  data.setValue(0, 0, '2004');
  data.setValue(0, 1, 1000);
  data.setValue(0, 2, 400);
  data.setValue(1, 0, '2005');
  data.setValue(1, 1, 1170);
  data.setValue(1, 2, 460);
  data.setValue(2, 0, '2006');
  data.setValue(2, 1, 660);
  data.setValue(2, 2, 1120);
  data.setValue(3, 0, '2007');
  data.setValue(3, 1, 1030);
  data.setValue(3, 2, 540);

  var chart = new google.visualization.ColumnChart(document.getElementById('viz'));
  chart.draw(data, {width: 400, height: 240, title: 'Company Performance',
  hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
});
}

