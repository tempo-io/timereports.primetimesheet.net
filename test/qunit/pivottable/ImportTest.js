QUnit.test('Parse Timesheet CSV', function (assert) {
  var jiraConfig = { workingHoursPerDay: 8, workingDaysPerWeek: 5, defaultUnit: 'h' }
  var worklogs = TimesheetUtils.parseTimesheetCSV('Issue Key, Date Started, Time Spent, Comment\n' +
    'DEMO-1,"2020-09-14 09:00:00Z",1h,test\n' +
    'DEMO-1,2h,comment to skip,"comment \nline2"\n' +
    'DEMO-1,3.5,,null', jiraConfig)
  QUnit.assert.equal(worklogs.length, 3, '#worklogs')
  QUnit.assert.equal(worklogs[0].issueKey, 'DEMO-1', 'Issue Key')
  QUnit.assert.equal(worklogs[0].started, '2020-09-14T09:00:00.000Z', 'Date Started')
  QUnit.assert.equal(worklogs[0].timeSpent, '1h', 'Timespent')
  QUnit.assert.equal(worklogs[0].comment, 'test', 'Comment')
  QUnit.assert.equal(worklogs[1].issueKey, 'DEMO-1', 'Issue Key')
  QUnit.assert.equal(worklogs[1].started, TimesheetUtils.adjustedDateStarted(worklogs[1], jiraConfig).toJSON(), 'Date Started')
  QUnit.assert.equal(worklogs[1].timeSpent, '2h', 'Timespent')
  QUnit.assert.equal(worklogs[1].comment, 'comment \nline2', 'Comment')
  QUnit.assert.equal(worklogs[2].issueKey, 'DEMO-1', 'Issue Key')
  QUnit.assert.equal(worklogs[2].started, TimesheetUtils.adjustedDateStarted(worklogs[2], jiraConfig).toJSON(), 'Date Started')
  QUnit.assert.equal(TimesheetUtils.getTimeSpentMs(worklogs[2].timeSpent, jiraConfig), 12600000, 'Timespent')
  QUnit.assert.equal(worklogs[2].comment, 'null', 'Comment')
})
