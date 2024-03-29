// QUnit.config.autostart = false;
QUnit.testStart(function () {
})
QUnit.testSkip = function () {
  QUnit.QUnit.test(arguments[0] + ' (SKIPPED)', function () {
    QUnit.expect(0)// dont expect any tests
    var li = document.getElementById(QUnit.config.current.id)
    QUnit.done(function () {
      li.style.background = '#EEE'
    })
  })
}
QUnit.test('IssueWorkedTimeByUser', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries')
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 1, 'totals')
  QUnit.assert.equal(totalKeys[0], 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 172800, 'total value')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  for (var rowKey in pivotTable.rows) {
    var row = pivotTable.rows[rowKey]
    var columnKeys = Object.keys(row.columns)
    QUnit.assert.equal(1, columnKeys.length, 'columns')
    QUnit.assert.equal(columnKeys[0], 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', 'columnKey')
    QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 2, 'column entries')
  }
})
QUnit.test('IssueWorkedTimeByStatus', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'IssueWorkedTimeByStatus', configOptions: { workingTimeInStatus: {}, statuses: TimeStatuses }, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries')
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 2, 'totals')
  QUnit.assert.equal(totalKeys[0], 'Open', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 100800, 'total value 0')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 72000, 'total value 1')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  for (var rowKey in pivotTable.rows) {
    var row = pivotTable.rows[rowKey]
    var columnKeys = Object.keys(row.columns)
    QUnit.assert.equal(1, columnKeys.length, 'columns')
    QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 2, 'column entries')
  }
})
QUnit.test('IssueWorkedTimeByLabel', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'IssueWorkedTimeByLabel', configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries')
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 3, 'totals')
  QUnit.assert.equal(totalKeys[0], '', 'totalKey')
  QUnit.assert.equal(totalKeys[1], 'tag5', 'totalKey')
  QUnit.assert.equal(totalKeys[2], 'tag8', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 18000, 'total value tag5')
  QUnit.assert.equal(pivotTable.totals[totalKeys[2]].sum, 28800, 'total value tag8')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
})
QUnit.test('IssuePassedTimeByStatus', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'IssuePassedTimeByStatus',
    startDate: '2017-04-05',
    endDate: '2017-04-11',
    timeInStatusCategories: ['2', '4'],
    configOptions: { workingTimeInStatus: {}, statuses: TimeStatuses } })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, pivotEntries[0].rowKey.keyValue === 'TIME-4' ? 3 : 1, 'pivotEntries ' + pivotEntries[0].rowKey.keyValue)
    if (pivotEntries.length === 1) {
      QUnit.assert.equal(pivotEntries[0].worklog.comment, '2017-04-05 00:00:00 - 2017-04-12 00:00:00 (admin)')
      QUnit.assert.equal(pivotEntries[0].value, 604800)
    }
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 3, 'totals')
  QUnit.assert.equal(totalKeys[0], 'Open', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 1842249, 'total value 0')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 1397394, 'total value 1')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  for (var rowKey in pivotTable.rows) {
    var row = pivotTable.rows[rowKey]
    var columnKeys = Object.keys(row.columns)
    QUnit.assert.equal(rowKey === 'TIME-4' ? 3 : 1, columnKeys.length, 'columns ' + rowKey)
    QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 1, 'column entries')
  }
})
QUnit.test('IssuePassedTimeByStatus with Working Hours', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'IssuePassedTimeByStatus',
    startDate: '2017-04-05',
    endDate: '2017-04-11',
    timeInStatusCategories: ['2', '4'],
    configOptions: { statuses: TimeStatuses,
      workingTimeInStatus: { from: 5, to: 22 } } })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, pivotEntries[0].rowKey.keyValue === 'TIME-4' ? 3 : 1, 'pivotEntries ' + pivotEntries[0].rowKey.keyValue)
    if (pivotEntries.length === 1) {
      QUnit.assert.equal(pivotEntries[0].worklog.comment, '2017-04-05 05:00:00 - 2017-04-11 22:00:00 (admin)')
      QUnit.assert.equal(pivotEntries[0].value, 306000)
    }
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 3, 'totals')
  QUnit.assert.equal(totalKeys[0], 'Open', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 927849, 'total value 0')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 749394, 'total value 1')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  for (var rowKey in pivotTable.rows) {
    var row = pivotTable.rows[rowKey]
    var columnKeys = Object.keys(row.columns)
    QUnit.assert.equal(rowKey === 'TIME-4' ? 3 : 1, columnKeys.length, 'columns ' + rowKey)
    QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 1, 'column entries')
  }
})
QUnit.test('getStatuses', function () {
  var issue = { fields: { status: { id: '5' }, assignee: { displayName: 'aaaa' } },
    changelog: { histories: [
      { items: [{ // Open -> To Do, null -> admin
        field: 'assignee',
        fieldtype: 'jira',
        fromString: null
      }, {
        field: 'status',
        fieldtype: 'jira',
        from: '1'
      }] },
      { items: [{ // To Do -> In Progress
        field: 'status',
        fieldtype: 'jira',
        from: '2'
      }] },
      { items: [{ // admin -> aaaa
        field: 'assignee',
        fieldtype: 'jira',
        fromString: 'admin'
      }] },
      { items: [{ // In Progress -> Done
        field: 'status',
        fieldtype: 'jira',
        from: '3'
      }] }
    ] }
  }
  var statuses = PivotKey.getStatuses(issue, { statuses: TimeStatuses,
    workingTimeInStatus: { from: 5, to: 22 } })
  QUnit.assert.equal(statuses.length, 5, 'statuses')
  QUnit.assert.equal(statuses[0].id, '1', '0 status')
  QUnit.assert.equal(statuses[0].assignee, null, '0 assignee')
  QUnit.assert.equal(statuses[1].id, '2', '1 status')
  QUnit.assert.equal(statuses[1].assignee, 'admin', '1 assignee')
  QUnit.assert.equal(statuses[2].id, '3', '2 status')
  QUnit.assert.equal(statuses[2].assignee, 'admin', '2 assignee')
  QUnit.assert.equal(statuses[3].id, '3', '3 status')
  QUnit.assert.equal(statuses[3].assignee, 'aaaa', '3 assignee')
  QUnit.assert.equal(statuses[4].id, '5', '4 status')
  QUnit.assert.equal(statuses[4].assignee, 'aaaa', '4 assignee')
})
QUnit.test('TimeTracking', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'TimeTracking',
    timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',
      '3timespent', '4diff', '5originalestimateremaining', '6progress'] })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 1, 'pivotEntries')
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 6, 'totals')
  QUnit.assert.equal(totalKeys[0], '1timeoriginalestimate', 'totalKey')
  QUnit.assert.equal(totalKeys[1], '2esttimeremaining', 'totalKey')
  QUnit.assert.equal(totalKeys[2], '3timespent', 'totalKey')
  QUnit.assert.equal(totalKeys[3], '4diff', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 265600, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 118800, 'total value 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[2]].sum, 172800, 'total value 3')
  QUnit.assert.equal(pivotTable.totals[totalKeys[3]].sum, -26000, 'total value 4')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.value, 92800, 'total value 5')
  QUnit.assert.equal(pivotTable.totals[totalKeys[5]].value.estimate, 118800, 'total value 6 (estimate)')
  QUnit.assert.equal(pivotTable.totals[totalKeys[5]].value.timespent, 172800, 'total value 6 (timespent)')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-4', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key 1')
  QUnit.assert.equal(row.sum, 0, 'row sum')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 6, 'columns')
  QUnit.assert.equal(columnKeys[0], '1timeoriginalestimate', 'columnKey')
  QUnit.assert.equal(columnKeys[1], '2esttimeremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[2], '3timespent', 'columnKey')
  QUnit.assert.equal(columnKeys[3], '4diff', 'columnKey')
  QUnit.assert.equal(columnKeys[4], '5originalestimateremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[5], '6progress', 'columnKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 1, 'column entries')
})
QUnit.test('TimeTracking5ReOrderedColumns', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'TimeTracking',
    timeTrackingColumns: ['6progress', '2esttimeremaining',
      '3timespent', '4diff', '5originalestimateremaining'] })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 1, 'pivotEntries')
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 5, 'totals')
  QUnit.assert.equal(totalKeys[0], '2esttimeremaining', 'totalKey')
  QUnit.assert.equal(totalKeys[1], '3timespent', 'totalKey')
  QUnit.assert.equal(totalKeys[2], '4diff', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 118800, 'total value 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 172800, 'total value 3')
  QUnit.assert.equal(pivotTable.totals[totalKeys[2]].sum, -26000, 'total value 4')
  QUnit.assert.equal(pivotTable.totals[totalKeys[3]].value.value, 92800, 'total value 5')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.estimate, 118800, 'total value 6 (estimate)')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.timespent, 172800, 'total value 6 (timespent)')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-4', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key 1')
  QUnit.assert.equal(row.sum, 0, 'row sum')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 5, 'columns')
  QUnit.assert.equal(columnKeys[0], '2esttimeremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[1], '3timespent', 'columnKey')
  QUnit.assert.equal(columnKeys[2], '4diff', 'columnKey')
  QUnit.assert.equal(columnKeys[3], '5originalestimateremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[4], '6progress', 'columnKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 1, 'column entries')
})
QUnit.test('TimeTrackingGroupedByStatus', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'TimeTracking',
    categorizeByField: 'project',
    groupByField: 'status',
    timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',
      '3timespent', '4diff', '5originalestimateremaining', '6progress'] })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 1, 'pivotEntries')
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 6, 'totals')
  QUnit.assert.equal(totalKeys[0], '1timeoriginalestimate', 'totalKey')
  QUnit.assert.equal(totalKeys[1], '2esttimeremaining', 'totalKey')
  QUnit.assert.equal(totalKeys[2], '3timespent', 'totalKey')
  QUnit.assert.equal(totalKeys[3], '4diff', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 265600, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 118800, 'total value 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[2]].sum, 172800, 'total value 3')
  QUnit.assert.equal(pivotTable.totals[totalKeys[3]].sum, -26000, 'total value 4')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.value, 92800, 'total value 5')
  QUnit.assert.equal(pivotTable.totals[totalKeys[5]].value.estimate, 118800, 'total value 6 (estimate)')
  QUnit.assert.equal(pivotTable.totals[totalKeys[5]].value.timespent, 172800, 'total value 6 (timespent)')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 3, 'rows')
  QUnit.assert.equal(rowKeys[2], 'Timeship:Open', 'rowKey')
  var row = pivotTable.rows[rowKeys[2]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key 1')
  QUnit.assert.equal(row.sum, 93600, 'row sum')
  QUnit.assert.equal(row.data.length, 3, 'data columns')
  QUnit.assert.equal(row.data[0].values['1timeoriginalestimate'], 93600, 'data value 1')
  QUnit.assert.equal(row.data[0].values['2esttimeremaining'], 0, 'data value 2')
  QUnit.assert.equal(row.data[0].values['3timespent'], 46800, 'data value 3')
  QUnit.assert.equal(row.data[0].values['4diff'], 46800, 'data value 4')
  QUnit.assert.equal(row.data[0].values['5originalestimateremaining'].value, 46800, 'data value 5')
  QUnit.assert.equal(row.data[0].values['6progress'].timespent, 46800, 'data value 6 (timespent)')
  QUnit.assert.equal(row.data[0].values['6progress'].estimate, 0, 'data value 6 (estimate)')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 6, 'columns')
  QUnit.assert.equal(columnKeys[0], '1timeoriginalestimate', 'columnKey')
  QUnit.assert.equal(columnKeys[1], '2esttimeremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[2], '3timespent', 'columnKey')
  QUnit.assert.equal(columnKeys[3], '4diff', 'columnKey')
  QUnit.assert.equal(columnKeys[4], '5originalestimateremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[5], '6progress', 'columnKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 3, 'column entries')
})
QUnit.test('TimeTrackingRowComparator', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'TimeTracking',
    timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',
      '3timespent', '4diff', '5originalestimateremaining', '6progress'],
    orderByField: 'priority',
    orderDirection: 1 })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 1, 'pivotEntries')
  }
  var sortedRows = pivotTable.sortedRows()
  QUnit.assert.equal(sortedRows.length, 6, 'sortedRows')
  QUnit.assert.equal(sortedRows[0].rowKey.keyValue, 'TIME-3', 'row1')
  QUnit.assert.equal(sortedRows[1].rowKey.keyValue, 'TIME-4', 'row2')
  QUnit.assert.equal(sortedRows[2].rowKey.keyValue, 'TIME-2', 'row3')
  QUnit.assert.equal(sortedRows[3].rowKey.keyValue, 'TIME-1', 'row4')
  QUnit.assert.equal(sortedRows[4].rowKey.keyValue, 'TIME-5', 'row5')
  QUnit.assert.equal(sortedRows[5].rowKey.keyValue, 'TIME-6', 'row6')
})
QUnit.test('TimeTrackingRowComparator reverse', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'TimeTracking',
    timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',
      '3timespent', '4diff', '5originalestimateremaining', '6progress'],
    orderByField: 'status',
    orderDirection: -1 })
  for (var i in TimeData.issues) {
    var pivotEntries = pivotTable.add(TimeData.issues[i])
    QUnit.assert.equal(pivotEntries.length, 1, 'pivotEntries')
  }
  var sortedRows = pivotTable.sortedRows()
  QUnit.assert.equal(sortedRows.length, 6, 'sortedRows')
  QUnit.assert.equal(sortedRows[0].rowKey.keyValue, 'TIME-2', 'row1')
  QUnit.assert.equal(sortedRows[0].rowKey.issue.fields.status.name, 'Open', 'status1')
  QUnit.assert.equal(sortedRows[1].rowKey.keyValue, 'TIME-1', 'row2')
  QUnit.assert.equal(sortedRows[1].rowKey.issue.fields.status.name, 'Open', 'status2')
  QUnit.assert.equal(sortedRows[2].rowKey.keyValue, 'TIME-6', 'row3')
  QUnit.assert.equal(sortedRows[2].rowKey.issue.fields.status.name, 'Open', 'status3')
  QUnit.assert.equal(sortedRows[3].rowKey.keyValue, 'TIME-3', 'row4')
  QUnit.assert.equal(sortedRows[3].rowKey.issue.fields.status.name, 'In Progress', 'status4')
  QUnit.assert.equal(sortedRows[4].rowKey.keyValue, 'TIME-5', 'row5')
  QUnit.assert.equal(sortedRows[4].rowKey.issue.fields.status.name, 'In Progress', 'status5')
  QUnit.assert.equal(sortedRows[5].rowKey.keyValue, 'TIME-4', 'row6')
  QUnit.assert.equal(sortedRows[5].rowKey.issue.fields.status.name, 'Done', 'status6')
})
QUnit.test('TimeTrackingRowComparator assignee', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'TimeTracking',
    timeTrackingColumns: ['1timeoriginalestimate', '2esttimeremaining',
      '3timespent', '4diff', '5originalestimateremaining', '6progress'],
    orderByField: 'assignee',
    orderDirection: 1 })
  for (var i in TimeData.issues) {
    var issue = angular.copy(TimeData.issues[i])
    issue.fields.assignee.displayName += (5 - i) // reverse order
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 1, 'pivotEntries')
  }
  var sortedRows = pivotTable.sortedRows()
  QUnit.assert.equal(sortedRows.length, 6, 'sortedRows')
  for (var i = 0; i < 6; i++) {
    QUnit.assert.equal(sortedRows[i].rowKey.issue.fields.assignee.displayName, 'admin' + i, 'row' + (i + 1))
  }
})
var testTimeBalanceCommonCase = function (pivotTable, rowKeysLendth, rowKeysString, row0DataLength) {
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 5, 'totals')
  QUnit.assert.equal(totalKeys[0], '3timespent', 'totalKey')
  QUnit.assert.equal(totalKeys[1], '4diff', 'totalKey')
  QUnit.assert.equal(totalKeys[2], '2esttimeremaining', 'totalKey')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 14400, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, -14400, 'total value 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[2]].sum, 0, 'total value 3')
  QUnit.assert.equal(pivotTable.totals[totalKeys[3]].value.value, -14400, 'total value 5')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.estimate, 0, 'total value 6 (estimate)')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.timespent, 14400, 'total value 6 (timespent)')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, rowKeysLendth, 'rows')
  QUnit.assert.equal(rowKeys.join(','), rowKeysString, 'rowKeys')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(row.data.length, row0DataLength, 'data length')
  QUnit.assert.equal(row.data[0].values['2esttimeremaining'], 7200, 'data value 2')
  QUnit.assert.equal(row.data[0].values['3timespent'], 0, 'data value 3')
  QUnit.assert.equal(row.data[0].values['4diff'], -7200, 'data value 4')
  QUnit.assert.equal(row.data[0].values['5originalestimateremaining'].value, 0, 'data value 5')
  QUnit.assert.equal(row.data[0].values['6progress'].timespent, 0, 'data value 6 (timespent)')
  QUnit.assert.equal(row.data[0].values['6progress'].estimate, 7200, 'data value 6 (estimate)')
  QUnit.assert.equal(row.data[2].values['2esttimeremaining'], 3600, 'data value 2')
  QUnit.assert.equal(row.data[2].values['3timespent'], 3600, 'data value 3')
  QUnit.assert.equal(row.data[2].values['4diff'], -7200, 'data value 4')
  QUnit.assert.equal(row.data[2].values['5originalestimateremaining'].value, -3600, 'data value 5')
  QUnit.assert.equal(row.data[2].values['6progress'].timespent, 3600, 'data value 6 (timespent)')
  QUnit.assert.equal(row.data[2].values['6progress'].estimate, 3600, 'data value 6 (estimate)')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key 1')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 5, 'columns')
  QUnit.assert.equal(columnKeys[0], '3timespent', 'columnKey')
  QUnit.assert.equal(columnKeys[1], '4diff', 'columnKey')
  QUnit.assert.equal(columnKeys[2], '2esttimeremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[3], '5originalestimateremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[4], '6progress', 'columnKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, row0DataLength, 'column entries')
}
QUnit.test('TimeBalance5Columns', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ startDate: '2013-12-04',
    endDate: '2017-04-10',
    pivotTableType: 'TimeBalance',
    timeBalanceColumns: ['6progress', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining'] })
  for (var i in TimeData.issues) {
    pivotTable.add(TimeData.issues[i])
  }
  testTimeBalanceCommonCase(pivotTable, 2, 'TIME-4,TIME-6', 4)
})
QUnit.test('TimeBalance5Columns extended data group=jira-administrators', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ authors: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa',
    startDate: '2013-12-04',
    endDate: '2017-04-10',
    pivotTableType: 'TimeBalance',
    timeBalanceColumns: ['6progress', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining'] })
  for (var i in TimeData.issues) {
    pivotTable.add(TimeData.issues[i])
  }
  pivotTable.add(TimeDataTIME_7)
  testTimeBalanceCommonCase(pivotTable, 2, 'TIME-4,TIME-6', 4)
})
QUnit.test('TimeBalance5Columns grouped by status categorized by project', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ categorizeByField: 'project',
    groupByField: 'status',
    startDate: '2013-12-04',
    endDate: '2017-04-10',
    pivotTableType: 'TimeBalance',
    timeBalanceColumns: ['6progress', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining'] })
  for (var i in TimeData.issues) {
    pivotTable.add(TimeData.issues[i])
  }
  testTimeBalanceCommonCase(pivotTable, 2, 'Timeship:Done,Timeship:Open', 4)
})
QUnit.test('TimeBalance5Columns grouped by status', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ groupByField: 'status',
    startDate: '2013-12-04',
    endDate: '2017-04-10',
    pivotTableType: 'TimeBalance',
    timeBalanceColumns: ['6progress', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining'] })
  for (var i in TimeData.issues) {
    pivotTable.add(TimeData.issues[i])
  }
  testTimeBalanceCommonCase(pivotTable, 2, 'Done,Open', 4)
})
QUnit.test('TimeBalance5Columns grouped by project', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ groupByField: 'project',
    startDate: '2013-12-04',
    endDate: '2017-04-10',
    pivotTableType: 'TimeBalance',
    timeBalanceColumns: ['6progress', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining'] })
  for (var i in TimeData.issues) {
    pivotTable.add(TimeData.issues[i])
  }
  testTimeBalanceCommonCase(pivotTable, 1, 'Timeship', 6)
})
QUnit.test('TimeBalance5Columns filter user=user', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ user: 'user',
    startDate: '2013-12-04',
    endDate: '2017-04-10',
    pivotTableType: 'TimeBalance',
    configOptions: { timeBalanceColumns: ['6progress', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining'] } })
  for (var i in TimeData.issues) {
    pivotTable.add(TimeData.issues[i])
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 0, 'totals')
})
QUnit.test('TimeBalance5Columns filter user=user extended data', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ user: 'user',
    startDate: '2013-12-04',
    endDate: '2017-04-10',
    pivotTableType: 'TimeBalance',
    timeBalanceColumns: ['6progress', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining'] })
  for (var i in TimeData.issues) {
    pivotTable.add(TimeData.issues[i])
  }
  pivotTable.add(TimeDataTIME_7)
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 5, 'totals')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 3600, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 0, 'total value 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[2]].sum, 3600, 'total value 3')
  QUnit.assert.equal(pivotTable.totals[totalKeys[3]].value.value, 3600, 'total value 5')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.estimate, 3600, 'total value 6 (estimate)')
  QUnit.assert.equal(pivotTable.totals[totalKeys[4]].value.timespent, 3600, 'total value 6 (timespent)')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 1, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-7', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(row.data.length, 4, 'data length')
  QUnit.assert.equal(row.data[1].values['2esttimeremaining'], 7200, 'data value 2')
  QUnit.assert.equal(row.data[1].values['3timespent'], 0, 'data value 3')
  QUnit.assert.equal(row.data[1].values['4diff'], 0, 'data value 4')
  QUnit.assert.equal(row.data[1].values['5originalestimateremaining'].value, 7200, 'data value 5')
  QUnit.assert.equal(row.data[1].values['6progress'].timespent, 0, 'data value 6 (timespent)')
  QUnit.assert.equal(row.data[1].values['6progress'].estimate, 7200, 'data value 6 (estimate)')
  QUnit.assert.equal(row.data[3].values['2esttimeremaining'], 3600, 'data value 2')
  QUnit.assert.equal(row.data[3].values['3timespent'], 3600, 'data value 3')
  QUnit.assert.equal(row.data[3].values['4diff'], 0, 'data value 4')
  QUnit.assert.equal(row.data[3].values['5originalestimateremaining'].value, 3600, 'data value 5')
  QUnit.assert.equal(row.data[3].values['6progress'].timespent, 3600, 'data value 6 (timespent)')
  QUnit.assert.equal(row.data[3].values['6progress'].estimate, 3600, 'data value 6 (estimate)')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key 1')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 5, 'columns')
  QUnit.assert.equal(columnKeys[0], '3timespent', 'columnKey')
  QUnit.assert.equal(columnKeys[1], '4diff', 'columnKey')
  QUnit.assert.equal(columnKeys[2], '2esttimeremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[3], '5originalestimateremaining', 'columnKey')
  QUnit.assert.equal(columnKeys[4], '6progress', 'columnKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 4, 'column entries')
})
// see also timeData.js#CookieUtils for locked time frame
QUnit.test('Timesheet', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timesheet', startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var columnsTemplate = pivotTable.pivotStrategy.columnsTemplate
  var columnsTemplateKeys = Object.keys(columnsTemplate)
  QUnit.assert.equal(columnsTemplateKeys.length, 7, 'columns number')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.isToday, false, 'isToday 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.isWeekend, false, 'isWeekend 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.keyName, 'dayOfTheWeek', 'keyName 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[5]].columnKey.isToday, false, 'isToday 5')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[5]].columnKey.isWeekend, true, 'isWeekend 5')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[5]].columnKey.keyName, 'dayOfTheWeek', 'keyName 5')
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 7, 'totals')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), 'totalKey 1')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), 'totalKey 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 32400, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 46800, 'total value 2')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-4', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 7200, 'typeof row.key')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 7, 'columns')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 1, 'column entries')
})
QUnit.test('Timesheet sum by week', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timesheet', sum: 'week', startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var columnsTemplate = pivotTable.pivotStrategy.columnsTemplate
  var columnsTemplateKeys = Object.keys(columnsTemplate)
  QUnit.assert.equal(columnsTemplateKeys.length, 1, 'columns number')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.isToday, false, 'isToday 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.isWeekend, undefined, 'isWeekend 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.keyName, 'weekOfTheYear', 'keyName 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.weekNumber, '09', 'weekNumber 0')
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 1, 'totals')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), 'totalKey 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 172800, 'total value 1')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-4', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 7200, 'typeof row.key')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 1, 'columns')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 2, 'column entries')
})
QUnit.test('Timesheet sum by month', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timesheet', sum: 'month', startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var columnsTemplate = pivotTable.pivotStrategy.columnsTemplate
  var columnsTemplateKeys = Object.keys(columnsTemplate)
  QUnit.assert.equal(columnsTemplateKeys.length, 2, 'columns number')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.isToday, false, 'isToday 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.isWeekend, undefined, 'isWeekend 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[0]].columnKey.keyName, 'monthOfTheYear', 'keyName 0')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[1]].columnKey.isToday, false, 'isToday 1')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[1]].columnKey.isWeekend, undefined, 'isWeekend 1')
  QUnit.assert.equal(columnsTemplate[columnsTemplateKeys[1]].columnKey.keyName, 'monthOfTheYear', 'keyName 1')
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 2, 'totals')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 1)), 'totalKey 1')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 2, 1)), 'totalKey 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 172800, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 0, 'total value 2')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-4', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 7200, 'typeof row.key')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 2, 'columns')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 2, 'column entries')
})
QUnit.test('Timespent', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timespent', startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 1, 'totals')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 172800, 'total value 1')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-4', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 7200, 'typeof row.key')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 1, 'columns')
  QUnit.assert.ok(totalKeys[0], '3timespent', 'totalKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 2, 'column entries')
})
QUnit.test('TimesheetUtils.convertDate', function () {
  // default
  var date = TimesheetUtils.convertDate('2014-02-24T23:00:00.000', 'Europe/Moscow') // Tempo
  QUnit.assert.equal(date.getDate(), 24, 'default day of month')
  // specify author timezone
  date = TimesheetUtils.convertDate('2014-06-24T22:00:00.000+0000', 'Europe/Berlin')
  QUnit.assert.equal(date.getDate(), 25, 'Berlin summer day of month')
  date = TimesheetUtils.convertDate('2014-02-24T22:00:00.000+0000', 'Europe/Berlin')
  QUnit.assert.equal(date.getDate(), 24, 'Berlin winter day of month')
  date = TimesheetUtils.convertDate('2014-02-24T20:00:00.000+0000', 'Europe/Moscow')
  QUnit.assert.equal(date.getDate(), 25, 'Moscow 2014 day of month')
  date = TimesheetUtils.convertDate('2015-02-24T20:00:00.000+0000', 'Europe/Moscow')
  QUnit.assert.equal(date.getDate(), 24, 'Moscow 2015 day of month')
  date = TimesheetUtils.convertDate('2020-03-31T02:00:00.000+1100', 'Australia/Sydney')
  QUnit.assert.equal(date.getDate(), 31, 'Sydney 2020 day of month')
  date = TimesheetUtils.convertDate('2020-03-31T02:00:00.000+1100', 'Europe/Moscow')
  QUnit.assert.equal(date.getDate(), 30, 'Sydney 2020 day of month in Kyiv')
})
QUnit.test('Calculated endDate', function () {
  var date = TimesheetUtils.getLastDayOfTheMonth(TimesheetUtils.addMonths(moment('2018-01-31'), 1))
  QUnit.assert.equal(date.getDate(), 28, 'Date')
  QUnit.assert.equal(date.getMonth(), 1, 'Month') // starts from 0
})
QUnit.test('PivotTable.getOrCreate', function () {
  var getOrCreateObject = {}
  var RecordClass = function (key) { this.key = key }
  TimesheetUtils.getOrCreate(getOrCreateObject, { keyValue: 'key1' }, RecordClass)
  TimesheetUtils.getOrCreate(getOrCreateObject, { keyValue: 'key1' }, RecordClass)
  TimesheetUtils.getOrCreate(getOrCreateObject, { keyValue: 'key2' }, RecordClass)
  var keys = Object.keys(getOrCreateObject)
  QUnit.assert.equal(keys.length, 2, '#getOrCreateObject() :: length')
  for (var i in keys) {
    QUnit.assert.ok(keys[i] === 'key1' || keys[i] === 'key2', "#getOrCreateObject() :: key check[ '" + keys[i] + "' ]")
  }
})
QUnit.test('DrawHelper', function () {
  QUnit.assert.equal(DrawHelper.getFormattedTime(100 * 5 * 8 * 3600, { timeFormat: 'pretty', workingHoursPerDay: 8, workingDaysPerWeek: 5 }, null, 'jiraStyle'), '100w', '100w')
  QUnit.assert.equal(DrawHelper.getFormattedTime(100 * 5 * 8 * 3600, { timeFormat: 'pretty', workingHoursPerDay: 8, workingDaysPerWeek: 5 }), '2y 1m', '2y 1m')
})
QUnit.test('TimesheetUtils', function () {
  QUnit.assert.equal(TimesheetUtils.getWeekNumber(new Date(2013, 3, 1), {}), 14, '#getWeekNumber() :: positive 1') // 1 April 2013
  QUnit.assert.equal(TimesheetUtils.getWeekNumber(new Date(2021, 1, 23), { useIsoWeek: true }), 8, '#getWeekNumber() :: positive 2') // 23 February 2021 Iso Week

  QUnit.assert.equal(TimesheetUtils.getNormalizedWeekNumber(new Date(2014, 0, 25), {}), '04', '#getNormalizedWeekNumber() :: positive 1') // 25 January 2014
  QUnit.assert.equal(TimesheetUtils.getNormalizedWeekNumber(new Date(2013, 3, 1), { useIsoWeek: true }), '14', '#getNormalizedWeekNumber() :: positive 2') // 1 April 2013

  var datesForWeek = TimesheetUtils.getDatesForWeek({ startDate: new Date(2014, 1, 27), endDate: new Date(2014, 2, 3) }) // 27 February 2014 - 03 March 2014
  QUnit.assert.equal(datesForWeek.length, 5, 'getDatesForWeek length')
  QUnit.assert.ok(TimesheetUtils.sameDay(datesForWeek[0].date, new Date(2014, 1, 27)), '#getDatesForWeek() :: thursday')
  QUnit.assert.ok(TimesheetUtils.sameDay(datesForWeek[1].date, new Date(2014, 1, 28)), '#getDatesForWeek() :: friday')
  QUnit.assert.ok(TimesheetUtils.sameDay(datesForWeek[4].date, new Date(2014, 2, 3)), '#getDatesForWeek() :: monday')
  var weeksForMonth = TimesheetUtils.getWeeksForMonth({ startDate: new Date(2014, 1, 26), endDate: new Date(2014, 2, 5), reportingDay: 1, configOptions: {} }) // 26 February 2014 - 05 March 2014
  QUnit.assert.equal(weeksForMonth.length, 2, 'getWeeksForMonth length')
  QUnit.assert.ok(TimesheetUtils.sameDay(weeksForMonth[0].date, new Date(2014, 1, 24)), '#getWeeksForMonth() :: first week date')
  QUnit.assert.equal(weeksForMonth[0].week, 'Week 09', '#getWeeksForMonth() :: first week number')
  QUnit.assert.ok(TimesheetUtils.sameDay(weeksForMonth[1].date, new Date(2014, 2, 3)), '#getWeeksForMonth() :: last week date')
  QUnit.assert.equal(weeksForMonth[1].week, 'Week 10', '#getWeeksForMonth() :: last week number')

  QUnit.assert.equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 27), 1).getDay(), 1, '#getPrevMonday() :: is monday 1')
  QUnit.assert.equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 17), 1).getDay(), 1, '#getPrevMonday() :: is monday 2')
  QUnit.assert.equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 27), 1).getDate(), 24, '#getPrevMonday() :: monday date 1')
  QUnit.assert.equal(TimesheetUtils.getPrevMonday(new Date(2014, 1, 17), 1).getDate(), 17, '#getPrevMonday() :: monday date 2')

  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(2014, 1, 20, 3, 12), new Date(2014, 1, 20, 12, 45)), '#sameDay() :: true')
  QUnit.assert.ok(!TimesheetUtils.sameDay(new Date(2014, 1, 22, 3, 12), new Date(2014, 1, 20, 12, 45)), '#sameDay() :: false')

  QUnit.assert.equal(TimesheetUtils.addDays(new Date(2014, 1, 20, 12, 45), 2).getDate(), 22, '#addDays() :: positive 1')
  QUnit.assert.equal(TimesheetUtils.addDays(new Date(2014, 1, 20, 12, 45), -3).getDate(), 17, '#addDays() :: positive 2')

  var json = TimesheetUtils.getJson('{"p":1, "b":3}')
  QUnit.assert.equal(json.p, 1, '#getJson() :: property 1')
  QUnit.assert.equal(json.b, 3, '#getJson() :: property 2')
  json = TimesheetUtils.getJson({ p: 5, b: 4 })
  QUnit.assert.equal(json.p, 5, '#getJson() :: property 1')
  QUnit.assert.equal(json.b, 4, '#getJson() :: property 2')

  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat24(12, true), 0, '#convertHoursToFormat24 :: 12PM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat24(12, false), 12, '#convertHoursToFormat24 :: 12AM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat24(1, false), 1, '#convertHoursToFormat24 :: 1AM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat24(4, true), 16, '#convertHoursToFormat24 :: 4PM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(0).hour, 12, '#convertHoursToFormat12 :: 12PM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(0).pm, true, '#convertHoursToFormat12 :: 12PM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(16).hour, 4, '#convertHoursToFormat12 :: 4PM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(16).pm, true, '#convertHoursToFormat12 :: 4PM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(12).hour, 12, '#convertHoursToFormat12 :: 12AM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(12).pm, false, '#convertHoursToFormat12 :: 12AM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(5).hour, 5, '#convertHoursToFormat12 :: 5AM')
  QUnit.assert.equal(TimesheetUtils.convertHoursToFormat12(5).pm, false, '#convertHoursToFormat12 :: 5AM')
})
QUnit.test('TimesheetUtils.getTimeSpents', function () {
  var config = { defaultUnit: 'h', workingDaysPerWeek: 5 }

  var timespents = TimesheetUtils.getTimeSpents(null, '5', null, config)
  QUnit.assert.equal(timespents.length, 1, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, '300m', '5h')

  var timespents = TimesheetUtils.getTimeSpents(null, '1d', null, config)
  QUnit.assert.equal(timespents.length, 1, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, '1d', '1d')

  var timespents = TimesheetUtils.getTimeSpents(null, '3d 5h', null, config)
  QUnit.assert.equal(timespents.length, 4, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, '300m', '5h')
  QUnit.assert.equal(timespents[3].timeSpent, '1d', '1d')

  var timespents = TimesheetUtils.getTimeSpents(null, '2w 3d 5h', null, config)
  QUnit.assert.equal(timespents.length, 14, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, '300m', '5h')
  QUnit.assert.equal(timespents[13].timeSpent, '1d', '1d')

  var timespents = TimesheetUtils.getTimeSpents(null, '2w 3.5d 5h', null, config)
  QUnit.assert.equal(timespents.length, 15, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, '300m', '5h')
  QUnit.assert.equal(timespents[1].timeSpent, '0.5d', '0.5d')
  QUnit.assert.equal(timespents[13].timeSpent, '1d', '1d')

  var timespents = TimesheetUtils.getTimeSpents(null, '0.2w', null, config)
  QUnit.assert.equal(timespents.length, 1, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, '1d', '0.2w')

  var timespents = TimesheetUtils.getTimeSpents(null, '1.5d', null, config)
  QUnit.assert.equal(timespents.length, 2, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, '0.5d', '0.5d')
  QUnit.assert.equal(timespents[1].timeSpent, '1d', '1d')

  var timespents = TimesheetUtils.getTimeSpents(null, '150h', null, config)
  QUnit.assert.equal(timespents.length, 1, 'length')
  QUnit.assert.equal(timespents[0].timeSpent, (150 * 60) + 'm', '150h')
})
QUnit.test('TimesheetUtils.validateParams', function () {
  var err = TimesheetUtils.validateParams({
    pivotTableType: 'NotExists',
    filterOrProjectId: 'lalala',
    numOfWeeks: '5r',
    reportingDay: 7,
    offset: '4e',
    endDate: '2020-12-20', // real
    startDate: '2020-20-20',
    sum: 'true',
    view: 'false'
  })
  QUnit.assert.equal(err.join(','), 'Unknown PivotTableType: NotExists,Unknown filterOrProjectId: lalala,numOfWeeks should be Integer,reportingDay should be -1..6,offset should be Integer,startDate should be date in YYYY-MM-DD format,sum should be in ["day", "week", "month"],view should be in ["day", "week", "month"]', 'all')
})
QUnit.test('Timesheet: 2 level grouping', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timesheet', categorizeByField: 'issuetype', groupByField: 'reporter', moreFields: ['timespent'], startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 7, 'totals')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), 'totalKey 1')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), 'totalKey 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 32400, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 46800, 'total value 2')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 1, 'rows')
  QUnit.assert.equal(rowKeys[0], 'Bug:admin', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 172800, 'typeof row.key')
  QUnit.assert.equal(row.rowKey._issue.fields.timespent, 172800, 'timespent sum')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 7, 'columns')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), 'totalKey')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), 'totalKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 2, 'column entries')
})
QUnit.test('Timesheet: group by workeduser', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timesheet', categorizeByField: 'project', groupByField: 'workeduser', startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 7, 'totals')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), 'totalKey 1')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), 'totalKey 2')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 32400, 'total value 1')
  QUnit.assert.equal(pivotTable.totals[totalKeys[1]].sum, 46800, 'total value 2')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 1, 'rows')
  QUnit.assert.equal(rowKeys[0], 'Timeship:admin', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 172800, 'typeof row.key')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 7, 'columns')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[0])), new Date(2014, 1, 24)), 'totalKey')
  QUnit.assert.ok(TimesheetUtils.sameDay(new Date(parseInt(totalKeys[1])), new Date(2014, 1, 25)), 'totalKey')
  QUnit.assert.equal(row.columns[columnKeys[0]].entries.length, 2, 'column entries')
})
QUnit.test('Timespent: group by Account', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timespent', groupByField: 'customfield_11207', startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 1, 'totals')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 172800, 'total value 1')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 2, 'rows')
  QUnit.assert.equal(rowKeys[0], 'Prime Timesheet s.r.o.', 'rowKey')
  QUnit.assert.equal(rowKeys[1], '&nbsp;', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 7200, 'typeof row.key')
})
QUnit.test('Timespent: Pivot by Assignee', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Timespent', pivotByField: 'assignee', startDate: '2014-02-24', reportingDay: 1, configOptions: {}, loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 1, 'totals')
  QUnit.assert.equal(pivotTable.totals[totalKeys[0]].sum, 172800, 'total value 1')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.equal(rowKeys.length, 6, 'rows')
  QUnit.assert.equal(rowKeys[0], 'TIME-4', 'rowKey')
  QUnit.assert.equal(rowKeys[1], 'TIME-3', 'rowKey')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.equal(typeof row.rowKey, 'object', 'typeof row.key')
  QUnit.assert.equal(row.sum, 7200, 'typeof row.key')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 1, 'columns')
})
QUnit.test('Calendar', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'Calendar',
    startDate: '2014-02-24',
    reportingDay: 1,
    configOptions: { preserveStartedTime: true },
    loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', timeZone: 'Europe/Moscow' } })
  for (var i in TimeData.issues) {
    var issue = TimeData.issues[i]
    var pivotEntries = pivotTable.add(issue)
    QUnit.assert.equal(pivotEntries.length, 2, 'pivotEntries ' + issue.key)
  }
  QUnit.assert.equal(pivotTable.sum, 172800, 'sum')
  var totalKeys = Object.keys(pivotTable.totals)
  QUnit.assert.equal(totalKeys.length, 7, 'totals')
  QUnit.assert.equal(totalKeys[5], '05', 'total key 5')
  var rowKeys = Object.keys(pivotTable.rows)
  QUnit.assert.ok(rowKeys.length > 0, 'rows')
  var row = pivotTable.rows[rowKeys[0]]
  QUnit.assert.ok(/0/.test(row.rowKey.field.weekNumber), 'week')
  var columnKeys = Object.keys(row.columns)
  QUnit.assert.equal(columnKeys.length, 7, 'columns')
})
QUnit.test('PivotTabe rows order', function () {
  var pivotTable = PivotTableFactory.createPivotTable({ pivotTableType: 'IssueWorkedTimeByUser' })
  PivotKey.Issue.getDataComparatorBak = PivotKey.Issue.getDataComparator
  delete PivotKey.Issue.getDataComparator
  pivotTable.rows = { 'DEMO-1000': 4, 'DEMO-1': 1, 'DEMO-100': 3, 'ZZ-1': 5, 'DEMO-2': 2 }
  var sortedRows = pivotTable.sortedRows()
  QUnit.assert.equal(sortedRows.join(''), '12345', 'rows order')
  PivotKey.Issue.getDataComparator = PivotKey.Issue.getDataComparatorBak
})
QUnit.test('isDate', function () {
  QUnit.assert.equal(TimesheetUtils.isDate('Phase 2'), false, 'Phase 2')
  QUnit.assert.equal(TimesheetUtils.isDate('2013-02-27T18:03:49.000+0100'), true, '2013-02-27T18:03:49.000+0100')
})
QUnit.test('stob', function () {
  var clientKey = 'jira:7bb6742d-0000-4a5d-bffb-88e234501bda'
  var issueId = Number.MAX_SAFE_INTEGER
  var charAt = function (i) {
    var s = clientKey.substr(i, 4)
    var c = parseInt(s, 16)
    return String.fromCharCode(c)
  }
  var string = charAt(5) + charAt(9) + charAt(14) + charAt(19) + charAt(24) + charAt(29) + charAt(33) + charAt(37) + String.fromCharCode(issueId)
  QUnit.assert.equal(0x7bb6, string.charCodeAt(0), '0')
  QUnit.assert.equal(0x742d, string.charCodeAt(1), '1')
  QUnit.assert.equal(0x0000, string.charCodeAt(2), '2')
  QUnit.assert.equal(0x4a5d, string.charCodeAt(3), '3')
  QUnit.assert.equal(0xbffb, string.charCodeAt(4), '4')
  QUnit.assert.equal(0x88e2, string.charCodeAt(5), '5')
  QUnit.assert.equal(0x3450, string.charCodeAt(6), '6')
  QUnit.assert.equal(0x1bda, string.charCodeAt(7), '7')
  QUnit.assert.equal(0xffff, string.charCodeAt(8), '8')
})
QUnit.test('clone', function () {
  function Class (value) {
    this.value = value
  }
  Class.prototype.getValue = function () {
    return this.value
  }
  Class.prototype.setValue = function (value) {
    this.value = value
  }

  var a = new Class(new Date('2020-12-20'))
  a.cycle = a
  a.empty = {}
  a.deep = { empty: {}, cycle: a }

  var b = TimesheetUtils.clone(a)
  QUnit.assert.equal(b.getValue().getTime(), new Date('2020-12-20').getTime(), 'initial value')
  b.setValue('b')
  QUnit.assert.equal(b.getValue(), 'b', 'b')
  QUnit.assert.equal(b.cycle, b, 'cycle')
  QUnit.assert.notEqual(b.empty, b.deep.empty, 'similar object')
  QUnit.assert.equal(b.deep.cycle, b, 'deep cycle')
})
QUnit.test('Detect.js', function () {
  const ua = new UAParser('Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Microsoft Outlook 16.0.11929; Microsoft Outlook 16.0.11929)')
  QUnit.assert.equal(ua.getBrowser().name, 'IE', 'Browser')
  QUnit.assert.equal(ua.getBrowser().version, '10.0', 'Browser Version')
  QUnit.assert.equal(ua.getOS().name, 'Windows', 'OS')
  QUnit.assert.equal(ua.getOS().version, '10', 'OS Version')
})
QUnit.test('GroupComparator', function () {
  var array = ['Test', 'Test Category', 'Test:Project1', 'Test:Project2', 'Test Category:Project3']
  array.sort(PivotKey.GroupByField.comparator)
  QUnit.assert.equal(array.join(','), 'Test,Test:Project1,Test:Project2,Test Category,Test Category:Project3', 'Keys')
})
