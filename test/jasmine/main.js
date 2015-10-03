require.config({
    baseUrl: '/js',
    paths: {
        'moment': 'bower_components/moment/moment'
    }
});
require([
    "lib/zef-angularjs-i18n/localization",
    "bower_components/sprintf/src/sprintf",
    "bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020",
    "timesheetUtils",
    "app/modules/configuration",
    "app/modules/directives",
    "app/template/TimesheetMenu",
    "app/controllers/timesheetController",
    "app/controllers/configurationController",
    "app/controllers/worklogController",
    "app/services/pivottableService",
    "app/directives/timesheetDirectives",
    "app/filters/timesheetFilters",
    "app/pivottable/PivotKey",
    "app/pivottable/PivotRow",
    "app/pivottable/PivotColumn",
    "app/pivottable/PivotEntry",
    "app/pivottable/TimesheetStrategy",
    "app/pivottable/PivotStrategy",
    "app/pivottable/PivotTable"
    ], function() {
        require([
            "controller/timesheetControllerTest.js",
            "filter/timesheetFiltersTest.js",
            "directive/timesheetDirectivesTest.js",
            "module/configurationTest.js",
            "service/pivottableServiceTest.js",
            "module/loggingTest.js"
        ], window.onload);
    }
);
