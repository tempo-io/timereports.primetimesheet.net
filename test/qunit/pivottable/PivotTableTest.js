jQuery = {};
//QUnit.config.autostart = false;
QUnit.testStart(function() {
});
QUnit.testSkip = function() {
  QUnit.test(arguments[0] + ' (SKIPPED)', function() {
      QUnit.expect(0);//dont expect any tests
      var li = document.getElementById(QUnit.config.current.id);
      QUnit.done(function() {
          li.style.background = '#EEE';
      });
  });
};
var xtest = QUnit.testSkip;
test("IssueWorkedTimeByUser", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'IssueWorkedTimeByUser', configOptions: {} });
  for (var i in TimeData.issues) {
      var pivotEntries = pivotTable.add(TimeData.issues[i]);
      equal(pivotEntries.length, 2, "pivotEntries");
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 1, "totals");
  equal(totalKeys[0], "admin", "totalKey");
  equal(pivotTable.totals[totalKeys[0]].sum, 172800, "total value");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 6, "rows");
  for (var rowKey in pivotTable.rows) {
      var row = pivotTable.rows[rowKey];
      var columnKeys = Object.keys(row.columns);
      equal(1, columnKeys.length, "columns");
      equal(columnKeys[0], "admin", "columnKey");
      equal(row.columns[columnKeys[0]].entries.length, 2, "column entries");
  }
});
test("IssueWorkedTimeByStatus", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'IssueWorkedTimeByStatus', configOptions: {statuses: TimeStatuses}});
  for (var i in TimeData.issues) {
      var pivotEntries = pivotTable.add(TimeData.issues[i]);
      equal(pivotEntries.length, 2, "pivotEntries");
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 2, "totals");
  equal(totalKeys[0], "Open", "totalKey");
  equal(pivotTable.totals[totalKeys[0]].sum, 100800, "total value 0");
  equal(pivotTable.totals[totalKeys[1]].sum, 72000, "total value 1");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 6, "rows");
  for (var rowKey in pivotTable.rows) {
      var row = pivotTable.rows[rowKey];
      var columnKeys = Object.keys(row.columns);
      equal(1, columnKeys.length, "columns");
      equal(row.columns[columnKeys[0]].entries.length, 2, "column entries");
  }
});
test("IssuePassedTimeByStatus", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'IssuePassedTimeByStatus',
      startDate: '2017-04-05', endDate: '2017-04-11',
      configOptions: {statuses: TimeStatuses, timeInStatusCategories: ["2", "4"]}});
  for (var i in TimeData.issues) {
      var pivotEntries = pivotTable.add(TimeData.issues[i]);
      equal(pivotEntries.length, pivotEntries[0].rowKey.keyValue == 'TIME-4' ? 3 : 1, "pivotEntries " + pivotEntries[0].rowKey.keyValue);
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 3, "totals");
  equal(totalKeys[0], "Open", "totalKey");
  equal(pivotTable.totals[totalKeys[0]].sum, 1842249.382, "total value 0");
  equal(pivotTable.totals[totalKeys[1]].sum, 1397394, "total value 1");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 6, "rows");
  for (var rowKey in pivotTable.rows) {
      var row = pivotTable.rows[rowKey];
      var columnKeys = Object.keys(row.columns);
      equal(rowKey == 'TIME-4' ? 3 : 1, columnKeys.length, "columns " + rowKey);
      equal(row.columns[columnKeys[0]].entries.length, 1, "column entries");
  }
});
test("TimeTracking", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'TimeTracking',
      configOptions: {timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',
          '3timespent', '4diff', '5originalestimateremaining', '6progress']}});
  for (var i in TimeData.issues) {
      var pivotEntries = pivotTable.add(TimeData.issues[i]);
      equal(pivotEntries.length, 1, "pivotEntries");
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 6, "totals");
  equal(totalKeys[0], "1timeoriginalestimate", "totalKey");
  equal(totalKeys[1], "2esttimeremaining", "totalKey");
  equal(totalKeys[2], "3timespent", "totalKey");
  equal(totalKeys[3], "4diff", "totalKey");
  equal(pivotTable.totals[totalKeys[0]].sum, 265600, "total value 1");
  equal(pivotTable.totals[totalKeys[1]].sum, 118800, "total value 2");
  equal(pivotTable.totals[totalKeys[2]].sum, 172800, "total value 3");
  equal(pivotTable.totals[totalKeys[3]].sum, -26000, "total value 4");
  equal(pivotTable.totals[totalKeys[4]].value.value, 92800, "total value 5");
  equal(pivotTable.totals[totalKeys[5]].value.estimate, 118800, "total value 6 (estimate)");
  equal(pivotTable.totals[totalKeys[5]].value.timespent, 172800, "total value 6 (timespent)");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 6, "rows");
  equal(rowKeys[0], "TIME-4", "rowKey");
  var row = pivotTable.rows[rowKeys[0]];
  equal(typeof row.rowKey, "object", "typeof row.key 1");
  equal(row.sum, 0, "row sum");
  var columnKeys = Object.keys(row.columns);
  equal(columnKeys.length, 6, "columns");
  equal(columnKeys[0], "1timeoriginalestimate", "columnKey");
  equal(columnKeys[1], "2esttimeremaining", "columnKey");
  equal(columnKeys[2], "3timespent", "columnKey");
  equal(columnKeys[3], "4diff", "columnKey");
  equal(columnKeys[4], "5originalestimateremaining", "columnKey");
  equal(columnKeys[5], "6progress", "columnKey");
  equal(row.columns[columnKeys[0]].entries.length, 1, "column entries");
});
test("TimeTracking5ReOrderedColumns", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'TimeTracking',
      configOptions: {timeTrackingColumns: ['6progress', '2esttimeremaining',
          '3timespent', '4diff', '5originalestimateremaining']}});
  for (var i in TimeData.issues) {
      var pivotEntries = pivotTable.add(TimeData.issues[i]);
      equal(pivotEntries.length, 1, "pivotEntries");
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 5, "totals");
  equal(totalKeys[0], "2esttimeremaining", "totalKey");
  equal(totalKeys[1], "3timespent", "totalKey");
  equal(totalKeys[2], "4diff", "totalKey");
  equal(pivotTable.totals[totalKeys[0]].sum, 118800, "total value 2");
  equal(pivotTable.totals[totalKeys[1]].sum, 172800, "total value 3");
  equal(pivotTable.totals[totalKeys[2]].sum, -26000, "total value 4");
  equal(pivotTable.totals[totalKeys[3]].value.value, 92800, "total value 5");
  equal(pivotTable.totals[totalKeys[4]].value.estimate, 118800, "total value 6 (estimate)");
  equal(pivotTable.totals[totalKeys[4]].value.timespent, 172800, "total value 6 (timespent)");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 6, "rows");
  equal(rowKeys[0], "TIME-4", "rowKey");
  var row = pivotTable.rows[rowKeys[0]];
  equal(typeof row.rowKey, "object", "typeof row.key 1");
  equal(row.sum, 0, "row sum");
  var columnKeys = Object.keys(row.columns);
  equal(columnKeys.length, 5, "columns");
  equal(columnKeys[0], "2esttimeremaining", "columnKey");
  equal(columnKeys[1], "3timespent", "columnKey");
  equal(columnKeys[2], "4diff", "columnKey");
  equal(columnKeys[3], "5originalestimateremaining", "columnKey");
  equal(columnKeys[4], "6progress", "columnKey");
  equal(row.columns[columnKeys[0]].entries.length, 1, "column entries");
});
test("TimeTrackingGroupedByStatus", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'TimeTracking', categorizeByField: 'project',
      groupByField: 'status', configOptions: {timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',
          '3timespent', '4diff', '5originalestimateremaining', '6progress']}});
  for (var i in TimeData.issues) {
      var pivotEntries = pivotTable.add(TimeData.issues[i]);
      equal(pivotEntries.length, 1, "pivotEntries");
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 6, "totals");
  equal(totalKeys[0], "1timeoriginalestimate", "totalKey");
  equal(totalKeys[1], "2esttimeremaining", "totalKey");
  equal(totalKeys[2], "3timespent", "totalKey");
  equal(totalKeys[3], "4diff", "totalKey");
  equal(pivotTable.totals[totalKeys[0]].sum, 265600, "total value 1");
  equal(pivotTable.totals[totalKeys[1]].sum, 118800, "total value 2");
  equal(pivotTable.totals[totalKeys[2]].sum, 172800, "total value 3");
  equal(pivotTable.totals[totalKeys[3]].sum, -26000, "total value 4");
  equal(pivotTable.totals[totalKeys[4]].value.value, 92800, "total value 5");
  equal(pivotTable.totals[totalKeys[5]].value.estimate, 118800, "total value 6 (estimate)");
  equal(pivotTable.totals[totalKeys[5]].value.timespent, 172800, "total value 6 (timespent)");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 3, "rows");
  equal(rowKeys[2], "Timeship:Open", "rowKey");
  var row = pivotTable.rows[rowKeys[2]];
  equal(typeof row.rowKey, "object", "typeof row.key 1");
  equal(row.sum, 93600, "row sum");
  equal(row.data.length, 3, "data columns");
  equal(row.data[0].values["1timeoriginalestimate"], 93600, "data value 1");
  equal(row.data[0].values["2esttimeremaining"], 0, "data value 2");
  equal(row.data[0].values["3timespent"], 46800, "data value 3");
  equal(row.data[0].values["4diff"], 46800, "data value 4");
  equal(row.data[0].values["5originalestimateremaining"].value, 46800, "data value 5");
  equal(row.data[0].values["6progress"].timespent, 46800, "data value 6 (timespent)");
  equal(row.data[0].values["6progress"].estimate, 0, "data value 6 (estimate)");
  var columnKeys = Object.keys(row.columns);
  equal(columnKeys.length, 6, "columns");
  equal(columnKeys[0], "1timeoriginalestimate", "columnKey");
  equal(columnKeys[1], "2esttimeremaining", "columnKey");
  equal(columnKeys[2], "3timespent", "columnKey");
  equal(columnKeys[3], "4diff", "columnKey");
  equal(columnKeys[4], "5originalestimateremaining", "columnKey");
  equal(columnKeys[5], "6progress", "columnKey");
  equal(row.columns[columnKeys[0]].entries.length, 3, "column entries");
});
var testTimeBalanceCommonCase = function (pivotTable, rowKeysLendth, rowKeysString, row0DataLength) {
    var totalKeys = Object.keys(pivotTable.totals);
    equal(totalKeys.length, 5, "totals");
    equal(totalKeys[0], "3timespent", "totalKey");
    equal(totalKeys[1], "4diff", "totalKey");
    equal(totalKeys[2], "2esttimeremaining", "totalKey");
    equal(pivotTable.totals[totalKeys[0]].sum, 14400, "total value 1");
    equal(pivotTable.totals[totalKeys[1]].sum, -14400, "total value 2");
    equal(pivotTable.totals[totalKeys[2]].sum, 0, "total value 3");
    equal(pivotTable.totals[totalKeys[3]].value.value, -14400, "total value 5");
    equal(pivotTable.totals[totalKeys[4]].value.estimate, 0, "total value 6 (estimate)");
    equal(pivotTable.totals[totalKeys[4]].value.timespent, 14400, "total value 6 (timespent)");
    var rowKeys = Object.keys(pivotTable.rows);
    equal(rowKeys.length, rowKeysLendth, "rows");
    equal(rowKeys.join(','), rowKeysString, "rowKeys");
    var row = pivotTable.rows[rowKeys[0]];
    equal(row.data.length, row0DataLength, "data length");
    equal(row.data[0].values["2esttimeremaining"], 7200, "data value 2");
    equal(row.data[0].values["3timespent"], 0, "data value 3");
    equal(row.data[0].values["4diff"], -7200, "data value 4");
    equal(row.data[0].values["5originalestimateremaining"].value, 0, "data value 5");
    equal(row.data[0].values["6progress"].timespent, 0, "data value 6 (timespent)");
    equal(row.data[0].values["6progress"].estimate, 7200, "data value 6 (estimate)");
    equal(row.data[2].values["2esttimeremaining"], 3600, "data value 2");
    equal(row.data[2].values["3timespent"], 3600, "data value 3");
    equal(row.data[2].values["4diff"], -7200, "data value 4");
    equal(row.data[2].values["5originalestimateremaining"].value, -3600, "data value 5");
    equal(row.data[2].values["6progress"].timespent, 3600, "data value 6 (timespent)");
    equal(row.data[2].values["6progress"].estimate, 3600, "data value 6 (estimate)");
    var row = pivotTable.rows[rowKeys[0]];
    equal(typeof row.rowKey, "object", "typeof row.key 1");
    var columnKeys = Object.keys(row.columns);
    equal(columnKeys.length, 5, "columns");
    equal(columnKeys[0], "3timespent", "columnKey");
    equal(columnKeys[1], "4diff", "columnKey");
    equal(columnKeys[2], "2esttimeremaining", "columnKey");
    equal(columnKeys[3], "5originalestimateremaining", "columnKey");
    equal(columnKeys[4], "6progress", "columnKey");
    equal(row.columns[columnKeys[0]].entries.length, row0DataLength, "column entries");
};
test("TimeBalance5Columns", function() {
    var pivotTable = PivotTableFactory.createPivotTable({startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance',
        configOptions: {timeBalanceColumns: ['6progress', '2esttimeremaining','3timespent', '4diff', '5originalestimateremaining']}});
    for (var i in TimeData.issues) {
        var pivotEntries = pivotTable.add(TimeData.issues[i]);
    }
    testTimeBalanceCommonCase(pivotTable, 2, 'TIME-4,TIME-6', 4);
});
test("TimeBalance5Columns extended data group=jira-administrators", function() {
    var pivotTable = PivotTableFactory.createPivotTable({changelogAuthors: 'admin', startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance',
        configOptions: {timeBalanceColumns: ['6progress', '2esttimeremaining','3timespent', '4diff', '5originalestimateremaining']}});
    for (var i in TimeData.issues) {
        var pivotEntries = pivotTable.add(TimeData.issues[i]);
    }
    pivotTable.add(TimeDataTIME_7);
    testTimeBalanceCommonCase(pivotTable, 2, 'TIME-4,TIME-6', 4);
});
test("TimeBalance5Columns grouped by status categorized by project", function() {
    var pivotTable = PivotTableFactory.createPivotTable({categorizeByField: 'project', groupByField: 'status',
        startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance',
        configOptions: {timeBalanceColumns: ['6progress', '2esttimeremaining','3timespent', '4diff', '5originalestimateremaining']}});
    for (var i in TimeData.issues) {
        var pivotEntries = pivotTable.add(TimeData.issues[i]);
    }
    testTimeBalanceCommonCase(pivotTable, 2, 'Timeship:Done,Timeship:Open', 4);
});
test("TimeBalance5Columns grouped by status", function() {
    var pivotTable = PivotTableFactory.createPivotTable({groupByField: 'status',
        startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance',
        configOptions: {timeBalanceColumns: ['6progress', '2esttimeremaining','3timespent', '4diff', '5originalestimateremaining']}});
    for (var i in TimeData.issues) {
        var pivotEntries = pivotTable.add(TimeData.issues[i]);
    }
    testTimeBalanceCommonCase(pivotTable, 2, 'Done,Open', 4);
});
test("TimeBalance5Columns grouped by project", function() {
    var pivotTable = PivotTableFactory.createPivotTable({groupByField: 'project',
        startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance',
        configOptions: {timeBalanceColumns: ['6progress', '2esttimeremaining','3timespent', '4diff', '5originalestimateremaining']}});
    for (var i in TimeData.issues) {
        var pivotEntries = pivotTable.add(TimeData.issues[i]);
    }
    testTimeBalanceCommonCase(pivotTable, 1, 'Timeship', 6);
});
test("TimeBalance5Columns filter user=user", function() {
    var pivotTable = PivotTableFactory.createPivotTable({user: 'user', startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance',
        configOptions: {timeBalanceColumns: ['6progress', '2esttimeremaining','3timespent', '4diff', '5originalestimateremaining']}});
    for (var i in TimeData.issues) {
        var pivotEntries = pivotTable.add(TimeData.issues[i]);
    }
    var totalKeys = Object.keys(pivotTable.totals);
    equal(totalKeys.length, 0, "totals");
});
test("TimeBalance5Columns filter user=user extended data", function() {
    var pivotTable = PivotTableFactory.createPivotTable({user: 'user', startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance',
        configOptions: {timeBalanceColumns: ['6progress', '2esttimeremaining','3timespent', '4diff', '5originalestimateremaining']}});
    for (var i in TimeData.issues) {
        var pivotEntries = pivotTable.add(TimeData.issues[i]);
    }
    pivotTable.add(TimeDataTIME_7);
    var totalKeys = Object.keys(pivotTable.totals);
    equal(totalKeys.length, 5, "totals");
    equal(pivotTable.totals[totalKeys[0]].sum, 3600, "total value 1");
    equal(pivotTable.totals[totalKeys[1]].sum, 0, "total value 2");
    equal(pivotTable.totals[totalKeys[2]].sum, 3600, "total value 3");
    equal(pivotTable.totals[totalKeys[3]].value.value, 3600, "total value 5");
    equal(pivotTable.totals[totalKeys[4]].value.estimate, 3600, "total value 6 (estimate)");
    equal(pivotTable.totals[totalKeys[4]].value.timespent, 3600, "total value 6 (timespent)");
    var rowKeys = Object.keys(pivotTable.rows);
    equal(rowKeys.length, 1, "rows");
    equal(rowKeys[0], "TIME-7", "rowKey");
    var row = pivotTable.rows[rowKeys[0]];
    equal(row.data.length, 4, "data length");
    equal(row.data[1].values["2esttimeremaining"], 7200, "data value 2");
    equal(row.data[1].values["3timespent"], 0, "data value 3");
    equal(row.data[1].values["4diff"], 0, "data value 4");
    equal(row.data[1].values["5originalestimateremaining"].value, 7200, "data value 5");
    equal(row.data[1].values["6progress"].timespent, 0, "data value 6 (timespent)");
    equal(row.data[1].values["6progress"].estimate, 7200, "data value 6 (estimate)");
    equal(row.data[3].values["2esttimeremaining"], 3600, "data value 2");
    equal(row.data[3].values["3timespent"], 3600, "data value 3");
    equal(row.data[3].values["4diff"], 0, "data value 4");
    equal(row.data[3].values["5originalestimateremaining"].value, 3600, "data value 5");
    equal(row.data[3].values["6progress"].timespent, 3600, "data value 6 (timespent)");
    equal(row.data[3].values["6progress"].estimate, 3600, "data value 6 (estimate)");
    var row = pivotTable.rows[rowKeys[0]];
    equal(typeof row.rowKey, "object", "typeof row.key 1");
    var columnKeys = Object.keys(row.columns);
    equal(columnKeys.length, 5, "columns");
    equal(columnKeys[0], "3timespent", "columnKey");
    equal(columnKeys[1], "4diff", "columnKey");
    equal(columnKeys[2], "2esttimeremaining", "columnKey");
    equal(columnKeys[3], "5originalestimateremaining", "columnKey");
    equal(columnKeys[4], "6progress", "columnKey");
    equal(row.columns[columnKeys[0]].entries.length, 4, "column entries");
});
// see also timeData.js#CookieUtils for locked time frame
test("Timesheet", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, configOptions: {}});
  for (var i in TimeData.issues) {
      var issue = TimeData.issues[i];
      var pivotEntries = pivotTable.add(issue);
      equal(pivotEntries.length, 2, "pivotEntries " + issue.key);
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 7, "totals");
  ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), "totalKey 1");
  ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), "totalKey 2");
  equal(pivotTable.totals[totalKeys[0]].sum, 32400, "total value 1");
  equal(pivotTable.totals[totalKeys[1]].sum, 46800, "total value 2");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 6, "rows");
  equal(rowKeys[0], "TIME-4", "rowKey");
  var row = pivotTable.rows[rowKeys[0]];
  equal(typeof row.rowKey, "object", "typeof row.key");
  equal(row.sum, 7200, "typeof row.key");
  var columnKeys = Object.keys(row.columns);
  equal(columnKeys.length, 7, "columns");
  ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), "totalKey");
  ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), "totalKey");
  equal(row.columns[columnKeys[0]].entries.length, 1, "column entries");
});
test("Timespent", function() {
  var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'Timespent', startDate: '2014-02-24', reportingDay: 1, configOptions: {}});
  for (var i in TimeData.issues) {
      var issue = TimeData.issues[i];
      var pivotEntries = pivotTable.add(issue);
      equal(pivotEntries.length, 2, "pivotEntries " + issue.key);
  }
  var totalKeys = Object.keys(pivotTable.totals);
  equal(totalKeys.length, 1, "totals");
  equal(pivotTable.totals[totalKeys[0]].sum, 172800, "total value 1");
  var rowKeys = Object.keys(pivotTable.rows);
  equal(rowKeys.length, 6, "rows");
  equal(rowKeys[0], "TIME-4", "rowKey");
  var row = pivotTable.rows[rowKeys[0]];
  equal(typeof row.rowKey, "object", "typeof row.key");
  equal(row.sum, 7200, "typeof row.key");
  var columnKeys = Object.keys(row.columns);
  equal(columnKeys.length, 1, "columns");
  ok(totalKeys[0], '3timespent', "totalKey");
  equal(row.columns[columnKeys[0]].entries.length, 2, "column entries");
});
test("TimesheetUtils.convertDate", function() {
    // default
  var date = TimesheetUtils.convertDate("2014-02-24T23:00:00.000");
  equal(date.getDate(), 24, "default day of month");
  // specify author timezone
  date = TimesheetUtils.convertDate("2014-06-24T22:00:00.000+0000", 'Europe/Berlin');
  equal(date.getDate(), 25, "Berlin summer day of month");
  date = TimesheetUtils.convertDate("2014-02-24T22:00:00.000+0000", 'Europe/Berlin');
  equal(date.getDate(), 24, "Berlin winter day of month");
  date = TimesheetUtils.convertDate("2014-02-24T20:00:00.000+0000", 'Europe/Moscow');
  equal(date.getDate(), 25, "Moscow 2014 day of month");
  date = TimesheetUtils.convertDate("2015-02-24T20:00:00.000+0000", 'Europe/Moscow');
  equal(date.getDate(), 24, "Moscow 2015 day of month");
});
test("PivotTable.getOrCreate", function() {
    var getOrCreateObject = {};
    var RecordClass = function(key){this.key = key;};
    PivotTable.getOrCreate(getOrCreateObject, {keyValue:'key1'}, RecordClass);
    PivotTable.getOrCreate(getOrCreateObject, {keyValue:'key1'}, RecordClass);
    PivotTable.getOrCreate(getOrCreateObject, {keyValue:'key2'}, RecordClass);
    var keys = Object.keys(getOrCreateObject);
    equal(keys.length, 2, "#getOrCreateObject() :: length");
    for (var i in keys) {
        ok(keys[i] == 'key1' || keys[i] == 'key2', "#getOrCreateObject() :: key check[ '" + keys[i] + "' ]");
    }
});
test("TimesheetUtils", function() {
    equal(TimesheetUtils.getWeekNumber(new Date(2013, 3, 1)), 14, '#getWeekNumber() :: positive 1'); // 1 April 2013
    equal(TimesheetUtils.getWeekNumber(new Date(2014, 0, 25)), 4, '#getWeekNumber() :: positive 2'); // 25 January 2014

    equal(TimesheetUtils.getNormalizedWeekNumber(new Date(2014, 0, 25)), '04', '#getNormalizedWeekNumber() :: positive 1'); // 25 January 2014
    equal(TimesheetUtils.getNormalizedWeekNumber(new Date(2013, 3, 1)), '14', '#getNormalizedWeekNumber() :: positive 2'); // 1 April 2013

    var datesForWeek = TimesheetUtils.getDatesForWeek({startDate: new Date(2014, 1, 27), endDate: new Date(2014, 2, 3)}); // 27 February 2014 - 03 March 2014
    equal(datesForWeek.length, 5, 'getDatesForWeek length');
    ok(TimesheetUtils.sameDay(datesForWeek[0].date, new Date(2014, 1, 27)), '#getDatesForWeek() :: thursday');
    ok(TimesheetUtils.sameDay(datesForWeek[1].date, new Date(2014, 1, 28)), '#getDatesForWeek() :: friday');
    ok(TimesheetUtils.sameDay(datesForWeek[4].date, new Date(2014, 2, 3)), '#getDatesForWeek() :: monday');
    var weeksForMonth = TimesheetUtils.getWeeksForMonth({startDate: new Date(2014, 1, 26), endDate: new Date(2014, 2, 5), reportingDay: 1}); // 26 February 2014 - 05 March 2014
    equal(weeksForMonth.length, 2, 'getWeeksForMonth length');
    ok(TimesheetUtils.sameDay(weeksForMonth[0].date, new Date(2014, 1, 24)), '#getWeeksForMonth() :: first week date');
    equal(weeksForMonth[0].week, 'Week 9', '#getWeeksForMonth() :: first week number');
    ok(TimesheetUtils.sameDay(weeksForMonth[1].date, new Date(2014, 2, 3)), '#getWeeksForMonth() :: last week date');
    equal(weeksForMonth[1].week, 'Week 10', '#getWeeksForMonth() :: last week number');

    equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 27), 1).getDay(), 1, '#getPrevMonday() :: is monday 1');
    equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 17), 1).getDay(), 1, '#getPrevMonday() :: is monday 2');
    equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 27), 1).getDate(), 24, '#getPrevMonday() :: monday date 1');
    equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 17), 1).getDate(), 17, '#getPrevMonday() :: monday date 2');

    ok(TimesheetUtils.sameDay(new Date(2014, 1, 20, 3, 12), new Date(2014, 1, 20, 12, 45)), '#sameDay() :: true');
    ok(!TimesheetUtils.sameDay(new Date(2014, 1, 22, 3, 12), new Date(2014, 1, 20, 12, 45)), '#sameDay() :: false');

    equal(TimesheetUtils.addDays(new Date(2014, 1, 20, 12, 45), 2).getDate(), 22, '#addDays() :: positive 1');
    equal(TimesheetUtils.addDays(new Date(2014, 1, 20, 12, 45), -3).getDate(), 17, '#addDays() :: positive 2');

    var json = TimesheetUtils.getJson('{"p":1, "b":3}');
    equal(json.p, 1, '#getJson() :: property 1');
    equal(json.b, 3, '#getJson() :: property 2');
    json = TimesheetUtils.getJson({p:5, b:4});
    equal(json.p, 5, '#getJson() :: property 1');
    equal(json.b, 4, '#getJson() :: property 2');

    equal(TimesheetUtils.convertHoursToFormat24(12, true), 0, '#convertHoursToFormat24 :: 12PM');
    equal(TimesheetUtils.convertHoursToFormat24(12, false), 12, '#convertHoursToFormat24 :: 12AM');
    equal(TimesheetUtils.convertHoursToFormat24(1, false), 1, '#convertHoursToFormat24 :: 1AM');
    equal(TimesheetUtils.convertHoursToFormat24(4, true), 16, '#convertHoursToFormat24 :: 4PM');
    equal(TimesheetUtils.convertHoursToFormat12(0).hour, 12, '#convertHoursToFormat12 :: 12PM');
    equal(TimesheetUtils.convertHoursToFormat12(0).pm, true, '#convertHoursToFormat12 :: 12PM');
    equal(TimesheetUtils.convertHoursToFormat12(16).hour, 4, '#convertHoursToFormat12 :: 4PM');
    equal(TimesheetUtils.convertHoursToFormat12(16).pm, true, '#convertHoursToFormat12 :: 4PM');
    equal(TimesheetUtils.convertHoursToFormat12(12).hour, 12, '#convertHoursToFormat12 :: 12AM');
    equal(TimesheetUtils.convertHoursToFormat12(12).pm, false, '#convertHoursToFormat12 :: 12AM');
    equal(TimesheetUtils.convertHoursToFormat12(5).hour, 5, '#convertHoursToFormat12 :: 5AM');
    equal(TimesheetUtils.convertHoursToFormat12(5).pm, false, '#convertHoursToFormat12 :: 5AM');
});
test("Timesheet: 2 level grouping", function() {
    var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'Timesheet', categorizeByField: 'issuetype', groupByField: 'reporter', moreFields: ['timespent'], startDate: '2014-02-24', reportingDay: 1, configOptions: {}});
    for (var i in TimeData.issues) {
        var issue = TimeData.issues[i];
        var pivotEntries = pivotTable.add(issue);
        equal(pivotEntries.length, 2, "pivotEntries " + issue.key);
    }
    var totalKeys = Object.keys(pivotTable.totals);
    equal(totalKeys.length, 7, "totals");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), "totalKey 1");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), "totalKey 2");
    equal(pivotTable.totals[totalKeys[0]].sum, 32400, "total value 1");
    equal(pivotTable.totals[totalKeys[1]].sum, 46800, "total value 2");
    var rowKeys = Object.keys(pivotTable.rows);
    equal(rowKeys.length, 1, "rows");
    equal(rowKeys[0], "Bug:admin", "rowKey");
    var row = pivotTable.rows[rowKeys[0]];
    equal(typeof row.rowKey, "object", "typeof row.key");
    equal(row.sum, 172800, "typeof row.key");
    equal(row.rowKey._issue.fields.timespent, 172800, "timespent sum");
    var columnKeys = Object.keys(row.columns);
    equal(columnKeys.length, 7, "columns");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), "totalKey");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), "totalKey");
    equal(row.columns[columnKeys[0]].entries.length, 2, "column entries");
});
test("Timesheet: group by workeduser", function() {
    var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'Timesheet', categorizeByField: 'project', groupByField: 'workeduser', startDate: '2014-02-24', reportingDay: 1, configOptions: {}});
    for (var i in TimeData.issues) {
        var issue = TimeData.issues[i];
        var pivotEntries = pivotTable.add(issue);
        equal(pivotEntries.length, 2, "pivotEntries " + issue.key);
    }
    var totalKeys = Object.keys(pivotTable.totals);
    equal(totalKeys.length, 7, "totals");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), "totalKey 1");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), "totalKey 2");
    equal(pivotTable.totals[totalKeys[0]].sum, 32400, "total value 1");
    equal(pivotTable.totals[totalKeys[1]].sum, 46800, "total value 2");
    var rowKeys = Object.keys(pivotTable.rows);
    equal(rowKeys.length, 1, "rows");
    equal(rowKeys[0], "Timeship:admin", "rowKey");
    var row = pivotTable.rows[rowKeys[0]];
    equal(typeof row.rowKey, "object", "typeof row.key");
    equal(row.sum, 172800, "typeof row.key");
    var columnKeys = Object.keys(row.columns);
    equal(columnKeys.length, 7, "columns");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), "totalKey");
    ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), "totalKey");
    equal(row.columns[columnKeys[0]].entries.length, 2, "column entries");
});
test("Excel Export", function() {
    var excelView = new ExcelView(TimeData.issues);
    equal(typeof excelView, 'object', 'excelView');
    var excel = excelView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [], configOptions: {}});
    equal(typeof excel, 'string', 'excel');
    equal(excel.match(/\d+h/g), null, "issue#902: hours with no h")
});
test("Csv Export", function() {
    var csvView = new CsvView(TimeData.issues);
    equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [], configOptions: {}});
    equal(typeof csv, 'string', 'csv');
    equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
});
test("PivotTabe rows order", function() {
    var pivotTable = PivotTableFactory.createPivotTable({pivotTableType: 'IssueWorkedTimeByUser'});
    pivotTable.rows = {'DEMO-1000': 4, 'DEMO-1': 1, 'DEMO-100': 3, 'ZZ-1': 5, 'DEMO-2': 2};
    var sortedRows = pivotTable.sortedRows();
    equal(sortedRows.join(''), '12345', 'rows order');
});
test("isDate", function() {
    equal(TimesheetUtils.isDate('Phase 2'), false, 'Phase 2');
    equal(TimesheetUtils.isDate('2013-02-27T18:03:49.000+0100'), true, "2013-02-27T18:03:49.000+0100");
});
test('stob', function() {
  var clientKey = 'jira:7bb6742d-0000-4a5d-bffb-88e234501bda';
  var issueId = Number.MAX_SAFE_INTEGER;
  var charAt = function(i) {
    var s = clientKey.substr(i, 4);
    var c = parseInt(s, 16);
    return String.fromCharCode(c);
  }
  var string = charAt(5) + charAt(9) + charAt(14) + charAt(19) + charAt(24) + charAt(29) + charAt(33) + charAt(37) + String.fromCharCode(issueId);
  equal(0x7bb6, string.charCodeAt(0), '0');
  equal(0x742d, string.charCodeAt(1), '1');
  equal(0x0000, string.charCodeAt(2), '2');
  equal(0x4a5d, string.charCodeAt(3), '3');
  equal(0xbffb, string.charCodeAt(4), '4');
  equal(0x88e2, string.charCodeAt(5), '5');
  equal(0x3450, string.charCodeAt(6), '6');
  equal(0x1bda, string.charCodeAt(7), '7');
  equal(0xffff, string.charCodeAt(8), '8');
});
