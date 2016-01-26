require.config({
    baseUrl: '/js',
    paths: {
        'moment': 'bower_components/moment/moment'
    }
});
require([
    "lib/jquery.base64",
    "bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020",
    "timesheetUtils",
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


