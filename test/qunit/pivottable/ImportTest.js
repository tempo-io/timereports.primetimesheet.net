QUnit.test('Parse Timesheet CSV', function (assert) {
  var jiraConfig = { workingHoursPerDay: 8, workingDaysPerWeek: 5 }
  var worklogs = TimesheetUtils.parseTimesheetCSV('Issue Key, Date Started, Time Spent, Comment\n' +
    'DEMO-1,"2020-09-14 09:00:00Z",2h,test\n' +
    'DEMO-1,2h,comment to skip,"comment \nline2"\n', jiraConfig)
  QUnit.assert.equal(worklogs.length, 2, '#worklogs')
  QUnit.assert.equal(worklogs[0].issueKey, 'DEMO-1', 'Issue Key')
  QUnit.assert.equal(worklogs[0].started, '2020-09-14T09:00:00.000Z', 'Date Started')
  QUnit.assert.equal(worklogs[0].timeSpent, '2h', 'Timespent')
  QUnit.assert.equal(worklogs[0].comment, 'test', 'Comment')
  QUnit.assert.equal(worklogs[1].issueKey, 'DEMO-1', 'Issue Key')
  QUnit.assert.equal(worklogs[1].started, TimesheetUtils.adjustedDateStarted(worklogs[1], jiraConfig).toJSON(), 'Date Started')
  QUnit.assert.equal(worklogs[1].timeSpent, '2h', 'Timespent')
  QUnit.assert.equal(worklogs[1].comment, 'comment \nline2', 'Comment')
})
