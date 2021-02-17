require.config({
  baseUrl: '/js',
  paths: {
    moment: 'bower_components/moment/min/moment-with-locales'
  }
})
require([
  'lib/jquery.base64',
  'bower_components/moment-timezone/builds/moment-timezone-with-data-2012-2022',
  'bower_components/ua-parser-js/src/ua-parser.js',
  'timesheetUtils',
  'app/directives/DrawHelper',
  'app/pivottable/PivotKey',
  'app/pivottable/PivotRow',
  'app/pivottable/PivotColumn',
  'app/pivottable/PivotEntry',
  'app/pivottable/TimesheetStrategy',
  'app/pivottable/PivotStrategy',
  'app/pivottable/PivotTable',
  'app/pivottable/PivotTableType',
  'app/pivottable/CsvView',
  'app/pivottable/ExcelView',
  'app/pivottable/HtmlView',
  'app/template/TimesheetMenu',
  'app/template/GadgetSummary'
], function () {
  QUnit.start()
}
)
