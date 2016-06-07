require.config({
    baseUrl: '/js',
    paths: {
        'moment': 'bower_components/moment/min/moment-with-locales'
    }
});
require([
    "lib/jquery.base64",
    "bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020",
    "timesheetUtils",
    "app/directives/DrawHelper",
    "app/pivottable/PivotKey",
    "app/pivottable/PivotRow",
    "app/pivottable/PivotColumn",
    "app/pivottable/PivotEntry",
    "app/pivottable/TimesheetStrategy",
    "app/pivottable/PivotStrategy",
    "app/pivottable/PivotTable",
    "app/pivottable/ExcelView"
    ], function () {
        QUnit.start();
    }
);


