QUnit.test('Excel Export', function (assert) {
  var done = assert.async()
  var excelView = new ExcelView(TimeData.issues)
  QUnit.assert.equal(typeof excelView, 'object', 'excelView')
  var $excel = $translations.then(translations => {
    return excelView.generate({ pivotTableType: 'Timesheet',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
      jiraConfig: {} })
  })
  $excel.then(excel => {
    QUnit.assert.equal(typeof excel, 'string', 'excel')
    QUnit.assert.equal(excel.match(/\d+h/g), null, 'issue#902: hours with no h')
    var lines = excel.split('\n')
    var header = lines.slice(10, 19).map(s => s.trim()).join('')
    QUnit.assert.equal(header, '<td>Project</td><td>Issue Type</td><td>Key</td><td>Summary</td><td>Priority</td><td>Date Started</td><td>Display Name</td><td>Time Spent (h)</td><td>Work Description</td>', 'header')
    var row1 = lines.slice(21, 30).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>2014-02-24 21:03:48</td><td>admin</td><td>1</td><td>test 1</td>", 'row1')
    var row2 = lines.slice(32, 41).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>2014-02-25 21:03:48</td><td>admin</td><td>1</td><td>test 2</td>", 'row2')
    var total = lines.slice(153, 162).map(s => s.trim()).join('')
    QUnit.assert.equal(total, '<td>Total</td><td></td><td></td><td></td><td></td><td></td><td></td><td>48</td><td></td>', 'total')
    done()
  })
})
QUnit.test('Excel Export in Days', function (assert) {
  var done = assert.async()
  var excelView = new ExcelView(TimeData.issues)
  QUnit.assert.equal(typeof excelView, 'object', 'excelView')
  var $excel = $translations.then(translations => {
    return excelView.generate({ pivotTableType: 'Timesheet',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: [], durationTypeForExport: 'd' },
      jiraConfig: {} })
  })
  $excel.then(excel => {
    QUnit.assert.equal(typeof excel, 'string', 'excel')
    QUnit.assert.equal(excel.match(/\d+h/g), null, 'issue#902: hours with no h')
    var lines = excel.split('\n')
    var header = lines.slice(10, 11).map(s => s.trim()).join('')
    QUnit.assert.equal(header, '<td>Time Spent (d)</td>', 'header')
    var row1 = lines.slice(13, 14).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, '<td>0.13</td>', 'row1')
    var row2 = lines.slice(16, 17).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, '<td>0.13</td>', 'row2')
    var total = lines.slice(49, 50).map(s => s.trim()).join('')
    QUnit.assert.equal(total, '<td>6</td>', 'total') // no <td>Total</td>
    done()
  })
})
QUnit.test('Excel Export TimeTracking', function (assert) {
  var done = assert.async()
  var excelView = new ExcelView(TimeData.issues)
  QUnit.assert.equal(typeof excelView, 'object', 'excelView')
  var $excel = $translations.then(translations => {
    return excelView.generate({ pivotTableType: 'TimeTracking',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['project', 'issuetype',
        'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
      timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff',
        '5originalestimateremaining', '6progress'],
      jiraConfig: {} })
  })
  $excel.then(excel => {
    QUnit.assert.equal(typeof excel, 'string', 'html')
    var lines = excel.split('\n')
    var header = lines.slice(10, 21).map(s => s.trim()).join('')
    QUnit.assert.equal(header, '<td>Project</td><td>Issue Type</td><td>Key</td><td>Summary</td><td>Priority</td><td>Original Estimate (h)</td><td>Est. Time Remaining (h)</td><td>Time Spent (h)</td><td>Variance (h)</td><td>Original Estimate Remaining (h)</td><td>Progress</td>', 'header')
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>0</td><td>0</td><td>2</td><td>-2</td><td>-2</td><td>100%</td>", 'row1')
    var total = lines.slice(95, 106).map(s => s.trim()).join('')
    QUnit.assert.equal(total, '<td>Total</td><td></td><td></td><td></td><td></td><td>73.78</td><td>33</td><td>48</td><td>-7.22</td><td>25.78</td><td>59%</td>', 'total')
    QUnit.assert.equal(lines.length, 109, 'lines')
    done()
  })
})
QUnit.test('Excel Export TimeBalance', function (assert) {
  var done = assert.async()
  var excelView = new ExcelView(TimeData.issues)
  QUnit.assert.equal(typeof excelView, 'object', 'excelView')
  var $excel = $translations.then(translations => {
    return excelView.generate({ pivotTableType: 'TimeBalance',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['project', 'issuetype',
        'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
      timeBalanceColumns: ['1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff',
        '5originalestimateremaining', '6progress'],
      jiraConfig: {} })
  })
  $excel.then(excel => {
    QUnit.assert.equal(typeof excel, 'string', 'html')
    var lines = excel.split('\n')
    var header = lines.slice(10, 24).map(s => s.trim()).join('')
    QUnit.assert.equal(header, '<td>Project</td><td>Issue Type</td><td>Key</td><td>Summary</td><td>Priority</td><td>Date Started</td><td>Display Name</td><td>Changed</td><td>Original Estimate (h)</td><td>Est. Time Remaining (h)</td><td>Time Spent (h)</td><td>Variance (h)</td><td>Original Estimate Remaining (h)</td><td>Progress</td>', 'header')
    var row1 = lines.slice(26, 40).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td>Timeship</td><td>Bug</td><td><a href='/browse/TIME-4'>TIME-4</a></td><td><a href='/browse/TIME-4'>Mega problem</a></td><td>Major</td><td>" + moment('2017-04-05T07:44:09.382+0200').format(TimesheetUtils.dateTimeFormat) + '</td><td>Administrator</td><td>updated Estimate</td><td>0</td><td>2</td><td>0</td><td>-2</td><td>0</td><td>0%</td>', 'row1')
    var total = lines.slice(86, 100).map(s => s.trim()).join('')
    QUnit.assert.equal(total, '<td>Total</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>0</td><td>0</td><td>2</td><td>-2</td><td>-2</td><td>100%</td>', 'total')
    QUnit.assert.equal(lines.length, 103, 'lines')
    done()
  })
})
QUnit.test('Csv Export', function (assert) {
  var done = assert.async()
  var csvView = new CsvView(TimeData.issues)
  QUnit.assert.equal(typeof csvView, 'object', 'csvView')
  var $csv = $translations.then(translations => {
    return csvView.generate({ pivotTableType: 'Timesheet',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
      jiraConfig: {} })
  })
  $csv.then(csv => {
    QUnit.assert.equal(typeof csv, 'string', 'csv')
    QUnit.assert.equal(csv.match(/\d+h/g), null, 'issue#902: hours with no h')
    var lines = csv.split('\n')
    QUnit.assert.equal(lines[0], '\ufeffProject,Issue Type,Key,Summary,Priority,Date Started,Display Name,Time Spent (h),Work Description', 'header')
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",2014-02-24 21:03:48,"admin",1,"test 1"', 'row1')
    QUnit.assert.equal(lines[2], '"Timeship",Bug,TIME-4,"Mega problem","Major",2014-02-25 21:03:48,"admin",1,"test 2"', 'row2')
    QUnit.assert.equal(lines[13], 'Total,,,,,,,48,', 'total')
    done()
  })
})
QUnit.test('Csv Export TimeTracking', function (assert) {
  var done = assert.async()
  var csvView = new CsvView(TimeData.issues)
  QUnit.assert.equal(typeof csvView, 'object', 'csvView')
  var $csv = $translations.then(translations => {
    return csvView.generate({ pivotTableType: 'TimeTracking',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['project', 'issuetype',
        'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
      timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff',
        '5originalestimateremaining', '6progress'],
      jiraConfig: {} })
  })
  $csv.then(csv => {
    QUnit.assert.equal(typeof csv, 'string', 'csv')
    QUnit.assert.equal(csv.match(/\d+h/g), null, 'issue#902: hours with no h')
    var lines = csv.split('\n')
    QUnit.assert.equal(lines[0], '\ufeffProject,Issue Type,Key,Summary,Priority,Original Estimate (h),Est. Time Remaining (h),Time Spent (h),Variance (h),Original Estimate Remaining (h),Progress', 'header')
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",0,0,2,-2,-2,100%', 'row1')
    QUnit.assert.equal(lines[7], 'Total,,,,,73.78,33,48,-7.22,25.78,59%', 'total')
    done()
  })
})
QUnit.test('Csv Export TimeBalance', function (assert) {
  var done = assert.async()
  var csvView = new CsvView(TimeData.issues)
  QUnit.assert.equal(typeof csvView, 'object', 'csvView')
  var $csv = $translations.then(translations => {
    return csvView.generate({ pivotTableType: 'TimeBalance',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['project', 'issuetype',
        'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
      timeBalanceColumns: ['1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff',
        '5originalestimateremaining', '6progress'],
      jiraConfig: {} })
  })
  $csv.then(csv => {
    QUnit.assert.equal(typeof csv, 'string', 'csv')
    QUnit.assert.equal(csv.match(/\d+h/g), null, 'issue#902: hours with no h')
    var lines = csv.split('\n')
    QUnit.assert.equal(lines[0], '\ufeffProject,Issue Type,Key,Summary,Priority,Date Started,Display Name,Changed,Original Estimate (h),Est. Time Remaining (h),Time Spent (h),Variance (h),Original Estimate Remaining (h),Progress', 'header')
    QUnit.assert.equal(lines[1], '"Timeship",Bug,TIME-4,"Mega problem","Major",' + moment('2017-04-05T07:44:09.382+0200').format(TimesheetUtils.dateTimeFormat) + ',"Administrator","updated Estimate",0,2,0,-2,0,0%', 'row1')
    QUnit.assert.equal(lines[5], 'Total,,,,,,,,0,0,2,-2,-2,100%', 'total')
    done()
  })
})
QUnit.test('Csv Export Custom Columns', function (assert) {
  var done = assert.async()
  var csvView = new CsvView(TimeData.issues)
  QUnit.assert.equal(typeof csvView, 'object', 'csvView')
  var $csv = $translations.then(translations => {
    return csvView.generate({ pivotTableType: 'Timesheet',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['key', 'descriptionstatus'] },
      jiraConfig: {} })
  })
  $csv.then(csv => {
    QUnit.assert.equal(typeof csv, 'string', 'csv')
    QUnit.assert.equal(csv.match(/\d+h/g), null, 'issue#902: hours with no h')
    var lines = csv.split('\n')
    QUnit.assert.equal(lines[0], '\ufeffKey,Time Spent (h),Work Description', 'header')
    QUnit.assert.equal(lines[1], 'TIME-4,1,"test 1"', 'row1')
    QUnit.assert.equal(lines[2], 'TIME-4,1,"test 2"', 'row2')
    QUnit.assert.equal(lines[13], 'Total,48,', 'total')
    done()
  })
})
QUnit.test('Csv Export Custom Columns In Days', function (assert) {
  var done = assert.async()
  var csvView = new CsvView(TimeData.issues)
  QUnit.assert.equal(typeof csvView, 'object', 'csvView')
  QUnit.assert.equal(typeof csvView, 'object', 'csvView')
  var $csv = $translations.then(translations => {
    return csvView.generate({ pivotTableType: 'Timesheet',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: { exportColumns: ['key', 'descriptionstatus'], durationTypeForExport: 'd' },
      jiraConfig: {} })
  })
  $csv.then(csv => {
    QUnit.assert.equal(typeof csv, 'string', 'csv')
    QUnit.assert.equal(csv.match(/\d+h/g), null, 'issue#902: hours with no h')
    var lines = csv.split('\n')
    QUnit.assert.equal(lines[0], '\ufeffKey,Time Spent (d),Work Description', 'header')
    QUnit.assert.equal(lines[1], 'TIME-4,0.13,"test 1"', 'row1')
    QUnit.assert.equal(lines[2], 'TIME-4,0.13,"test 2"', 'row2')
    QUnit.assert.equal(lines[13], 'Total,6,', 'total')
    done()
  })
})
QUnit.test('Html Export Timesheet', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'Timesheet',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' } })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 22).map(s => s.trim()).join('')
    QUnit.assert.equal(header, "<th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'>Work Description</th><th class='nav border total'>24/Feb</th><th class='nav border total'>25/Feb</th><th class='nav border total'>26/Feb</th><th class='nav border total'>27/Feb</th><th class='nav border total'>28/Feb</th><th class='nav border total'>Total</th>", 'header')
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'>&nbsp</td><td class='nav border'>8h</td><td class='nav border'>3h</td><td class='nav border'></td><td class='nav border'></td><td class='nav border'></td><td class='nav border total'>11h</td>", 'row1')
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>test 7</td><td class='nav border'>&nbsp;</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td>", 'row2')
    var total = lines.slice(/* 14*19 + 10 */ 276, 284).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=5>Total (6 issues)</th><th class='nav border total'>&nbsp;</th><th class='nav border total'>9h</th><th class='nav border total'>13h</th><th class='nav border total'></th><th class='nav border total'>13h</th><th class='nav border total'>13h</th><th class='nav border total'>48h</th>", 'total')
    QUnit.assert.equal(lines.length, 14 * 20 + 6 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Html Export Timesheet Compressed', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'Timesheet',
      compressed: true,
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' } })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 21).map(s => s.trim()).join('')
    QUnit.assert.equal(header, "<th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'>24/Feb</th><th class='nav border total'>25/Feb</th><th class='nav border total'>26/Feb</th><th class='nav border total'>27/Feb</th><th class='nav border total'>28/Feb</th><th class='nav border total'>Total</th>", 'header')
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'>8h</td><td class='nav border'>3h</td><td class='nav border'></td><td class='nav border'></td><td class='nav border'></td><td class='nav border total'>11h</td>", 'row1')
    var row2 = lines.slice(36, 47).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-2'>TIME-2</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-2'>Loch Ness Monster Bug</a></td><td class='nav border'>Major</td><td class='nav border'></td><td class='nav border'>5h</td><td class='nav border'></td><td class='nav border'>8h</td><td class='nav border'></td><td class='nav border total'>13h</td>", 'row2')
    var total = lines.slice(/* 13*7 + 10 */ 101, 108).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=5>Total (6 issues)</th><th class='nav border total'>9h</th><th class='nav border total'>13h</th><th class='nav border total'></th><th class='nav border total'>13h</th><th class='nav border total'>13h</th><th class='nav border total'>48h</th>", 'total')
    QUnit.assert.equal(lines.length, 13 * 8 + 6 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Html Export IssueWorkedTimeByLabel Compressed', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'IssueWorkedTimeByLabel',
      compressed: true,
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' } })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 19).map(s => s.trim()).join('')
    QUnit.assert.equal(header, "<th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'></th><th class='nav border total'>tag5</th><th class='nav border total'>tag8</th><th class='nav border total'>Total</th>", 'header')
    var row1 = lines.slice(21, 30).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'>3h</td><td class='nav border'></td><td class='nav border'>8h</td><td class='nav border total'>11h</td>", 'row1')
    var row2 = lines.slice(32, 41).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-2'>TIME-2</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-2'>Loch Ness Monster Bug</a></td><td class='nav border'>Major</td><td class='nav border'>8h</td><td class='nav border'>5h</td><td class='nav border'></td><td class='nav border total'>13h</td>", 'row2')
    var total = lines.slice(87, 92).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=5>Total (6 issues)</th><th class='nav border total'>35h</th><th class='nav border total'>5h</th><th class='nav border total'>8h</th><th class='nav border total'>48h</th>", 'total')
    QUnit.assert.equal(lines.length, 11 * 8 + 6 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Html Export Timesheet Grouped by Worked User More Fields', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, [])
  moreFieldsOptions.addOption('Assignee', 'assignee')
  moreFieldsOptions.addOption('Time Spent', 'timespent')
  moreFieldsOptions.addOption('Estimate', 'timetrackingestimate')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'Timesheet',
      categorizeByField: 'assignee',
      categorizeByFieldOption: { label: 'Assignee' },
      groupByField: 'workeduser',
      groupByFieldOption: { label: 'Worked User' },
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: ['timespent', 'timetrackingestimate'],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' },
      moreFieldsOptions: moreFieldsOptions,
      orderDirection: 1 })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 26).map(s => s.trim()).join('')
    QUnit.assert.equal(header,
      "<th class='nav border total'>Assignee</th><th class='nav border total'>Worked User</th><th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'>Time Spent</th><th class='nav border total'>Estimate</th><th class='nav border total'>Work Description</th><th class='nav border total'>24/Feb</th><th class='nav border total'>25/Feb</th><th class='nav border total'>26/Feb</th><th class='nav border total'>27/Feb</th><th class='nav border total'>28/Feb</th><th class='nav border total'>Total</th>", 'header')
    var row1 = lines.slice(28, 44).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td class='nav border'><a target='_blank' href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></td><td class='nav border'><a target='_blank' href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a> (6 issues)</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>48h</td><td class='nav border'>81h</td><td class='nav border'>&nbsp</td><td class='nav border'>9h</td><td class='nav border'>13h</td><td class='nav border'></td><td class='nav border'>13h</td><td class='nav border'>13h</td><td class='nav border total'>48h</td>", 'row1')
    var row2 = lines.slice(46, 62).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'>11h</td><td class='nav border'>44h</td><td class='nav border'>test 7</td><td class='nav border'>&nbsp;</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td>", 'row2')
    var total = lines.slice(/* 18*14 + 10 */ 262, 272).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=7>Total (6 issues)</th><th class='nav border total'>48h</th><th class='nav border total'>81h</th><th class='nav border total'>&nbsp;</th><th class='nav border total'>9h</th><th class='nav border total'>13h</th><th class='nav border total'></th><th class='nav border total'>13h</th><th class='nav border total'>13h</th><th class='nav border total'>48h</th>", 'total')
    QUnit.assert.equal(lines.length, 18 * 15 + 4 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Html Export Timesheet More Fields', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, [])
  moreFieldsOptions.addOption('Assignee', 'assignee')
  moreFieldsOptions.addOption('Time Spent', 'timespent')
  moreFieldsOptions.addOption('Estimate', 'timetrackingestimate')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'Timesheet',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: ['assignee', 'timespent', 'timetrackingestimate'],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' },
      moreFieldsOptions: moreFieldsOptions })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 25).map(s => s.trim()).join('')
    QUnit.assert.equal(header, "<th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'>Assignee</th><th class='nav border total'>Time Spent</th><th class='nav border total'>Estimate</th><th class='nav border total'>Work Description</th><th class='nav border total'>24/Feb</th><th class='nav border total'>25/Feb</th><th class='nav border total'>26/Feb</th><th class='nav border total'>27/Feb</th><th class='nav border total'>28/Feb</th><th class='nav border total'>Total</th>", 'header')
    var row1 = lines.slice(27, 42).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'><a target='_blank' href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></td><td class='nav border'>11h</td><td class='nav border'>44h</td><td class='nav border'>&nbsp</td><td class='nav border'>8h</td><td class='nav border'>3h</td><td class='nav border'></td><td class='nav border'></td><td class='nav border'></td><td class='nav border total'>11h</td>", 'row1')
    var row2 = lines.slice(44, 59).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>test 7</td><td class='nav border'>&nbsp;</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td>", 'row2')
    var total = lines.slice(/* 17*19 + 10 */ 333, 344).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=5>Total (6 issues)</th><th class='nav border total'></th><th class='nav border total'>48h</th><th class='nav border total'>81h</th><th class='nav border total'>&nbsp;</th><th class='nav border total'>9h</th><th class='nav border total'>13h</th><th class='nav border total'></th><th class='nav border total'>13h</th><th class='nav border total'>13h</th><th class='nav border total'>48h</th>", 'total')
    QUnit.assert.equal(lines.length, 17 * 20 + 6 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Html Export Pivot by User Grouped by Issue Itself More Fields', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var moreFieldsOptions = new TimesheetSelectOptions(TimesheetGeneralOption, [])
  moreFieldsOptions.addOption('Assignee', 'assignee')
  moreFieldsOptions.addOption('Time Spent', 'timespent')
  moreFieldsOptions.addOption('Estimate', 'timetrackingestimate')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'IssueWorkedTimeByUser',
      groupByField: 'issue',
      groupByFieldOption: { label: 'Issue itself' },
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: ['assignee', 'timespent', 'timetrackingestimate'],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' },
      moreFieldsOptions: moreFieldsOptions })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 22).map(s => s.trim()).join('')
    QUnit.assert.equal(header, "<th class='nav border total'>Issue itself</th><th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'>Assignee</th><th class='nav border total'>Time Spent</th><th class='nav border total'>Estimate</th><th class='nav border total'>Work Description</th><th class='nav border total'><a target='_blank' href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></th><th class='nav border total'>Total</th>", 'header')
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('')
    // FIXME: issue type, key, summary, priority
    QUnit.assert.equal(row1, "<td class='nav border'><a target='_blank' href='/browse/TIME-1' title='Hocus Focus Problem'>TIME-1 Hocus Focus Problem</a> (1 issue)</td><td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'><a target='_blank' href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a></td><td class='nav border'>11h</td><td class='nav border'>44h</td><td class='nav border'>&nbsp</td><td class='nav border'>11h</td><td class='nav border total'>11h</td>", 'row1')
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('')
    // FIXME: worklog comment
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>test 7</td><td class='nav border'>3h</td><td class='nav border'>&nbsp;</td>", 'row2')
    var total = lines.slice(/* 14*19 + 10 */ 276, 283).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=6>Total (6 issues)</th><th class='nav border total'></th><th class='nav border total'>48h</th><th class='nav border total'>81h</th><th class='nav border total'>&nbsp;</th><th class='nav border total'>48h</th><th class='nav border total'>48h</th>", 'total')
    QUnit.assert.equal(lines.length, 14 * 20 + 5 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Html Export TimeTracking', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'TimeTracking',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      timeTrackingColumns: [
        '1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff',
        '5originalestimateremaining', '6progress'],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' } })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 21).map(s => s.trim()).join('')
    QUnit.assert.equal(header, "<th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'>Original Estimate</th><th class='nav border total'>Est. Time Remaining</th><th class='nav border total'>Time Spent</th><th class='nav border total'>Variance</th><th class='nav border total'>Original Estimate Remaining</th><th class='nav border total'>Progress</th>", 'header')
    var row1 = lines.slice(23, 34).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'></td><td class='nav border'>33h</td><td class='nav border'>11h</td><td class='nav border'>-44h</td><td class='nav border'>-11h</td><td class='nav border'>25%</td>", 'row1')
    var row2 = lines.slice(36, 47).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td class='nav border'>Bug</td><td class='nav border' nowrap></td><td class='nav border' nowrap><a target='_blank' href='/browse/TIME-2'>TIME-2</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-2'>Loch Ness Monster Bug</a></td><td class='nav border'>Major</td><td class='nav border'>26h</td><td class='nav border'></td><td class='nav border'>13h</td><td class='nav border'>13h</td><td class='nav border'>13h</td><td class='nav border'>100%</td>", 'row2')
    var total = lines.slice(/* 13*7 + 10 */ 101, 108).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=5>Total (6 issues)</th><th class='nav border total'>73.78h</th><th class='nav border total'>33h</th><th class='nav border total'>48h</th><th class='nav border total'>-7.22h</th><th class='nav border total'>25.78h</th><th class='nav border total'>59%</th>", 'total')
    QUnit.assert.equal(lines.length, 13 * 8 + 6 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Html Export TimeTracking Grouped by Assignee', function (assert) {
  var done = assert.async()
  var htmlView = new HtmlView(TimeData.issues)
  QUnit.assert.equal(typeof htmlView, 'object', 'htmlView')
  var $html = $translations.then(translations => {
    return htmlView.generate({ pivotTableType: 'TimeTracking',
      groupByField: 'assignee',
      groupByFieldOption: { label: 'Assignee' },
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      timeTrackingColumns: [
        '1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff',
        '5originalestimateremaining', '6progress'],
      translations: translations,
      configOptions: {},
      jiraConfig: { timeFormat: '' },
      orderDirection: 1 })
  })
  $html.then(html => {
    QUnit.assert.equal(typeof html, 'string', 'html')
    var lines = html.split('\n')
    var header = lines.slice(10, 22).map(s => s.trim()).join('')
    QUnit.assert.equal(header, "<th class='nav border total'>Assignee</th><th class='nav border total'>Issue Type</th><th class='nav border total'>Parent</th><th class='nav border total'>Key</th><th class='nav border total'>Summary</th><th class='nav border total'>Priority</th><th class='nav border total'>Original Estimate</th><th class='nav border total'>Est. Time Remaining</th><th class='nav border total'>Time Spent</th><th class='nav border total'>Variance</th><th class='nav border total'>Original Estimate Remaining</th><th class='nav border total'>Progress</th>", 'header')
    var row1 = lines.slice(24, 36).map(s => s.trim()).join('')
    QUnit.assert.equal(row1, "<td class='nav border'><a target='_blank' href='/people/aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' title='admin@example.com'>admin</a> (6 issues)</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>&nbsp;</td><td class='nav border'>73.78h</td><td class='nav border'>33h</td><td class='nav border'>48h</td><td class='nav border'>-7.22h</td><td class='nav border'>25.78h</td><td class='nav border'>59%</td>", 'row1')
    var row2 = lines.slice(38, 50).map(s => s.trim()).join('')
    QUnit.assert.equal(row2, "<td class='nav border'>&nbsp;</td><td class='nav border'>Bug</td><td class='nav border'></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>TIME-1</a></td><td class='nav border'><a target='_blank' href='/browse/TIME-1'>Hocus Focus Problem</a></td><td class='nav border'>Major</td><td class='nav border'></td><td class='nav border'>33h</td><td class='nav border'>11h</td><td class='nav border'>-44h</td><td class='nav border'>-11h</td><td class='nav border'>25%</td>", 'row2')
    var total = lines.slice(/* 14*8 + 10 */ 122, 129).map(s => s.trim()).join('')
    QUnit.assert.equal(total, "<th class='nav border total' colspan=6>Total (6 issues)</th><th class='nav border total'>73.78h</th><th class='nav border total'>33h</th><th class='nav border total'>48h</th><th class='nav border total'>-7.22h</th><th class='nav border total'>25.78h</th><th class='nav border total'>59%</th>", 'total')
    QUnit.assert.equal(lines.length, 14 * 9 + 5 + 1 /* new line at end of file */, 'lines')
    done()
  })
})
QUnit.test('Pdf Export Cost Report', function (assert) {
  var done = assert.async()
  var pdfView = new PdfView(TimeData.issues)
  QUnit.assert.equal(typeof pdfView, 'object', 'pdfView')
  var $pdf = $translations.then(translations => {
    return pdfView.generate({ pivotTableType: 'CostReport',
      startDate: '2014-02-24',
      reportingDay: 1,
      moreFields: [],
      translations: translations,
      hourlyRates: {
        'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa': { '': { '': 10 } }
      },
      configOptions: {},
      jiraConfig: { timeFormat: '' } })
  })
  $pdf.then(pdf => {
    QUnit.assert.equal(typeof pdf, 'object', 'pdf')
    var lines = pdf.content[4].table.body
    QUnit.assert.equal(lines.length, 20, 'lines')
    var header = lines.shift().join(',')
    QUnit.assert.equal(header, 'Summary,Work Description,Time Spent,Hourly Rate,Cost', 'header')
    var row1 = lines.shift().map(s => typeof s === 'object' ? s.text : s).join(',')
    QUnit.assert.equal(row1, 'Hocus Focus Problem,,11h,20,110', 'row1')
    var row2 = lines.shift().map(s => typeof s === 'object' ? s.text : s).join(',')
    QUnit.assert.equal(row2, ',test 7,3h,10,30', 'row2')
    var total = lines.pop().map(s => typeof s === 'object' ? s.text : s).join(',')
    QUnit.assert.equal(total, 'Total,,,,480', 'total')
    done()
  })
})
