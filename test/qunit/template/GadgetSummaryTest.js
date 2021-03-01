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
QUnit.test('GadgetSummaryUser', function (assert) {
  var done = assert.async()
  $translations.then(translations => {
    var routeParams = {
      user: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa',
      startDate: moment('2021-01-01'),
      endDate: moment('2021-01-31')
    }
    var user = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', displayName: 'test' }
    var options = { pivotTableType: 'IssueWorkedTimeByUser', paramUsersInfo: [user], configOptions: {} }
    var gadgetSummary = new GadgetSummary(GadgetSummary.getSelectedOptionLabels(routeParams, options, translations), user, options.pivotTableType, translations).getSummaryItems()
    QUnit.assert.equal(gadgetSummary.map(o => o.text).join(' '), 'Summary  for user(s) test and all projects from 2021-01-01 to 2021-01-31', 'GadgetSummaryUser')
    done()
  })
})
