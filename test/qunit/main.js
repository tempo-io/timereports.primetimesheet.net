require.config({
    baseUrl: '/js',
    paths: {
        'moment': 'bower_components/moment/min/moment-with-locales'
    }
});
require([
    "bower_components/moment-timezone/builds/moment-timezone-with-data-2012-2022",
    "timesheetUtils",
    "app/directives/DrawHelper",
    "app/pivottable/PivotKey",
    "app/pivottable/PivotRow",
    "app/pivottable/PivotColumn",
    "app/pivottable/PivotEntry",
    "app/pivottable/TimesheetStrategy",
    "app/pivottable/PivotStrategy",
    "app/pivottable/PivotTable",
    "app/pivottable/ExcelView",
    "app/pivottable/CsvView",
    "app/pivottable/HtmlView"
    ], function () {
        QUnit.start();
    }
);
