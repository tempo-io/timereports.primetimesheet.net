var translations = {
    "Day": "Day",
    "Week": "Week",
    "Month": "Month",
    "Today": "Today",
    "Daily": "Daily",
    "Every": "Every",
    '1started': 'Started',
    '2timespent': 'Spent',
    '3action': 'Actions',
    "1timeoriginalestimate": "Original Estimate",
    "12estimate": "Estimate",
    "2esttimeremaining": "Est. Time Remaining",
    "3timespent": "Time Spent",
    "4diff": "Variance",
    "5originalestimateremaining": "Original Estimate Remaining",
    "6progress": "Progress",
    "project": "Project",
    "issuetype": "Issue Type",
    "key": "Key",
    "summary": "Summary",
    "priority": "Priority",
    "datestarted": "Date Started",
    "username": "Username",
    "displayname": "Display Name",
    "descriptionstatus": "Work Description / Status",
    "Use default": "Use default",
    "Default": "Default",
    "Enabled": "Enabled",
    "Disabled": "Disabled",
    'created': 'created',
    'updated': 'updated',
    'resolved': 'resolved',
    'Data is limited by Auditors Roles': 'Data is limited by Auditors Roles'
};
QUnit.test("Excel Export", function() {
    var excelView = new ExcelView(TimeData.issues);
    QUnit.assert.equal(typeof excelView, 'object', 'excelView');
    var excel = excelView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [],
        translations: translations, configOptions: {exportColumns:['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus']},
        jiraConfig: {}});
    QUnit.assert.equal(typeof excel, 'string', 'excel');
    QUnit.assert.equal(excel.match(/\d+h/g), null, "issue#902: hours with no h");
    var lines = excel.split('\n');
    var header = lines.slice(10, 19).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Project</td><td>Issue Type</td><td>Key</td><td>Summary</td><td>Priority</td><td>Date Started</td><td>Display Name</td><td>Time Spent (h)</td><td>Work Description</td>", "header");
    var row1 = lines.slice(21, 30).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>2014-02-24 21:03:48</td><td>admin</td><td>1</td><td>test 1</td>", "row1");
    var row2 = lines.slice(32, 41).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>2014-02-25 21:03:48</td><td>admin</td><td>1</td><td>test 2</td>", "row2");
    var total = lines.slice(153, 162).map(s => s.trim()).join('');
    QUnit.assert.equal(total, '<td>Total</td><td></td><td></td><td></td><td></td><td></td><td></td><td>48</td><td></td>', "total");
});
QUnit.test("Excel Export in Days", function() {
    var excelView = new ExcelView(TimeData.issues);
    QUnit.assert.equal(typeof excelView, 'object', 'excelView');
    var excel = excelView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [],
        translations: translations, configOptions: {exportColumns:[], durationTypeForExport: 'd'},
        jiraConfig: {}});
    QUnit.assert.equal(typeof excel, 'string', 'excel');
    QUnit.assert.equal(excel.match(/\d+h/g), null, "issue#902: hours with no h");
    var lines = excel.split('\n');
    var header = lines.slice(10, 11).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Time Spent (d)</td>", "header");
    var row1 = lines.slice(13, 14).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>0.13</td>", "row1");
    var row2 = lines.slice(16, 17).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>0.13</td>", "row2");
    var total = lines.slice(49, 50).map(s => s.trim()).join('');
    QUnit.assert.equal(total, '<td>6</td>', "total"); // no <td>Total</td>
});
QUnit.test("Excel Export TimeTracking", function() {
    var excelView = new ExcelView(TimeData.issues);
    QUnit.assert.equal(typeof excelView, 'object', 'excelView');
    var excel = excelView.generate({pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], translations: translations, configOptions: {exportColumns:['project', 'issuetype',
            'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus']},
            timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
            '5originalestimateremaining', '6progress'],
        jiraConfig: {}});
    QUnit.assert.equal(typeof excel, 'string', 'html');
    var lines = excel.split('\n');
    var header = lines.slice(10, 21).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Project</td><td>Issue Type</td><td>Key</td><td>Summary</td><td>Priority</td><td>Original Estimate (h)</td><td>Est. Time Remaining (h)</td><td>Time Spent (h)</td><td>Variance (h)</td><td>Original Estimate Remaining (h)</td><td>Progress</td>", "header");
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>0</td><td>0</td><td>2</td><td>-2</td><td>-2</td><td>100%</td>", "row1");
    var total = lines.slice(95, 106).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td></td><td></td><td></td><td></td><td>73.78</td><td>33</td><td>48</td><td>-7.22</td><td>25.78</td><td>59%</td>", "total");
    QUnit.assert.equal(lines.length, 109, "lines");
});
QUnit.test("Excel Export TimeBalance", function() {
    var excelView = new ExcelView(TimeData.issues);
    QUnit.assert.equal(typeof excelView, 'object', 'excelView');
    var excel = excelView.generate({pivotTableType: 'TimeBalance', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], translations: translations, configOptions: {exportColumns:['project', 'issuetype',
            'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus']},
            timeBalanceColumns: ['1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
            '5originalestimateremaining', '6progress'],
        jiraConfig: {}});
    QUnit.assert.equal(typeof excel, 'string', 'html');
    var lines = excel.split('\n');
    var header = lines.slice(10, 24).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Project</td><td>Issue Type</td><td>Key</td><td>Summary</td><td>Priority</td><td>Date Started</td><td>Display Name</td><td>Changed</td><td>Original Estimate (h)</td><td>Est. Time Remaining (h)</td><td>Time Spent (h)</td><td>Variance (h)</td><td>Original Estimate Remaining (h)</td><td>Progress</td>", "header");
    var row1 = lines.slice(26, 40).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>" + moment('2017-04-05T07:44:09.382+0200').format(TimesheetUtils.dateTimeFormat) + "</td><td>Administrator</td><td>updated Estimate</td><td>0</td><td>2</td><td>0</td><td>-2</td><td>0</td><td>0%</td>", "row1");
    var total = lines.slice(86, 100).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>0</td><td>0</td><td>2</td><td>-2</td><td>-2</td><td>100%</td>", "total");
    QUnit.assert.equal(lines.length, 103, "lines");
});
QUnit.test("Csv Export", function() {
    var csvView = new CsvView(TimeData.issues);
    QUnit.assert.equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [],
        translations: translations, configOptions: {exportColumns:['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus']},
        jiraConfig: {}});
    QUnit.assert.equal(typeof csv, 'string', 'csv');
    QUnit.assert.equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
    var lines = csv.split('\n');
    QUnit.assert.equal(lines[0], 'Project,Issue Type,Key,Summary,Priority,Date Started,Display Name,Time Spent (h),Work Description', "header");
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",2014-02-24 21:03:48,"admin",1,"test 1"', "row1");
    QUnit.assert.equal(lines[2], '"Timeship",Bug,TIME-4,"Mega problem","Major",2014-02-25 21:03:48,"admin",1,"test 2"', "row2");
    QUnit.assert.equal(lines[13], 'Total,,,,,,,48,', "total");
});
QUnit.test("Csv Export TimeTracking", function() {
    var csvView = new CsvView(TimeData.issues);
    QUnit.assert.equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], translations: translations, configOptions: {exportColumns:['project', 'issuetype',
            'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus']},
            timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
                '5originalestimateremaining', '6progress'],
        jiraConfig: {}});
    QUnit.assert.equal(typeof csv, 'string', 'csv');
    QUnit.assert.equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
    var lines = csv.split('\n');
    QUnit.assert.equal(lines[0], 'Project,Issue Type,Key,Summary,Priority,Original Estimate (h),Est. Time Remaining (h),Time Spent (h),Variance (h),Original Estimate Remaining (h),Progress', "header");
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",0,0,2,-2,-2,100%', "row1");
    QUnit.assert.equal(lines[7], 'Total,,,,,73.78,33,48,-7.22,25.78,59%', "total");
});
QUnit.test("Csv Export TimeBalance", function() {
    var csvView = new CsvView(TimeData.issues);
    QUnit.assert.equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'TimeBalance', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], translations: translations, configOptions: {exportColumns:['project', 'issuetype',
            'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus']},
            timeBalanceColumns: ['1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
                '5originalestimateremaining', '6progress'],
        jiraConfig: {}});
    QUnit.assert.equal(typeof csv, 'string', 'csv');
    QUnit.assert.equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
    var lines = csv.split('\n');
    QUnit.assert.equal(lines[0], 'Project,Issue Type,Key,Summary,Priority,Date Started,Display Name,Changed,Original Estimate (h),Est. Time Remaining (h),Time Spent (h),Variance (h),Original Estimate Remaining (h),Progress', "header");
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",' + moment('2017-04-05T07:44:09.382+0200').format(TimesheetUtils.dateTimeFormat) + ',"Administrator","updated Estimate",0,2,0,-2,0,0%', "row1");
    QUnit.assert.equal(lines[5], 'Total,,,,,,,,0,0,2,-2,-2,100%', "total");
});
QUnit.test("Csv Export Custom Columns", function() {
    var csvView = new CsvView(TimeData.issues);
    QUnit.assert.equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [],
        translations: translations, configOptions: {exportColumns:['key', 'descriptionstatus']},
        jiraConfig: {}});
    QUnit.assert.equal(typeof csv, 'string', 'csv');
    QUnit.assert.equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
    var lines = csv.split('\n');
    QUnit.assert.equal(lines[0], 'Key,Time Spent (h),Work Description', "header");
    QUnit.assert.equal(lines[1], 'TIME-4,1,"test 1"', "row1");
    QUnit.assert.equal(lines[2], 'TIME-4,1,"test 2"', "row2");
    QUnit.assert.equal(lines[13], 'Total,48,', "total");
});
QUnit.test("Csv Export Custom Columns In Days", function() {
    var csvView = new CsvView(TimeData.issues);
    QUnit.assert.equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [],
        translations: translations, configOptions: {exportColumns:['key', 'descriptionstatus'], durationTypeForExport: 'd'},
        jiraConfig: {}});
    QUnit.assert.equal(typeof csv, 'string', 'csv');
    QUnit.assert.equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
    var lines = csv.split('\n');
    QUnit.assert.equal(lines[0], 'Key,Time Spent (d),Work Description', "header");
    QUnit.assert.equal(lines[1], 'TIME-4,0.13,"test 1"', "row1");
    QUnit.assert.equal(lines[2], 'TIME-4,0.13,"test 2"', "row2");
    QUnit.assert.equal(lines[13], 'Total,6,', "total");
});
QUnit.test("Html Export Timesheet", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var html = htmlView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], configOptions: {}, jiraConfig: {timeFormat: ''}});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 22).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td class='nav border total'>Issue Type</td><td class='nav border total'>Parent</td><td class='nav border total'>Key</td><td class='nav border total'>Summary</td><td class='nav border total'>Priority</td><td class='nav border total'>Work Description</td><td class='nav border total'>24/Feb</td><td class='nav border total'>25/Feb</td><td class='nav border total'>26/Feb</td><td class='nav border total'>27/Feb</td><td class='nav border total'>28/Feb</td><td class='nav border total'>Total</td>", "header");
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'>&nbsp</td><td class='nav border'>8h</td><td class='nav border'>3h</td><td class='nav border'></td><td class='nav border'></td><td class='nav border'></td><td class='nav border total'>11h</td>", "row1");
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>test 7</td><td class='nav border'>&nbsp;</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td>", "row2");
    var total = lines.slice(/* 14*19 + 10 */ 276, 288).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td class='nav border total'>Total (6 issues)</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>9h</td><td class='nav border total'>13h</td><td class='nav border total'></td><td class='nav border total'>13h</td><td class='nav border total'>13h</td><td class='nav border total'>48h</td>", "total");
    QUnit.assert.equal(lines.length, 14*20 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export Timesheet Compressed", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var html = htmlView.generate({compressed: true, pivotTableType: 'Timesheet', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], configOptions: {}, jiraConfig: {timeFormat: ''}});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 21).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td class='nav border total'>Issue Type</td><td class='nav border total'>Parent</td><td class='nav border total'>Key</td><td class='nav border total'>Summary</td><td class='nav border total'>Priority</td><td class='nav border total'>24/Feb</td><td class='nav border total'>25/Feb</td><td class='nav border total'>26/Feb</td><td class='nav border total'>27/Feb</td><td class='nav border total'>28/Feb</td><td class='nav border total'>Total</td>", "header");
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'>8h</td><td class='nav border'>3h</td><td class='nav border'></td><td class='nav border'></td><td class='nav border'></td><td class='nav border total'>11h</td>", "row1");
    var row2 = lines.slice(36, 47).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-2'>TIME-2</a></td><td class='nav border'><a href='/browse/TIME-2'>Loch Ness Monster Bug</a></td><td class='nav border'>Major</td><td class='nav border'></td><td class='nav border'>5h</td><td class='nav border'></td><td class='nav border'>8h</td><td class='nav border'></td><td class='nav border total'>13h</td>", "row2");
    var total = lines.slice(/* 13*7 + 10 */ 101, 111).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td class='nav border total'>Total (6 issues)</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>9h</td><td class='nav border total'>13h</td><td class='nav border total'></td><td class='nav border total'>13h</td><td class='nav border total'>13h</td>", "total");
    QUnit.assert.equal(lines.length, 13*8 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export Timesheet Grouped by Worked User More Fields", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, []);
    moreFieldsOptions.addOption('Assignee', 'assignee');
    moreFieldsOptions.addOption('Time Spent', 'timespent');
    moreFieldsOptions.addOption('Estimate', 'timetrackingestimate');
    var html = htmlView.generate({categorizeByField: 'assignee', categorizeByFieldOption: {label: 'Assignee'},
        groupByField: 'workeduser', groupByFieldOption: {label: 'Worked User'}, pivotTableType: 'Timesheet', startDate: '2014-02-24',
        reportingDay: 1, moreFields: ['timespent', 'timetrackingestimate'], configOptions: {}, jiraConfig: {timeFormat: ''},
        moreFieldsOptions: moreFieldsOptions});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 26).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td class='nav border total'>Assignee</td><td class='nav border total'>Worked User</td><td class='nav border total'>Issue Type</td><td class='nav border total'>Parent</td><td class='nav border total'>Key</td><td class='nav border total'>Summary</td><td class='nav border total'>Priority</td><td class='nav border total'>Time Spent</td><td class='nav border total'>Estimate</td><td class='nav border total'>Work Description</td><td class='nav border total'>24/Feb</td><td class='nav border total'>25/Feb</td><td class='nav border total'>26/Feb</td><td class='nav border total'>27/Feb</td><td class='nav border total'>28/Feb</td><td class='nav border total'>Total</td>", "header");
    var row1 = lines.slice(28, 44).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td class='nav border'><a href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></td><td class='nav border'><a href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a> (6 issues)</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>48h</td><td class='nav border'>81h</td><td class='nav border'>&nbsp</td><td class='nav border'>9h</td><td class='nav border'>13h</td><td class='nav border'></td><td class='nav border'>13h</td><td class='nav border'>13h</td><td class='nav border total'>48h</td>", "row1");
    var row2 = lines.slice(46, 62).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'>11h</td><td class='nav border'>44h</td><td class='nav border'>test 7</td><td class='nav border'>&nbsp;</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td>", "row2");
    var total = lines.slice(/* 18*14 + 10 */ 262, 278).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td class='nav border total'>Total (6 issues)</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>48h</td><td class='nav border total'>81h</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>9h</td><td class='nav border total'>13h</td><td class='nav border total'></td><td class='nav border total'>13h</td><td class='nav border total'>13h</td><td class='nav border total'>48h</td>", "total");
    QUnit.assert.equal(lines.length, 18*15 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export Timesheet More Fields", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, []);
    moreFieldsOptions.addOption('Assignee', 'assignee');
    moreFieldsOptions.addOption('Time Spent', 'timespent');
    moreFieldsOptions.addOption('Estimate', 'timetrackingestimate');
    var html = htmlView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24',
        reportingDay: 1, moreFields: ['assignee', 'timespent', 'timetrackingestimate'],
        configOptions: {}, jiraConfig: {timeFormat: ''},
        moreFieldsOptions: moreFieldsOptions});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 25).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td class='nav border total'>Issue Type</td><td class='nav border total'>Parent</td><td class='nav border total'>Key</td><td class='nav border total'>Summary</td><td class='nav border total'>Priority</td><td class='nav border total'>Assignee</td><td class='nav border total'>Time Spent</td><td class='nav border total'>Estimate</td><td class='nav border total'>Work Description</td><td class='nav border total'>24/Feb</td><td class='nav border total'>25/Feb</td><td class='nav border total'>26/Feb</td><td class='nav border total'>27/Feb</td><td class='nav border total'>28/Feb</td><td class='nav border total'>Total</td>", "header");
    var row1 = lines.slice(27, 42).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'><a href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></td><td class='nav border'>11h</td><td class='nav border'>44h</td><td class='nav border'>&nbsp</td><td class='nav border'>8h</td><td class='nav border'>3h</td><td class='nav border'></td><td class='nav border'></td><td class='nav border'></td><td class='nav border total'>11h</td>", "row1");
    var row2 = lines.slice(44, 59).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>test 7</td><td class='nav border'>&nbsp;</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td>", "row2");
    var total = lines.slice(/* 17*19 + 10 */ 333, 348).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td class='nav border total'>Total (6 issues)</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'></td><td class='nav border total'>48h</td><td class='nav border total'>81h</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>9h</td><td class='nav border total'>13h</td><td class='nav border total'></td><td class='nav border total'>13h</td><td class='nav border total'>13h</td><td class='nav border total'>48h</td>", "total");
    QUnit.assert.equal(lines.length, 17*20 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export Pivot by User Grouped by Issue Itself More Fields", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, []);
    moreFieldsOptions.addOption('Assignee', 'assignee');
    moreFieldsOptions.addOption('Time Spent', 'timespent');
    moreFieldsOptions.addOption('Estimate', 'timetrackingestimate');
    var html = htmlView.generate({groupByField: 'issue', groupByFieldOption: {label: 'Issue itself'}, pivotTableType: 'IssueWorkedTimeByUser', startDate: '2014-02-24',
        reportingDay: 1, moreFields: ['assignee', 'timespent', 'timetrackingestimate'], configOptions: {}, jiraConfig: {timeFormat: ''},
        moreFieldsOptions: moreFieldsOptions});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 22).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td class='nav border total'>Issue itself</td><td class='nav border total'>Issue Type</td><td class='nav border total'>Parent</td><td class='nav border total'>Key</td><td class='nav border total'>Summary</td><td class='nav border total'>Priority</td><td class='nav border total'>Assignee</td><td class='nav border total'>Time Spent</td><td class='nav border total'>Estimate</td><td class='nav border total'>Work Description</td><td class='nav border total'><a href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></td><td class='nav border total'>Total</td>", "header");
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('');
    // FIXME: issue type, key, summary, priority
    QUnit.assert.equal(row1, "<td class='nav border'><a href='/browse/TIME-1' title='Hocus Focus Problem'>TIME-1 Hocus Focus Problem</a> (1 issue)</td><td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'><a href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></td><td class='nav border'>11h</td><td class='nav border'>44h</td><td class='nav border'>&nbsp</td><td class='nav border'>11h</td><td class='nav border total'>11h</td>", "row1");
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('');
    // FIXME: worklog comment
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>test 7</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td>", "row2");
    var total = lines.slice(/* 14*19 + 10 */ 276, 288).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td class='nav border total'>Total (6 issues)</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'></td><td class='nav border total'>48h</td><td class='nav border total'>81h</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>48h</td><td class='nav border total'>48h</td>", "total");
    QUnit.assert.equal(lines.length, 14*20 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export TimeTracking", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var html = htmlView.generate({pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], timeTrackingColumns: [
            '1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
             '5originalestimateremaining', '6progress'],
        translations: translations, jiraConfig: {timeFormat: ''}});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 21).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td class='nav border total'>Issue Type</td><td class='nav border total'>Parent</td><td class='nav border total'>Key</td><td class='nav border total'>Summary</td><td class='nav border total'>Priority</td><td class='nav border total'>Original Estimate</td><td class='nav border total'>Est. Time Remaining</td><td class='nav border total'>Time Spent</td><td class='nav border total'>Variance</td><td class='nav border total'>Original Estimate Remaining</td><td class='nav border total'>Progress</td>", "header");
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'></td><td class='nav border'>33h</td><td class='nav border'>11h</td><td class='nav border'>-44h</td><td class='nav border'>-11h</td><td class='nav border'>25%</td>", "row1");
    var row2 = lines.slice(36, 47).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-2'>TIME-2</a></td><td class='nav border'><a href='/browse/TIME-2'>Loch Ness Monster Bug</a></td><td class='nav border'>Major</td><td class='nav border'>26h</td><td class='nav border'></td><td class='nav border'>13h</td><td class='nav border'>13h</td><td class='nav border'>13h</td><td class='nav border'>100%</td>", "row2");
    var total = lines.slice(/* 13*7 + 10 */ 101, 112).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td class='nav border total'>Total (6 issues)</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>73.78h</td><td class='nav border total'>33h</td><td class='nav border total'>48h</td><td class='nav border total'>-7.22h</td><td class='nav border total'>25.78h</td><td class='nav border total'>59%</td>", "total");
    QUnit.assert.equal(lines.length, 13*8 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export TimeTracking Grouped by Assignee", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var html = htmlView.generate({groupByField: 'assignee', groupByFieldOption: {label: 'Assignee'}, pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], timeTrackingColumns: [
            '1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
             '5originalestimateremaining', '6progress'],
        translations: translations, jiraConfig: {timeFormat: ''}});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 22 ).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td class='nav border total'>Assignee</td><td class='nav border total'>Issue Type</td><td class='nav border total'>Parent</td><td class='nav border total'>Key</td><td class='nav border total'>Summary</td><td class='nav border total'>Priority</td><td class='nav border total'>Original Estimate</td><td class='nav border total'>Est. Time Remaining</td><td class='nav border total'>Time Spent</td><td class='nav border total'>Variance</td><td class='nav border total'>Original Estimate Remaining</td><td class='nav border total'>Progress</td>", "header");
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td class='nav border'><a href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a> (6 issues)</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>73.78h</td><td class='nav border'>33h</td><td class='nav border'>48h</td><td class='nav border'>-7.22h</td><td class='nav border'>25.78h</td><td class='nav border'>59%</td>", "row1");
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'></td><td class='nav border'>33h</td><td class='nav border'>11h</td><td class='nav border'>-44h</td><td class='nav border'>-11h</td><td class='nav border'>25%</td>", "row2");
    var total = lines.slice(/* 14*8 + 10 */ 122, 134).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td class='nav border total'>Total (6 issues)</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>&nbsp;</td><td class='nav border total'>73.78h</td><td class='nav border total'>33h</td><td class='nav border total'>48h</td><td class='nav border total'>-7.22h</td><td class='nav border total'>25.78h</td><td class='nav border total'>59%</td>", "total");
    QUnit.assert.equal(lines.length, 14*9 + 10 + 1 /* new line at end of file */, "lines");
});
