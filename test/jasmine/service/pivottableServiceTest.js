describe('pivottableServiceTest', function () {
  beforeEach(function () {
    module('timesheetApp')
    inject(function ($timeout, $window, _$httpBackend_) {
      AP.$timeout = $timeout
      $httpBackend = _$httpBackend_
      $httpBackend.whenGET('/templates/main.html').respond(200, '')
      $window.i18nDefault = 'i18n/default.json'
      $httpBackend.whenGET($window.i18nDefault).respond(200, translations)
      $httpBackend.whenGET(/^\/api\/worklog/).respond(200, TimeData.issues)
    })
    AP.requestBak = AP.request
  })

  beforeEach(function () {
    inject(function (pivottableService, applicationLoggingService) {
      pivottableService.allFields = FieldsData
      pivottableService.allNumericFields = pivottableService.getNumericFields()
      applicationLoggingService.debug = function () {}
    })
  })

  afterEach(function () {
    delete AP.$timeout
    AP.request = AP.requestBak
  })

  // jasmine matchers and helpers methods

  beforeEach(function () {
    jasmine.addMatchers({
      toHaveRowsNumber: function () {
        return {
          compare: function (actual, expected) {
            var rowsCount = Object.keys(actual.rows).length
            return JasmineMatcherUtils.getMatcherResult(
              rowsCount === expected,
              'PivotTable must have ' + expected + ' rows, but has ' + rowsCount,
              "PivotTable mustn't have " + expected + ' rows, but has ' + rowsCount)
          }
        }
      }
    })
  })

  it('Timesheet', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'Timesheet', startDate: '2014-02-24', configOptions: {}, reportingDay: 1 }
    var pivotTable
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {
      pivotTable = _pivotTable
    })
    $timeout.flush()
    expect(pivotTable).toBeDefined()
    expect(pivotTable).toHaveRowsNumber(6)
  }))

  it('Timesheet restricted', inject(function ($timeout, pivottableService, $httpBackend) {
    $httpBackend.whenGET(/\/restricted\/TIME/).respond(200, true)

    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'restrictedUser' }
    var options = { pivotTableType: 'Timesheet', startDate: '2014-02-24', configOptions: { auditorsRoles: 'Administrators' }, reportingDay: 1 }
    var pivotTable
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {
      pivotTable = _pivotTable
    })
    $timeout.flush()
    $httpBackend.flush()
    expect(pivotTable).toBeDefined()
    expect(pivotTable).toHaveRowsNumber(0)
  }))

  it('Timesheet [endDate, w/out startDate]', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'Timesheet', endDate: '2014-03-06', configOptions: {} }
    var pivotTable
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {
      pivotTable = _pivotTable
    })
    $timeout.flush()
    expect(pivotTable).toBeDefined()
    expect(pivotTable).toHaveRowsNumber(3)
    expect(pivotTable.rows['TIME-3'].sum).toEqual(21600)
    expect(pivotTable.rows['TIME-5'].sum).toEqual(18000)
    expect(pivotTable.rows['TIME-6'].sum).toEqual(7200)
    expect(pivotTable.sum).toEqual(46800)
  }))

  it('IssueWorkedTimeByUser', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'IssueWorkedTimeByUser', configOptions: {} }
    var pivotTable
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {
      pivotTable = _pivotTable
    })
    $timeout.flush()
    expect(pivotTable).toBeDefined()
    expect(pivotTable).toHaveRowsNumber(6)
    expect(pivotTable.rows['TIME-5'].sum).toEqual(36000)
    expect(pivotTable.rows['TIME-6'].sum).toEqual(7200)
    expect(pivotTable.sum).toEqual(176400)
  }))

  it('IssueWorkedTimeByUser_sumSubTasks', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = {
      pivotTableType: 'IssueWorkedTimeByUser',
      configOptions: {
        parentIssueField: 'customfield_10007',
        compositionIssueLink: 'Duplicate'
      },
      moreFields: ['timespent'],
      sumSubTasks: true
    }
    var pivotTable
    AP.request = function (options) {
      if (options.url.match(/jql=key%20in%20\(TIME-2\)/)) {
        this.getTimeoutFunc()(function () {
          options.success({ issues: [{
            id: '10002',
            key: 'TIME-2',
            timeestimate: 0,
            timeoriginalestimate: 72000,
            timespent: 36000,
            fields: {
              issuetype: { name: 'Bug' }
            }
          }] })
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {
      pivotTable = _pivotTable
      pivotTable.queue['TIME-5'].promise.then(function (issue) {
        // check it is not overwritten by subscequent resolve
        expect(issue.worklog.worklogs.length).toEqual(4)
      })
    })
    $timeout.flush()
    $timeout.flush()
    expect(pivotTable).toBeDefined()
    expect(pivotTable).toHaveRowsNumber(2)
    expect(Object.keys(pivotTable.rows)).toContainAll(['TIME-1', 'TIME-5'])
    expect(pivotTable.rows['TIME-1'].sum).toEqual(133200)
    expect(pivotTable.rows['TIME-5'].sum).toEqual(43200)
    expect(pivotTable.sum).toEqual(176400)
  }))

  // verify subsequent resolve does not make effect
  it('deferredTest', inject(function ($timeout, $q) {
    var deferred = $q.defer()
    deferred.resolve(1)
    deferred.resolve(2)
    deferred.promise.then(function (result) {
      expect(result).toEqual(1)
    })
    $timeout.flush()
  }))

  it('getPivotTable [options:set/reset] sumSubTasks: true', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, sumSubTasks: true }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})
    $timeout.flush()

    expect(pivottableService.sumSubTasks).toEqual(true)
    expect(pivottableService.startDate).not.toBeDefined()
    expect(pivottableService.endDate).not.toBeDefined()
  }))

  it('getPivotTable [options:set/reset] sumSubTasks: false', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, sumSubTasks: false }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})
    $timeout.flush()

    expect(pivottableService.sumSubTasks).toEqual(false)
    expect(pivottableService.startDate).not.toBeDefined()
    expect(pivottableService.endDate).not.toBeDefined()
  }))

  it('getPivotTable [options:set/reset] startDate', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, startDate: '2015-01-25' }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})
    $timeout.flush()

    expect(pivottableService.startDate).toEqual('2015-01-25')
    expect(pivottableService.sumSubTasks).not.toBeDefined()
  }))

  it('loadAllWorklogs [worklog.total > worklog.maxResults]', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()

    var generateWorklogs = function (count, startAt, worklogsNumber) {
      var worklog = {
        maxResults: Math.min(500, worklogsNumber),
        startAt: startAt,
        total: worklogsNumber,
        worklogs: []
      }
      for (var i = 0; i < Math.min(count, worklogsNumber - startAt); i++) {
        worklog.worklogs.push({
          comment: 'test comment ' + i,
          created: '2013-12-05T00:00:00.000+0100',
          id: i + '00',
          started: '2014-02-24T18:03:48.589+0100',
          timeSpent: i + 'h',
          timeSpentSeconds: i * 3600,
          author: 'admin'
        })
      }
      return worklog
    }

    var worklogsNumber = 5555 // > MAX_BULK_LENGTH AP.request
    AP.request = function (options) {
      if (options.url.match(/issue\/TIME-999\/worklog/)) {
        var a = options.url.split('startAt=')
        var startAt = a.length > 1 ? parseInt(a[1]) : 0
        this.getTimeoutFunc()(function () {
          options.success(generateWorklogs(500, startAt, worklogsNumber))
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    var issue = {
      key: 'TIME-999',
      fields: {
        worklog: {
          total: worklogsNumber,
          maxResults: 20
        }
      }
    }
    var result

    pivottableService.loadAllWorklogs(issue, null, { configOptions: {} }).promise.then(function (_issue) {
      result = _issue
    })

    $timeout.flush() // $q.when
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request
    $timeout.flush() // AP.request

    expect(result).toBeDefined()
    expect(result.fields.worklog.worklogs.length).toEqual(worklogsNumber)
  }))

  it('loadAllChangelogs [changelog.total > changelog.maxResults]', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()

    var generateChangelogs = function (total, count, startAt) {
      var changelog = {
        maxResults: count,
        startAt: startAt,
        total: total,
        values: []
      }
      if (total <= startAt + count) {
        changelog.isLast = true
      } else {
        changelog.nextPage = '/issue/TIME-999/changelog?startAt=' + (startAt + count)
      }
      for (var i = 0; i < Math.min(count, total - startAt); i++) {
        changelog.values.push({
          id: '' + (startAt + i),
          created: TimesheetUtils.formatDate(moment()),
          comment: 'test comment ' + (startAt + i)
        })
      }
      return changelog
    }

    AP.request = function (options) {
      if (options.url.match(/issue\/TIME-999\/changelog/)) {
        var a = options.url.split('startAt=')
        var startAt = 0
        if (a.length > 1) {
          startAt = parseInt(a[1])
        }
        this.getTimeoutFunc()(function () {
          options.success(generateChangelogs(25, 10, startAt))
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    var issue = {
      key: 'TIME-999',
      changelog: {
        histories: [],
        maxResults: 10,
        total: 25
      }
    }
    for (var i = 0; i < 10; i++) {
      issue.changelog.histories.push({
        id: '' + i,
        created: TimesheetUtils.formatDate(moment()),
        comment: 'comment ' + i
      })
    }

    pivottableService.loadAllChangelogs(issue, { pivotTableType: 'IssueWorkedTimeByStatus' })

    $timeout.flush() // $q.when
    $timeout.flush() // AP.request 10
    $timeout.flush() // AP.request 20
    expect($timeout.flush).toThrow()
    expect(issue.changelog.histories.length).toEqual(25)
    expect(issue.changelog.histories[0].comment).toEqual('comment 0') // changelog preserved

    issue.changelog.histories = []
    for (var i = 0; i < 10; i++) {
      issue.changelog.histories.push({
        id: '' + (25 - i),
        created: TimesheetUtils.formatDate(moment().add(-i, 'days')),
        comment: 'test comment ' + (25 - i)
      })
    }
    pivottableService.loadAllChangelogs(issue, { pivotTableType: 'IssueWorkedTimeByStatus' })
    $timeout.flush() // $q.when
    $timeout.flush() // AP.request 10
    $timeout.flush() // AP.request 20
    $timeout.flush() // AP.request 25
    expect(issue.changelog.histories.length).toEqual(25)
    expect(issue.changelog.histories[0].id).toEqual('0') // order reset

    issue.changelog.maxResults = issue.changelog.total
    issue.changelog.histories = []
    for (var i = 0; i < 10; i++) {
      issue.changelog.histories.push({
        id: '' + (25 - i),
        created: TimesheetUtils.formatDate(moment().add(-i, 'days')),
        comment: 'test comment ' + (25 - i)
      })
    }
    pivottableService.loadAllChangelogs(issue, { pivotTableType: 'IssueWorkedTimeByStatus' })
    expect(issue.changelog.histories.length).toEqual(10)
    expect(issue.changelog.histories[0].id).toEqual('16') // reordered
  }))

  it('groupBy workedusergroup tests userInfos', inject(function ($timeout, $q, $log, pivottableService) {
    expect(pivottableService).toBeDefined()

    var issue = {
      key: 'DEMO-1',
      worklog: {
        maxResults: 0,
        startAt: 0,
        total: 0,
        worklogs: [
          {
            author: {
              name: 'admin',
              accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa'
            }
          },
          {
            author: {
              name: 'test',
              accountId: 'accountId-noSuchUser-accountId'
            }
          }
        ]
      }
    }

    pivottableService.groupByField = 'workedusergroup'
    pivottableService.needUserInfos = true
    pivottableService.filterWorklogs(issue, /* deferred */ null, /* options */ { groupByField: 'workedusergroup', configOptions: {} })

    $timeout.flush()
    $log.assertEmpty()

    expect(pivottableService.userInfos['aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa']).toBeDefined()
    expect(pivottableService.userInfos['accountId-noSuchUser-accountId']).toBeDefined()
    expect($timeout.flush).toThrow()
  }))

  // test filterWorklogs fills in worklogAuthors
  it('filterWorklogs', inject(function ($timeout, $q, $log, pivottableService) {
    expect(pivottableService).toBeDefined()

    var issue = {
      key: 'DEMO-1',
      worklog: {
        maxResults: 0,
        startAt: 0,
        total: 0,
        worklogs: [
          {
            author: {
              name: 'admin',
              accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa'
            }
          },
          {
            author: {
              name: 'test',
              accountId: 'accountId-test-accountId'
            }
          }
        ]
      }
    }

    var getTestUserInfoByNameCalled = false
    AP.request = function (options) {
      if (options.url.match(/\/user\?expand=groups&accountId=accountId-test-accountId$/)) {
        this.getTimeoutFunc()(function () {
          getTestUserInfoByNameCalled = true
          options.success({ groups: { items: [] } })
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    pivottableService.groups = ['jira-users']
    pivottableService.filterWorklogs(issue, /* deferred */ null, /* options */ { configOptions: {} })

    $timeout.flush()
    $timeout.flush()
    $log.assertEmpty()

    expect(pivottableService.worklogAuthors).toContain('aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa')
    expect(pivottableService.worklogAuthors).not.toContain('accountId-test-accountId')
    expect(getTestUserInfoByNameCalled).toBeTruthy()
    expect($timeout.flush).toThrow()
  }))

  // test filterChangelogs fills in changelogAuthors
  it('filterChangelogs', inject(function ($timeout, $q, $log, pivottableService) {
    expect(pivottableService).toBeDefined()

    var issue = {
      key: 'DEMO-1',
      changelog: {
        maxResults: 0,
        startAt: 0,
        total: 0,
        histories: [
          {
            author: {
              name: 'admin',
              accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa'
            }
          },
          {
            author: {
              name: 'test',
              accountId: 'accountId-test-accountId'
            }
          }
        ]
      }
    }

    var getTestUserInfoByNameCalled = false
    AP.request = function (options) {
      if (options.url.match(/\/user\?expand=groups&accountId=accountId-test-accountId$/)) {
        this.getTimeoutFunc()(function () {
          getTestUserInfoByNameCalled = true
          options.success({ groups: { items: [] } })
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    pivottableService.groups = ['jira-users']
    pivottableService.filterChangelogs(issue, /* deferred */ null, /* options */ { configOptions: {} })

    $timeout.flush()
    $timeout.flush()
    $log.assertEmpty()

    expect(pivottableService.changelogAuthors).toContain('aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa')
    expect(pivottableService.changelogAuthors).not.toContain('accountId-test-accountId')
    expect(getTestUserInfoByNameCalled).toBeTruthy()
    expect($timeout.flush).toThrow()
  }))

  it('onAllIssues [total > maxResults]', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()

    var timeData = {
      issues: [],
      maxResults: 2,
      startAt: 0,
      total: 5
    }
    for (var i = 0; i < 2; i++) {
      timeData.issues.push({
        key: 'TEST-' + i
      })
    }

    AP.request = function (options) {
      this.getTimeoutFunc()(function () {
        var m = options.url.match(/\/search\?startAt=(\d)$/)
        if (m && [0, 2, 4].indexOf(parseInt(m[1])) >= 0) {
          options.success(timeData)
        } else if (!options.url.match(/\/myself/)) {
          throw new Error('Unexpected call ' + options.url)
        }
      }, 500)
    }

    var result = []

    pivottableService.onAllIssues('', function (data) {
      Array.prototype.push.apply(result, data.issues)
    })

    $timeout.flush()
    $timeout.flush() // onAllIssuesDelayed
    $log.assertEmpty()

    expect(result).toBeDefined()
    expect(result.length).toEqual(2)

    $timeout.flush()
    $log.assertEmpty()
    expect(result.length).toEqual(6) // the same TimeData returned three times
    expect($timeout.flush).toThrow()
  }))

  // any issue matches
  it('checkIfMatches [empty query]', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()

    var result

    pivottableService.checkIfMatches({}, {}).then(function (matches) {
      result = matches
    })
    $timeout.flush()

    expect(result).toBeDefined()
    expect(result).toBeTruthy()
    expect($timeout.flush).toThrow()
  }))

  // match by project key
  it('checkIfMatches [projects only]', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()

    var result1; var result2; var options = { filterOrProjectId: 'project_DEMO' }

    pivottableService.checkIfMatches({ fields: { project: { key: 'DEMO' } } }, options).then(function (matches) {
      result1 = matches
    })
    pivottableService.checkIfMatches({ fields: { project: { key: 'TEST' } } }, options).then(function (matches) {
      result2 = matches
    })
    $timeout.flush()

    expect(result1).toBeDefined()
    expect(result1).toBeTruthy()

    expect(result2).toBeDefined()
    expect(result2).toBeFalsy()

    expect($timeout.flush).toThrow()
  }))

  // match by issues set
  it('checkIfMatches [filter query]', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()

    var timeData = {
      issues: [],
      maxResults: 2,
      startAt: 0,
      total: 2
    }
    for (var i = 0; i < 2; i++) {
      timeData.issues.push({
        id: '' + (10000 + i)
      })
    }

    AP.request = function (options) {
      this.getTimeoutFunc()(function () {
        if (options.url.match(/\/search\?fields=~&maxResults=1000&jql=filter%3D10000&startAt=0$/)) {
          options.success(timeData)
        } else if (!options.url.match(/\/myself/)) {
          throw new Error('Unexpected call ' + options.url)
        }
      }, 500)
    }

    var result1; var result2; var result3; var options = { filterOrProjectId: 'filter_10000' }

    pivottableService.checkIfMatches({ id: '10000' }, options).then(function (matches) {
      result1 = matches
    })
    pivottableService.checkIfMatches({ id: '10001' }, options).then(function (matches) {
      result2 = matches
    })
    pivottableService.checkIfMatches({ id: '10002' }, options).then(function (matches) {
      result3 = matches
    })

    $timeout.flush()
    $timeout.flush() // onAllIssuesDelayed
    $log.assertEmpty()

    expect(result1).toBeDefined()
    expect(result1).toBeTruthy()

    expect(result2).toBeDefined()
    expect(result2).toBeTruthy()

    expect(result3).toBeDefined()
    expect(result3).toBeFalsy()

    expect($timeout.flush).toThrow()

    // test reset state
    pivottableService.matches = null
    options = { filterOrProjectId: 'project_DEMO' }

    pivottableService.checkIfMatches({ fields: { project: { key: 'DEMO' } } }, options).then(function (matches) {
      result3 = matches
    })

    $timeout.flush()
    $log.assertEmpty()

    expect(result3).toBeTruthy()

    expect($timeout.flush).toThrow()
  }))

  // test issue is added to queue only once
  it('addOnceIfMatches', inject(function ($timeout, $q, $log, pivottableService) {
    expect(pivottableService).toBeDefined()

    var pivotTable = { matches: {}, queueToAdd: [] }; var options = { configOptions: {} }
    var issue1 = {
      key: 'DEMO-1',
      fields: {
        issuetype: {}
      },
      worklog: {
        maxResults: 0,
        startAt: 0,
        total: 0,
        worklogs: []
      }
    }; var issue2 = {
      key: 'DEMO-2',
      fields: {
        issuetype: {}
      },
      worklog: {
        maxResults: 0,
        startAt: 0,
        total: 0,
        worklogs: []
      }
    }

    pivottableService.addOnceIfMatches(pivotTable, issue1, options)
    pivottableService.addOnceIfMatches(pivotTable, issue1, options)
    pivottableService.addOnceIfMatches(pivotTable, issue2, options)

    $timeout.flush()
    $log.assertEmpty()

    expect(pivotTable.queueToAdd.length).toBe(2)

    expect($timeout.flush).toThrow()
  }))

  it('Filter in strategy worklog of restricted issue', inject(function ($timeout, $q, $log, pivottableService, $httpBackend) {
    $httpBackend.whenGET(/\/restricted\/TIME/).respond(200, false)
    $httpBackend.whenGET(/\/restricted\/RESTRICTED/).respond(200, true)

    expect(pivottableService).toBeDefined()

    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var pivotTable = { matches: {}, queueToAdd: [] }; var options = { sumSubTasks: true, configOptions: { auditorsRoles: 'Administrators' }, loggedInUser: loggedInUser }
    var issue1 = {
      key: 'TIME-1',
      fields: {
        issuetype: {},
        project: { key: 'TIME' }
      },
      worklog: {
        maxResults: 1,
        startAt: 1,
        total: 1,
        worklogs: [{ timeSpentSeconds: 3600 }]
      }
    }; var issue2 = {
      key: 'RESTRICTED-2',
      fields: {
        parent: { key: 'TIME-1' },
        issuetype: {},
        project: { key: 'RESTRICTED' }
      },
      worklog: {
        maxResults: 1,
        startAt: 1,
        total: 1,
        worklogs: [{ timeSpentSeconds: 3600 }]
      }
    }

    pivottableService.addOnceIfMatches(pivotTable, issue1, options)
    pivottableService.addOnceIfMatches(pivotTable, issue1, options)
    pivottableService.addOnceIfMatches(pivotTable, issue2, options)

    $timeout.flush()
    $httpBackend.flush()
    $log.assertEmpty()

    expect(pivotTable.queueToAdd.length).toBe(2)

    options.restrictedProjects = pivottableService.restrictedProjects
    pivottableService.addWorklogs(issue2, issue1, options)
    expect(issue1.worklog.worklogs.length).toBe(2)
    var strategy = new TimesheetStrategy(PivotKey.Issue, PivotKey.MonthOfTheYear, options)
    var entries = strategy.getEntries(issue1)
    expect(entries.length).toBe(1)
  }))

  it('Parent issue not in search result, DB on Jira Cloud over rest', inject(function ($timeout, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      configOptions: {},
      sumSubTasks: true }

    var childIssue = {}
    angular.copy(TimeData.issues[5], childIssue)
    var worklog = childIssue.worklog || childIssue.fields.worklog
    worklog.total += worklog.maxResults + 1
    var searchResult = { issues: [childIssue] }

    AP.request = function (options) {
      if (options.url.match(/search/)) {
        this.getTimeoutFunc()(function () {
          options.success(searchResult)
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    var spy = spyOn(pivottableService, 'loadAllWorklogs').and.callThrough()

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()
    $timeout.flush() // onAllIssuesDelayed

    expect(pivottableService.allIssues.length).toBe(1)
    expect(spy.calls.count()).toBe(2)
  }))

  it('PARAMETERS: groups, DB on Jira Cloud over rest', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      groups: ['group1', 'group2'],
      moreFields: ['customfield_10008'],
      configOptions: {} }

    var requestCalled = false

    AP.request = function (options) {
      if (options.url.match(/search/)) {
        this.getTimeoutFunc()(function () {
          requestCalled = true
          expect(options.url).toContain('jql=(worklogAuthor%20in%20membersOf(%22group1%22)%20or%20worklogAuthor%20in%20membersOf(%22group2%22))')
          options.success(angular.copy(TimeData))
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    pivottableService.allFields = FieldsData
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()
    $timeout.flush() // onAllIssuesDelayed
    $log.assertEmpty()

    expect(requestCalled).toBeTruthy()
    expect(pivottableService.allIssues.length).toBe(6)
  }))

  it('PARAMETERS: excludeGroups', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      excludeGroups: ['group1'],
      configOptions: {} }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()

    expect(pivottableService.worklogAuthors.length).toBe(0)
    expect(options.worklogAuthors).not.toBeNull()
  }))

  it('PARAMETERS: no restrictedGroups  no auditorsGroups', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      configOptions: {} }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()

    expect(pivottableService.worklogAuthors.length).toBe(0)
  }))

  it('PARAMETERS: restrictedGroups auditorsGroups', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      configOptions: { auditorsGroups: ['group1'], restrictedGroups: ['group2'] } }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()

    expect(pivottableService.worklogAuthors.length).toBe(1)
    expect(pivottableService.worklogAuthors[0]).toBe(loggedInUser.accountId)
  }))

  it('PARAMETERS: restrictedGroups 1 author', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      configOptions: { restrictedGroups: ['group1'] } }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()

    expect(pivottableService.worklogAuthors.length).toBe(1)
    expect(pivottableService.worklogAuthors[0]).toBe(loggedInUser.accountId)
  }))

  it('PARAMETERS: restrictedGroups and groups 1 author', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      groups: ['group1'],
      configOptions: { restrictedGroups: ['group1'] } }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()

    expect(pivottableService.worklogAuthors.length).toBe(1)
    expect(pivottableService.worklogAuthors[0]).toBe(loggedInUser.accountId)
  }))

  it('PARAMETERS: restrictedGroups and groups 0 authors', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      groups: ['group2'],
      configOptions: { restrictedGroups: ['group1'] } }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()

    expect(pivottableService.worklogAuthors.length).toBe(0)
  }))

  it('PARAMETERS: restrictedGroups 0 authors', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } }
    var options = { pivotTableType: 'IssueWorkedTimeByUser',
      configOptions: { restrictedGroups: ['group3'] } }

    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()

    expect(pivottableService.worklogAuthors.length).toBe(0)
  }))

  it('JQL for Date Fields for TimeBalance ["resolved"]', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'TimeBalance',
      dateFields: ['resolved'],
      startDate: '2018-10-23',
      endDate: '2018-10-24',
      configOptions: {} }

    var requestCalled = false

    AP.request = function (options) {
      if (options.url.match(/search/)) {
        this.getTimeoutFunc()(function () {
          requestCalled = true
          expect(options.url).toContain('jql=(resolved%20%3E%3D%20%222018-10-23%22)%20and%20(resolved%20%3C%20%222018-10-25%22)')
          options.success(angular.copy(TimeData))
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    pivottableService.allFields = FieldsData
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()
    $timeout.flush() // onAllIssuesDelayed
    $log.assertEmpty()

    expect(requestCalled).toBeTruthy()
  }))

  it('JQL for Date Fields for TimeTracking 3 fields', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'TimeTracking',
      dateFields: ['resolved', 'created', 'updated'],
      startDate: '2018-10-23',
      endDate: '2018-10-24',
      timeTrackingColumns: ['3timespent'],
      configOptions: {} }

    var requestCalled = false

    AP.request = function (options) {
      if (options.url.match(/search/)) {
        this.getTimeoutFunc()(function () {
          requestCalled = true
          expect(options.url).toContain('jql=(resolved%20%3E%3D%20%222018-10-23%22%20or%20created%20%3E%3D%20%222018-10-23%22%20or%20updated%20%3E%3D%20%222018-10-23%22)%20and%20(resolved%20%3C%20%222018-10-25%22%20or%20created%20%3C%20%222018-10-25%22%20or%20updated%20%3C%20%222018-10-25%22)')
          options.success(angular.copy(TimeData))
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    pivottableService.allFields = FieldsData
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()
    $timeout.flush() // onAllIssuesDelayed
    $log.assertEmpty()

    expect(requestCalled).toBeTruthy()
  }))

  it('JQL for Date Fields for IssuePassedTimeByStatus no "updated"', inject(function ($timeout, $log, pivottableService) {
    expect(pivottableService).toBeDefined()
    var loggedInUser = { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' }
    var options = { pivotTableType: 'IssuePassedTimeByStatus',
      dateFields: ['resolved', 'created'],
      startDate: '2018-10-23',
      endDate: '2018-10-24',
      configOptions: { workingTimeInStatus: {}, statuses: [] } }

    var requestCalled = false

    AP.request = function (options) {
      if (options.url.match(/search/)) {
        this.getTimeoutFunc()(function () {
          requestCalled = true
          expect(options.url).toContain('jql=(status%20changed%20after%20%222018-10-23%22%20or%20status%20changed%20on%20%222018-10-23%22%20or%20created%20%3E%3D%20%222018-10-23%22)%20and%20(status%20changed%20before%20%222018-10-25%22%20or%20created%20%3C%20%222018-10-25%22)')
          options.success(angular.copy(TimeData))
        }, 500)
      } else {
        AP.requestBak(options)
      }
    }

    pivottableService.allFields = FieldsData
    pivottableService.getPivotTable(loggedInUser, options).then(function (_pivotTable) {})

    $timeout.flush()
    $timeout.flush() // onAllIssuesDelayed
    $log.assertEmpty()

    expect(requestCalled).toBeTruthy()
  }))

  it('cacheWorklog', inject(function ($timeout, $httpBackend, $log, pivottableService, configurationService) {
    expect(pivottableService).toBeDefined()
    expect(configurationService).toBeDefined()

    // cache disabled

    configurationService.getConfiguration().then(function (config) {
      expect(pivottableService.clearWorklogCache(config)).not.toBeDefined()
    })

    $timeout.flush()
    $log.assertEmpty()

    // cache initialization

    AP.request = function (options) {
      if (options.url.match(/properties\/configuration/)) {
        options.success({ key: 'configuration', value: [{ key: 'cacheWorklog', val: true }] })
      } else {
        throw new Error('Unexpected call ' + options.url)
      }
    }

    var now = Date.now() - 3600000

    configurationService.resetState()

    configurationService.getConfiguration().then(function (config) {
      window.localStorage.clear()
      pivottableService.clearWorklogCache(config).then(function () {
        expect(parseInt(window.localStorage.getItem('updatedSince'))).not.toBeLessThan(now)
        expect(parseInt(window.localStorage.getItem('deletedSince'))).not.toBeLessThan(now)
        now = window.localStorage.getItem('updatedSince')
      })
    })

    $timeout.flush()
    $log.assertEmpty()

    // cache usage

    var worklog1 = {
      comment: 'test comment 1',
      created: '2013-12-05T00:00:00.000+0100',
      id: '10000',
      issueId: '10999',
      started: '2014-02-24T18:03:48.589+0100',
      timeSpent: '1h',
      timeSpentSeconds: 3600
    }

    var worklog = {
      maxResults: 1,
      startAt: 0,
      total: 1,
      worklogs: [worklog1]
    }

    var worklogCalled = 0

    AP.request = function (options) {
      if (options.url.match(/properties\/configuration/)) {
        options.success({ key: 'configuration', value: [{ key: 'cacheWorklog', val: true }] })
      } else if (options.url.match('/updated\\?since=' + now)) {
        options.success({ values: [], until: now, lastPage: true })
      } else if (options.url.match('deleted\\?since=' + now)) {
        options.success({ values: [], until: now, lastPage: true })
      } else if (options.url.match(/\/issue\/TIME-999\/worklog/)) {
        worklogCalled++
        options.success(JSON.stringify(worklog))
      } else {
        throw new Error('Unexpected call ' + options.url)
      }
    }

    configurationService.getConfiguration().then(function (config) {
      pivottableService.clearWorklogCache(config).then(function () {
        var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
        expect(cacheExpiry).toBeNull()
        pivottableService.getIssueWorklog('TIME-999', 10999).then(function () {
          var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
          expect(cacheExpiry).not.toBeNull()
          expect(Object.keys(cacheExpiry).length).toEqual(1)
          pivottableService.getIssueWorklog('TIME-999', 10999).then(function () {
          })
        })
      })
    })

    $timeout.flush()
    expect(worklogCalled).toEqual(1)
    $log.assertEmpty()

    // cache invalidation for updated worklog

    AP.request = function (options) {
      if (options.url.match('/updated\\?since=' + now)) {
        options.success({ values: [{ worklogId: 10000 }], until: now, lastPage: true })
      } else if (options.url.match('deleted\\?since=' + now)) {
        options.success({ values: [], until: now, lastPage: true })
      } else if (options.url.match('/worklog/list')) {
        options.success([worklog1])
      } else if (options.url.match(/\/issue\/TIME-999\/worklog/)) {
        worklogCalled++
        options.success(JSON.stringify(worklog))
      } else {
        throw new Error('Unexpected call ' + options.url)
      }
    }

    configurationService.getConfiguration().then(function (config) {
      pivottableService.clearWorklogCache(config).then(function () {
        var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
        expect(cacheExpiry).not.toBeNull()
        expect(Object.keys(cacheExpiry).length).toEqual(0)
        pivottableService.getIssueWorklog('TIME-999', 10999).then(function () {
          var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
          expect(cacheExpiry).not.toBeNull()
          expect(Object.keys(cacheExpiry).length).toEqual(1)
        })
      })
    })

    $timeout.flush()
    expect(worklogCalled).toEqual(2)
    $log.assertEmpty()

    // cache invalidation for deleted worklog

    AP.request = function (options) {
      if (options.url.match('/updated\\?since=' + now)) {
        options.success({ values: [], until: now, lastPage: true })
      } else if (options.url.match('deleted\\?since=' + now)) {
        options.success({ values: [{ worklogId: 10000 }], until: now, lastPage: true })
      } else if (options.url.match('/worklog/list')) {
        options.success([worklog1])
      } else if (options.url.match(/\/issue\/TIME-999\/worklog/)) {
        worklogCalled++
        options.success(JSON.stringify(worklog))
      } else {
        throw new Error('Unexpected call ' + options.url)
      }
    }

    configurationService.getConfiguration().then(function (config) {
      pivottableService.clearWorklogCache(config).then(function () {
        var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
        expect(cacheExpiry).not.toBeNull()
        expect(Object.keys(cacheExpiry).length).toEqual(0)
        pivottableService.getIssueWorklog('TIME-999', 10999).then(function () {
          var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
          expect(cacheExpiry).not.toBeNull()
          expect(Object.keys(cacheExpiry).length).toEqual(1)
        })
      })
    })

    $timeout.flush()
    expect(worklogCalled).toEqual(3)
    $log.assertEmpty()

    // cache expiry
    var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
    cacheExpiry[10999] = parseInt(now) - 3600000 * 24 * 7
    window.localStorage.setItem('cacheExpiry', JSON.stringify(cacheExpiry))
    pivottableService.expireWorklogCache()
    var cacheExpiry = TimesheetUtils.getJson(window.localStorage.getItem('cacheExpiry'))
    expect(cacheExpiry).not.toBeNull()
    expect(Object.keys(cacheExpiry).length).toEqual(0)
    expect(window.localStorage.getItem('i10999')).toBeNull()
    expect(window.localStorage.getItem('w10000')).toBeNull()
  }))
})
