am4core.ready(function () {
  am4core.useTheme(am4themes_dataviz);
  am4core.useTheme(am4themes_animated);
  var day_chartTW = am4core.create('day_chartdiv_TW', am4charts.XYChart);
  day_chartTW.data = data_2;

  var categoryAxis = day_chartTW.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = 'year';
  categoryAxis.renderer.minGridDistance = 100;
  var valueAxis = day_chartTW.yAxes.push(new am4charts.ValueAxis());
  var title = day_chartTW.titles.create();
  title.text = '台灣 COVID-19 疫情每日新增確診數 (2021/05/14~2021/05/31)';
  title.fontSize = 16;
  title.marginBottom = 0;
  var columnSeries = day_chartTW.series.push(new am4charts.ColumnSeries());
  columnSeries.name = '新增確診';
  columnSeries.dataFields.valueY = 'barValue';
  columnSeries.dataFields.categoryX = 'year';
  // columnSeries.columns.template.tooltipText = "[#fff font-size: 12px]{name}: [/][#fff font-size: 12px]{valueY}[/] [#fff]{additional}[/]";
  columnSeries.columns.template.tooltipText =
    '[#fff]{name}: [/][#fff]{valueY}[/] [#fff]{additional}[/]';

  columnSeries.columns.template.tooltipX = am4core.percent(0);
  columnSeries.columns.template.tooltipY = am4core.percent(0);
  columnSeries.columns.template.propertyFields.fillOpacity = 'fillOpacity';
  columnSeries.columns.template.propertyFields.stroke = 'stroke';
  columnSeries.columns.template.propertyFields.strokeWidth = 'strokeWidth';
  columnSeries.columns.template.propertyFields.strokeDasharray = 'columnDash';
  columnSeries.tooltip.label.textAlign = 'middle';

  var lineSeries = day_chartTW.series.push(new am4charts.LineSeries());
  lineSeries.name = '七天移動平均值';
  lineSeries.dataFields.valueY = 'lineValue';
  lineSeries.dataFields.categoryX = 'year';
  lineSeries.stroke = am4core.color('#28a745');
  lineSeries.strokeWidth = 3;
  lineSeries.propertyFields.strokeDasharray = 'lineDash';
  lineSeries.tooltip.label.textAlign = 'middle';
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());
  bullet.fill = am4core.color('#28a745');
  bullet.tooltipText =
    '[#fff]{name}: [/][#fff]{valueY}[/] [#fff]{additional}[/]';

  var circle = bullet.createChild(am4core.Circle);
  circle.radius = 3;
  circle.fill = am4core.color('#fff');
  circle.strokeWidth = 1;
  day_chartTW.legend = new am4charts.Legend();
  day_chartTW.cursor = new am4charts.XYCursor();
  day_chartTW.cursor.xAxis = dateAxis;
  day_chartTW.scrollbarX = new am4core.Scrollbar();
});
