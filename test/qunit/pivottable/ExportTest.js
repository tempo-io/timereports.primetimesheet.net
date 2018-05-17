var translations = {
    "Today": "Today",
    "Daily": "Daily",
    "Every": "Every",
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
    "descriptionstatus": "Work Description / Status"
};
QUnit.test("Excel Export", function() {
    var excelView = new ExcelView(TimeData.issues);
    QUnit.assert.equal(typeof excelView, 'object', 'excelView');
    var excel = excelView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [],
        translations: translations, configOptions: {exportColumns:['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'username', 'displayname', 'descriptionstatus']},
        jiraConfig: {}});
    QUnit.assert.equal(typeof excel, 'string', 'excel');
    QUnit.assert.equal(excel.match(/\d+h/g), null, "issue#902: hours with no h");
    var lines = excel.split('\n');
    var header = lines.slice(10, 20).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Project</td><td>Issue Type</td><td>Key</td><td>Summary</td><td>Priority</td><td>Date Started</td><td>Username</td><td>Display Name</td><td>Time Spent (h)</td><td>Work Description</td>", "header");
    var row1 = lines.slice(22, 32).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>2014-02-24 21:03:48</td><td>admin</td><td>admin</td><td>1</td><td>test 1</td>", "row1");
    var row2 = lines.slice(34, 44).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>2014-02-25 21:03:48</td><td>admin</td><td>admin</td><td>1</td><td>test 2</td>", "row2");
    var total = lines.slice(166, 176).map(s => s.trim()).join('');
    QUnit.assert.equal(total, '<td>Total</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>48</td><td></td>', "total");
});
QUnit.test("Excel Export TimeTracking", function() {
    var excelView = new ExcelView(TimeData.issues);
    QUnit.assert.equal(typeof excelView, 'object', 'excelView');
    var excel = excelView.generate({pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], translations: translations, configOptions: {exportColumns:['project', 'issuetype',
            'key', 'summary', 'priority', 'datestarted', 'username', 'displayname', 'descriptionstatus'],
            timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
            '5originalestimateremaining', '6progress']},
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
QUnit.test("Csv Export", function() {
    var csvView = new CsvView(TimeData.issues);
    QUnit.assert.equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, moreFields: [],
        translations: translations, configOptions: {exportColumns:['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'username', 'displayname', 'descriptionstatus']},
        jiraConfig: {}});
    QUnit.assert.equal(typeof csv, 'string', 'csv');
    QUnit.assert.equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
    var lines = csv.split('\n');
    QUnit.assert.equal(lines[0], 'Project,Issue Type,Key,Summary,Priority,Date Started,Username,Display Name,Time Spent (h),Work Description', "header");
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",2014-02-24 21:03:48,admin,"admin",1,"test 1"', "row1");
    QUnit.assert.equal(lines[2], '"Timeship",Bug,TIME-4,"Mega problem","Major",2014-02-25 21:03:48,admin,"admin",1,"test 2"', "row2");
    QUnit.assert.equal(lines[13], 'Total,,,,,,,,48,', "total");
});
QUnit.test("Csv Export TimeTracking", function() {
    var csvView = new CsvView(TimeData.issues);
    QUnit.assert.equal(typeof csvView, 'object', 'csvView');
    var csv = csvView.generate({pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], translations: translations, configOptions: {exportColumns:['project', 'issuetype',
            'key', 'summary', 'priority', 'datestarted', 'username', 'displayname', 'descriptionstatus'],
            timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
                '5originalestimateremaining', '6progress']},
        jiraConfig: {}});
    QUnit.assert.equal(typeof csv, 'string', 'csv');
    QUnit.assert.equal(csv.match(/\d+h/g), null, "issue#902: hours with no h")
    var lines = csv.split('\n');
    QUnit.assert.equal(lines[0], 'Project,Issue Type,Key,Summary,Priority,Original Estimate (h),Est. Time Remaining (h),Time Spent (h),Variance (h),Original Estimate Remaining (h),Progress', "header");
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",0,0,2,-2,-2,100%', "row1");
    QUnit.assert.equal(lines[7], 'Total,,,,,73.78,33,48,-7.22,25.78,59%', "total");
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
QUnit.test("Html Export Timesheet", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var html = htmlView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], configOptions: {}, jiraConfig: {timeFormat: ''}});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 22).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Issue Type</td><td>Parent</td><td>Key</td><td>Summary</td><td>Priority</td><td>Comment</td><td>24/Feb</td><td>25/Feb</td><td>26/Feb</td><td>27/Feb</td><td>28/Feb</td><td>Total</td>", "header");
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Bug</td><td></td><td><a href='/browse/TIME-1'>TIME-1</a></td><td><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td>Major</td><td>&nbsp</td><td>8</td><td>3</td><td>0</td><td>0</td><td>0</td><td>11</td>", "row1");
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>test 7</td><td>&nbsp;</td><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>", "row2");
    var total = lines.slice(/* 14*19 + 10 */ 276, 288).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>9</td><td>13</td><td>0</td><td>13</td><td>13</td><td>48</td>", "total");
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
    QUnit.assert.equal(header, "<td>Issue Type</td><td>Parent</td><td>Key</td><td>Summary</td><td>Priority</td><td>24/Feb</td><td>25/Feb</td><td>26/Feb</td><td>27/Feb</td><td>28/Feb</td><td>Total</td>", "header");
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Bug</td><td></td><td><a href='/browse/TIME-1'>TIME-1</a></td><td><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td>Major</td><td>8</td><td>3</td><td>0</td><td>0</td><td>0</td><td>11</td>", "row1");
    var row2 = lines.slice(36, 47).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>Bug</td><td></td><td><a href='/browse/TIME-2'>TIME-2</a></td><td><a href='/browse/TIME-2'>Loch Ness Monster Bug</a></td><td>Major</td><td>0</td><td>5</td><td>0</td><td>8</td><td>0</td><td>13</td>", "row2");
    var total = lines.slice(/* 13*7 + 10 */ 101, 111).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>9</td><td>13</td><td>0</td><td>13</td><td>13</td>", "total");
    QUnit.assert.equal(lines.length, 13*8 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export Timesheet Grouped by Worked User More Fields", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, []);
    moreFieldsOptions.addOption('Assignee', 'assignee');
    moreFieldsOptions.addOption('Timespent', 'timespent');
    moreFieldsOptions.addOption('Estimate', 'timetrackingestimate');
    var html = htmlView.generate({groupByField: 'workeduser', groupByFieldObject: {name: 'Worked User'}, pivotTableType: 'Timesheet', startDate: '2014-02-24',
        reportingDay: 1, moreFields: ['assignee', 'timespent', 'timetrackingestimate'], configOptions: {}, jiraConfig: {timeFormat: ''},
        moreFieldsOptions: moreFieldsOptions});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 25).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Worked User</td><td>Issue Type</td><td>Parent</td><td>Key</td><td>Summary</td><td>Priority</td><td>Assignee</td><td>Timespent</td><td>Estimate</td><td>24/Feb</td><td>25/Feb</td><td>26/Feb</td><td>27/Feb</td><td>28/Feb</td><td>Total</td>", "header");
    var row1 = lines.slice(27, 42).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td><a href='/secure/ViewProfile.jspa?name=admin' title='admin@example.com'>admin</a></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td></td><td>48</td><td>81</td><td>9</td><td>13</td><td>0</td><td>13</td><td>13</td><td>48</td>", "row1");
    var row2 = lines.slice(44, 59).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>&nbsp;</td><td>Bug</td><td></td><td><a href='/browse/TIME-1'>TIME-1</a></td><td><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td>Major</td><td><a href='/secure/ViewProfile.jspa?name=admin' title='admin@example.com'>admin</a></td><td>11</td><td>44</td><td>&nbsp;</td><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>", "row2");
    var total = lines.slice(/* 17*14 + 10 */ 248, 263).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td></td><td>48</td><td>81</td><td>9</td><td>13</td><td>0</td><td>13</td><td>13</td><td>48</td>", "total");
    QUnit.assert.equal(lines.length, 17*15 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export Timesheet More Fields", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, []);
    moreFieldsOptions.addOption('Assignee', 'assignee');
    moreFieldsOptions.addOption('Timespent', 'timespent');
    moreFieldsOptions.addOption('Estimate', 'timetrackingestimate');
    var html = htmlView.generate({pivotTableType: 'Timesheet', startDate: '2014-02-24',
        reportingDay: 1, moreFields: ['assignee', 'timespent', 'timetrackingestimate'],
        configOptions: {}, jiraConfig: {timeFormat: ''},
        moreFieldsOptions: moreFieldsOptions});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 25).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Issue Type</td><td>Parent</td><td>Key</td><td>Summary</td><td>Priority</td><td>Comment</td><td>Assignee</td><td>Timespent</td><td>Estimate</td><td>24/Feb</td><td>25/Feb</td><td>26/Feb</td><td>27/Feb</td><td>28/Feb</td><td>Total</td>", "header");
    var row1 = lines.slice(27, 42).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Bug</td><td></td><td><a href='/browse/TIME-1'>TIME-1</a></td><td><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td>Major</td><td>&nbsp</td><td><a href='/secure/ViewProfile.jspa?name=admin' title='admin@example.com'>admin</a></td><td>11</td><td>44</td><td>8</td><td>3</td><td>0</td><td>0</td><td>0</td><td>11</td>", "row1");
    var row2 = lines.slice(44, 59).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>test 7</td><td>&nbsp;</td><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>", "row2");
    var total = lines.slice(/* 17*19 + 10 */ 333, 348).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td></td><td>48</td><td>81</td><td>9</td><td>13</td><td>0</td><td>13</td><td>13</td><td>48</td>", "total");
    QUnit.assert.equal(lines.length, 17*20 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export Pivot by User Grouped by Issue Itself More Fields", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, []);
    moreFieldsOptions.addOption('Assignee', 'assignee');
    moreFieldsOptions.addOption('Timespent', 'timespent');
    moreFieldsOptions.addOption('Estimate', 'timetrackingestimate');
    var html = htmlView.generate({groupByField: 'issue', groupByFieldObject: {name: 'Issue itself'}, pivotTableType: 'IssueWorkedTimeByUser', startDate: '2014-02-24',
        reportingDay: 1, moreFields: ['assignee', 'timespent', 'timetrackingestimate'], configOptions: {}, jiraConfig: {timeFormat: ''},
        moreFieldsOptions: moreFieldsOptions});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 21).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Issue itself</td><td>Issue Type</td><td>Parent</td><td>Key</td><td>Summary</td><td>Priority</td><td>Assignee</td><td>Timespent</td><td>Estimate</td><td><a href='/secure/ViewProfile.jspa?name=admin' title='admin@example.com'>admin</a></td><td>Total</td>", "header");
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('');
    // FIXME: issue type, key, summary, priority
    QUnit.assert.equal(row1, "<td>TIME-1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td><a href='/secure/ViewProfile.jspa?name=admin' title='admin@example.com'>admin</a></td><td>11</td><td>44</td><td>11</td><td>11</td>", "row1");
    var row2 = lines.slice(36, 47).map(s => s.trim()).join('');
    // FIXME: worklog comment
    QUnit.assert.equal(row2, "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td><td>&nbsp;</td>", "row2");
    var total = lines.slice(/* 13*19 + 10 */ 257, 268).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td></td><td>48</td><td>81</td><td>48</td><td>48</td>", "total");
    QUnit.assert.equal(lines.length, 13*20 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export TimeTracking", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var html = htmlView.generate({pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], configOptions: {timeTrackingColumns: [
            '1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
             '5originalestimateremaining', '6progress']},
        translations: translations, jiraConfig: {timeFormat: ''}});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 21).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Issue Type</td><td>Parent</td><td>Key</td><td>Summary</td><td>Priority</td><td>Original Estimate</td><td>Est. Time Remaining</td><td>Time Spent</td><td>Variance</td><td>Original Estimate Remaining</td><td>Progress</td>", "header");
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td>Bug</td><td></td><td><a href='/browse/TIME-1'>TIME-1</a></td><td><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td>Major</td><td>0</td><td>33</td><td>11</td><td>-44</td><td>-11</td><td>25%</td>", "row1");
    var row2 = lines.slice(36, 47).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>Bug</td><td></td><td><a href='/browse/TIME-2'>TIME-2</a></td><td><a href='/browse/TIME-2'>Loch Ness Monster Bug</a></td><td>Major</td><td>26</td><td>0</td><td>13</td><td>13</td><td>13</td><td>100%</td>", "row2");
    var total = lines.slice(/* 13*7 + 10 */ 101, 112).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>73.78</td><td>33</td><td>48</td><td>-7.22</td><td>25.78</td><td>59%</td>", "total");
    QUnit.assert.equal(lines.length, 13*8 + 10 + 1 /* new line at end of file */, "lines");
});
QUnit.test("Html Export TimeTracking Grouped by Assignee", function() {
    var htmlView = new HtmlView(TimeData.issues);
    QUnit.assert.equal(typeof htmlView, 'object', 'excelView');
    var html = htmlView.generate({groupByField: 'assignee', groupByFieldObject: {name: 'Assignee'}, pivotTableType: 'TimeTracking', startDate: '2014-02-24',
        reportingDay: 1, moreFields: [], configOptions: {timeTrackingColumns: [
            '1timeoriginalestimate', '2esttimeremaining',  '3timespent', '4diff',
             '5originalestimateremaining', '6progress']},
        translations: translations, jiraConfig: {timeFormat: ''}});
    QUnit.assert.equal(typeof html, 'string', 'html');
    var lines = html.split('\n');
    var header = lines.slice(10, 22 ).map(s => s.trim()).join('');
    QUnit.assert.equal(header, "<td>Assignee</td><td>Issue Type</td><td>Parent</td><td>Key</td><td>Summary</td><td>Priority</td><td>Original Estimate</td><td>Est. Time Remaining</td><td>Time Spent</td><td>Variance</td><td>Original Estimate Remaining</td><td>Progress</td>", "header");
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('');
    QUnit.assert.equal(row1, "<td><a href='/secure/ViewProfile.jspa?name=admin' title='admin@example.com'>admin</a></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>73.78</td><td>33</td><td>48</td><td>-7.22</td><td>25.78</td><td>59%</td>", "row1");
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('');
    QUnit.assert.equal(row2, "<td>&nbsp;</td><td>Bug</td><td></td><td><a href='/browse/TIME-1'>TIME-1</a></td><td><a href='/browse/TIME-1'>Hocus Focus Problem</a></td><td>Major</td><td>0</td><td>33</td><td>11</td><td>-44</td><td>-11</td><td>25%</td>", "row2");
    var total = lines.slice(/* 14*8 + 10 */ 122, 134).map(s => s.trim()).join('');
    QUnit.assert.equal(total, "<td>Total</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>73.78</td><td>33</td><td>48</td><td>-7.22</td><td>25.78</td><td>59%</td>", "total");
    QUnit.assert.equal(lines.length, 14*9 + 10 + 1 /* new line at end of file */, "lines");
});
