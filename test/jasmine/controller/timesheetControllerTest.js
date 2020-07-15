describe('timesheetControllerTest', function () {
  // wait for async loading required modules
  false && beforeAll(function (done) {
    require(['app/controllers/timesheetController', 'app/services/pivottableService'], done)
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
      },
      toHaveColumnsNumber: function () {
        return {
          compare: function (actual, expected) {
            var rowsCount = Object.keys(actual.totals).length
            return JasmineMatcherUtils.getMatcherResult(
              rowsCount === expected,
              'PivotTable must have ' + expected + ' columns',
              "PivotTable mustn't have " + expected + ' columns')
          }
        }
      }
    })
  })

  var getFirstColumnKey = function (pivotTable) {
    var totalKeys = Object.keys(pivotTable.totals)
    return pivotTable.totals[totalKeys[0]].columnKey
  }

  var getFirstRow = function (pivotTable) {
    var rowKeys = Object.keys(pivotTable.rows)
    return pivotTable.rows[rowKeys[0]]
  }

  var getFirstRowKey = function (pivotTable) {
    return getFirstRow(pivotTable).rowKey
  }

  var checkOptions = function (scope) {
    expect(scope.groupByOptions).not.toBeNull()
    expect(scope.groupByOptions).toBeInstanceOf(TimesheetSelectOptions)
    expect(scope.groupByOptions.options.length).toBe(scope.pivotTableType === 'TimeTracking' ? 38 : scope.pivotTableType === 'IssueWorkedTimeByUser' ? 45 : 44)
    expect(scope.groupByOptions.options).toContainInProperty('Security Level', 'label')
    expect(scope.groupByOptions.options).toContainInProperty('resolution', 'id')
    expect(scope.filterByOptions).not.toBeNull()
    expect(scope.filterByOptions).toBeInstanceOf(TimesheetSelectOptions)
    expect(scope.filterByOptions.options.length).toBe(12)
    expect(scope.filterByOptions.options).toContainInProperty('All issues', 'label')
    expect(scope.filterByOptions.options).toContainInProperty('Demonstration Project (DEMO)', 'label')
    expect(scope.filterByOptions.options).toContainInProperty('filter_10000', 'id')
    expect(scope.filterByOptions.options).toContainInProperty('project_DEMO', 'id')
  }

  // TESTS START

  beforeEach(function () {
    module('talis.services.logging')
    module('configuration')
    module('timesheetApp')
    angular.module('timesheetApp').service('flightRecorder', function () {
      this.writeParams = this.setEnabled = function () {
      }
    }).factory('userConfiguration', function () {
      return {
        maxFractionDigits: {},
        compositionIssueLink: {},
        parentIssueField: {},
        parentIssueType: {},
        auditorsGroups: {},
        restrictedGroups: {},
        weekendType: {},
        preserveStartedTime: {},
        statuses: {},
        timeInStatusCategories: {},
        prettyDuration: { val: true },
        workLabels: {},
        workDescriptionRequired: {},
        worklogVisibilityGroup: {},
        worklogVisibilityRole: {},
        durationType: {},
        durationTypeForExport: {},
        workingTimeInStatus: { val: { from: 9, to: 17 } },
        startedTimeInStatus: { val: false },
        inProgressIssuesJql: {},
        timeBalanceColumns: { val: ['3timespent', '12estimate', '4diff', '1timeoriginalestimate', '6progress'] },
        timeTrackingColumns: { val: ['1timeoriginalestimate', '2esttimeremaining',
          '3timespent', '4diff', '5originalestimateremaining', '6progress'] },
        exportColumns: { val: ['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
        dateFields: { val: [] },
        disableLogWork: {},
        restrictWorkPerDay: {},
        workUnderLimitColor: {},
        workOverLimitColor: {},
        showDetailsCount: {},
        showCategoryRow: {},
        logWorkRetrospectively: {},
        allowToLogFromDate: {},
        currencySymbol: {},
        showTotalInFront: {},
        tempoToken: {},
        rowsPerPage: {},
        accountantsGroups: {}
      }
    }).factory('trackingService', function () {
      return {
        track: () => {},
        trackViewedReport: () => {},
        trackModifiedDisplay: () => {},
        trackNavigated: () => {}
      }
    })
    inject(function ($timeout, $window, _$httpBackend_, applicationLoggingService, $rootScope) {
      AP.$timeout = $timeout
      $httpBackend = _$httpBackend_
      $httpBackend.whenGET('/templates/main.html').respond(200, '')
      $window.i18nDefault = 'i18n/default.json'
      $httpBackend.whenGET($window.i18nDefault).respond(200, translations)
      $httpBackend.whenGET(/^\/api\/worklog/).respond(200, TimeData.issues)
      $httpBackend.whenGET(/^\/canLogWork\?accountId=noSuchUser/).respond(200, true)
      applicationLoggingService.debug = function () {}
      $rootScope.license = 'active'
    })
    AP.requestBak = AP.request
  })

  afterEach(function () {
    delete AP.$timeout
    AP.request = AP.requestBak
  })

  it('default (no params)', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(0)
    expect(scope.pivotTable).toHaveColumnsNumber(7)
    expect(scope.pivotTable.sum).toBe(0)
    expect(scope.rowKeySize).toBe(1)
    checkOptions(scope)
  }))

  it('default (no params) [sumSubTasks]', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout, $log) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      configurationService: {
        getProjects: function () {
          var deferred = $q.defer()
          deferred.resolve(ProjectsData)
          return deferred.promise
        },
        getDefaultTimeTrackingColumns: function () {
          return []
        },
        getDefaultTimeBalanceColumns: function () {
          return []
        },
        getAllTimeTrackingColumns: function () {
          return []
        },
        getAllTimeBalanceColumns: function () {
          return []
        },
        getAllDateFields: function () {
          return []
        },
        getAllStatusCategories: function () {
          var deferred = $q.defer()
          deferred.resolve(StatusCategoryData)
          return deferred.promise
        }
      },
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    AP.request = function (options) {
      if (options.url.match(/jql=project%3D%22DEMO%22%20and%20'Epic%20Link'%20is%20not%20EMPTY/)) {
        options.success({ issues: [{
          id: '10002',
          key: 'TIME-3',
          timeestimate: 0,
          timeoriginalestimate: 72000,
          timespent: 36000,
          fields: {
            customfield_10007: 'TIME-2'
          }
        }] })
      } else {
        AP.requestBak(options)
      }
    }

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    $log.assertEmpty()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(0)
    expect(scope.pivotTable).toHaveColumnsNumber(7)
    expect(scope.pivotTable.sum).toBe(0)
    expect(scope.rowKeySize).toBe(1)
    checkOptions(scope)
  }))

  it('canLogWorkForUser in restrictedGroups', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    // logWorkForOthersGroups: {['teamA']}
    // restrictedGroups: {['noGroup']}
    // user: 'noSuchUser' (groups: {['noGroup']})
    // loggedInUser: {groups: ['teamA','noGroup']}

    // expect scope.canLogWorkForUser == true

    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { loaded: true, user: 'noSuchUser' },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'teamA' }, { name: 'noGroup' }] } },
      projectKey: 'TIME',
      userConfiguration: {
        maxFractionDigits: {},
        compositionIssueLink: {},
        parentIssueField: {},
        parentIssueType: {},
        auditorsGroups: {},
        logWorkForOthersGroups: { val: ['teamA'] },
        restrictedGroups: { val: ['noGroup'] },
        weekendType: {},
        preserveStartedTime: {},
        statuses: {},
        timeInStatusCategories: {},
        prettyDuration: { val: true },
        workLabels: {},
        workDescriptionRequired: {},
        worklogVisibilityGroup: {},
        worklogVisibilityRole: {},
        durationType: {},
        durationTypeForExport: {},
        workingTimeInStatus: { val: { from: 9, to: 17 } },
        startedTimeInStatus: { val: false },
        inProgressIssuesJql: {},
        timeBalanceColumns: { val: ['3timespent', '12estimate', '4diff', '1timeoriginalestimate', '6progress'] },
        timeTrackingColumns: {
          val: ['1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining', '6progress']
        },
        exportColumns: { val: ['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
        dateFields: { val: [] },
        disableLogWork: {},
        restrictWorkPerDay: {},
        workUnderLimitColor: {},
        workOverLimitColor: {},
        showDetailsCount: {},
        showCategoryRow: {},
        currencySymbol: {},
        showTotalInFront: {},
        tempoToken: {},
        rowsPerPage: {},
        accountantsGroups: {}
      }
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()

    expect(scope.canLogWorkForUser).toBe(true)
  }))

  it('canLogWorkForUser not in restrictedGroups', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    // logWorkForOthersGroups: {['teamA']}
    // restrictedGroups: {['noGroup', 'teamA']}
    // user: 'noSuchUser' (groups: {['noGroup']})
    // loggedInUser: {groups: ['teamA']}

    // expect scope.canLogWorkForUser == false

    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { loaded: true, user: 'noSuchUser' },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'teamA' }] } },
      projectKey: 'TIME',
      userConfiguration: {
        maxFractionDigits: {},
        compositionIssueLink: {},
        parentIssueField: {},
        parentIssueType: {},
        auditorsGroups: {},
        logWorkForOthersGroups: { val: ['teamA'] },
        restrictedGroups: { val: ['noGroup', 'teamA'] },
        weekendType: {},
        preserveStartedTime: {},
        statuses: {},
        timeInStatusCategories: {},
        prettyDuration: { val: true },
        workLabels: {},
        workDescriptionRequired: {},
        worklogVisibilityGroup: {},
        worklogVisibilityRole: {},
        durationType: {},
        durationTypeForExport: {},
        workingTimeInStatus: { val: { from: 9, to: 17 } },
        startedTimeInStatus: { val: false },
        inProgressIssuesJql: {},
        timeBalanceColumns: { val: ['3timespent', '12estimate', '4diff', '1timeoriginalestimate', '6progress'] },
        timeTrackingColumns: {
          val: ['1timeoriginalestimate', '2esttimeremaining', '3timespent', '4diff', '5originalestimateremaining', '6progress']
        },
        exportColumns: { val: ['project', 'issuetype', 'key', 'summary', 'priority', 'datestarted', 'displayname', 'descriptionstatus'] },
        dateFields: { val: [] },
        disableLogWork: {},
        restrictWorkPerDay: {},
        workUnderLimitColor: {},
        workOverLimitColor: {},
        showDetailsCount: {},
        showCategoryRow: {},
        currencySymbol: {},
        showTotalInFront: {},
        tempoToken: {},
        rowsPerPage: {},
        accountantsGroups: {}
      }
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()

    expect(scope.canLogWorkForUser).toBeUndefined()
  }))

  it('PARAMETERS: startDate', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(6)
    expect(scope.pivotTable).toHaveColumnsNumber(7)
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4', 'TIME-5', 'TIME-6'])
    expect(scope.pivotTable.sum).toBe(176400)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
  }))

  it('PARAMETERS: startDate, endDate', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    expect(getFirstColumnKey(scope.pivotTable).keyName).toEqual('dayOfTheWeek')
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4'])
    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-5', 'TIME-6'])
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
  }))

  it('PARAMETERS: numOfWeeks, offset', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    TimesheetUtils.getLastMondayDateBak = TimesheetUtils.getLastMondayDate
    TimesheetUtils.getLastMondayDate = function () {
      return new Date('2014-03-03') // '2014-02-24' + 1 week
    }
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { numOfWeeks: 1, offset: -1, loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(6)
    expect(scope.pivotTable).toHaveColumnsNumber(7)
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4', 'TIME-5', 'TIME-6'])
    expect(scope.pivotTable.sum).toBe(176400)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
    TimesheetUtils.getLastMondayDate = TimesheetUtils.getLastMondayDateBak
  }))

  it('PARAMETERS: monthView', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', view: 'month', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(1)
    expect(getFirstColumnKey(scope.pivotTable).keyName).toEqual('weekOfTheYear')
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4'])
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
  }))

  it('PARAMETERS: groupByField', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', groupByField: 'created', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(1)
    expect(getFirstRowKey(scope.pivotTable).keyName).toEqual('created')
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
  }))

  it('PARAMETERS: groupBy Epic Name', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', groupByField: 'customfield_10008', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(2)
    expect(getFirstRowKey(scope.pivotTable).keyName).toEqual('customfield_10008')
    expect(getFirstRowKey(scope.pivotTable).keyValue).toEqual('Test Epic')
    expect(getFirstRow(scope.pivotTable).sum).toEqual(39600)
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
  }))

  it('PARAMETERS: pivotTableType=IssueWorkedTimeByUser', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { pivotTableType: 'IssueWorkedTimeByUser', startDate: '2014-02-24', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(6)
    expect(scope.pivotTable).toHaveColumnsNumber(1)
    var totalColumn = getFirstColumnKey(scope.pivotTable)
    expect(totalColumn.keyName).toEqual('user')
    expect(totalColumn.keyValue).toEqual('aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa')
    expect(scope.pivotTable.sum).toBe(176400)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
  }))

  it('PARAMETERS: pivotTableType=TimeTracking', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { pivotTableType: 'TimeTracking', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      configurationService: {
        getProjects: function () {
          var deferred = $q.defer()
          deferred.resolve(ProjectsData)
          return deferred.promise
        },
        getDefaultTimeTrackingColumns: function () {
          return []
        },
        getDefaultTimeBalanceColumns: function () {
          return []
        },
        getAllTimeTrackingColumns: function () {
          return []
        },
        getAllTimeBalanceColumns: function () {
          return []
        }
      },
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(6)
    expect(scope.pivotTable).toHaveColumnsNumber(6)
    var totalColumn = getFirstColumnKey(scope.pivotTable)
    expect(totalColumn.keyName).toEqual('PlannedVsActual')
    expect(totalColumn.keyValue).toEqual('1timeoriginalestimate')
    expect(scope.pivotTable.sum).toBe(265600)
    expect(scope.rowKeySize).toBe(5)
    checkOptions(scope)
  }))

  it('PARAMETERS: pivotTableType=TimeBalance', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      configurationService: {
        getProjects: function () {
          var deferred = $q.defer()
          deferred.resolve(ProjectsData)
          return deferred.promise
        },
        getDefaultTimeTrackingColumns: function () {
          return []
        },
        getDefaultTimeBalanceColumns: function () {
          return ['3timespent', '12estimate', '4diff', '1timeoriginalestimate', '6progress']
        },
        getAllTimeTrackingColumns: function () {
          return []
        },
        getAllTimeBalanceColumns: function () {
          return []
        }
      },
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(2)
    expect(getFirstRowKey(scope.pivotTable).keyValue).toEqual('TIME-6')
    expect(scope.pivotTable).toHaveColumnsNumber(5)
    var totalColumn = getFirstColumnKey(scope.pivotTable)
    expect(totalColumn.keyName).toEqual('PlannedVsActual')
    expect(totalColumn.keyValue).toEqual('3timespent')
    expect(scope.pivotTable.totals['3timespent'].sum).toBe(14400)
    expect(scope.rowKeySize).toBe(5)
  }))

  it('PARAMETERS: pivotTableType=TimeBalance, sumSubTasks: true', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, startDate: '2013-12-04', endDate: '2017-04-10', pivotTableType: 'TimeBalance', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      configurationService: {
        getProjects: function () {
          var deferred = $q.defer()
          deferred.resolve(ProjectsData)
          return deferred.promise
        },
        getDefaultTimeTrackingColumns: function () {
          return []
        },
        getDefaultTimeBalanceColumns: function () {
          return ['3timespent', '12estimate', '4diff', '1timeoriginalestimate', '6progress']
        },
        getAllTimeTrackingColumns: function () {
          return []
        },
        getAllTimeBalanceColumns: function () {
          return []
        }
      },
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(2)
    expect(getFirstRowKey(scope.pivotTable).keyValue).toEqual('TIME-5')
    expect(scope.pivotTable).toHaveColumnsNumber(5)
    var totalColumn = getFirstColumnKey(scope.pivotTable)
    expect(totalColumn.keyName).toEqual('PlannedVsActual')
    expect(totalColumn.keyValue).toEqual('3timespent')
    expect(scope.pivotTable.totals['3timespent'].sum).toBe(14400)
    expect(scope.rowKeySize).toBe(5)
  }))

  it('PARAMETERS: pivotTableType=IssuePassedTimeByResolution, sumSubTasks: true', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, startDate: '2014-02-24', numOfWeeks: 1, pivotTableType: 'IssuePassedTimeByResolution', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(1)
    var totalColumn = getFirstColumnKey(scope.pivotTable)
    expect(totalColumn.keyName).toEqual(undefined)
    expect(totalColumn.keyValue).toEqual('Unresolved')
    expect(scope.pivotTable.totals['Unresolved'].sum).toBe(864000)
    expect(scope.rowKeySize).toBe(5)
  }))

  it('PARAMETERS: pivotTableType=IssuePassedTimeByStatus, sumSubTasks: true', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, startDate: '2014-02-24', numOfWeeks: 1, pivotTableType: 'IssuePassedTimeByStatus', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    var totalColumn = getFirstColumnKey(scope.pivotTable)
    expect(totalColumn.keyName).toEqual(undefined)
    expect(totalColumn.keyValue).toEqual('Open')
    expect(scope.pivotTable.totals['Open'].sum).toBe(576000)
    expect(scope.rowKeySize).toBe(5)
  }))

  it('PARAMETERS: user=noSuchUser', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    var startDate = '2014-02-24'
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: startDate, user: 'noSuchUser', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(0)
    expect(scope.pivotTable).toHaveColumnsNumber(7)
    var totalColumn = getFirstColumnKey(scope.pivotTable)
    expect(totalColumn.keyName).toEqual('dayOfTheWeek')
    expect(totalColumn.keyValue).toEqual(moment(startDate).unix() * 1000)
    expect(scope.pivotTable.sum).toBe(0)
    expect(scope.rowKeySize).toBe(1)
    checkOptions(scope)
  }))

  it('cache configuration', inject(function ($controller, configurationService, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var configCalled = false
    AP.request = function (options) {
      configCalled = configCalled || options.url.match(/properties\/configuration/)
    }
    configurationService.getConfiguration()
    $timeout.flush()
    expect(configCalled).toBeTruthy()
    configCalled = false
    configurationService.getConfiguration()
    // $timeout.flush();
    expect(configCalled).toBeFalsy()
    configurationService.resetState()
    configurationService.getConfiguration()
    $timeout.flush()
    expect(configCalled).toBeTruthy()
  }))

  it('PARAMETERS: group', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { user: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', group: ['group1', 'group2'], loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa', groups: { items: [{ name: 'group1' }, { name: 'group2' }] } },
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()

    expect(scope.TimesheetUtils).not.toBeNull()
    expect(scope.loading).toBeFalsy()
    expect(scope.pivotTable).not.toBeNull()
    expect(scope.pivotTable.pivotStrategy).not.toBeNull()
    expect(scope.pivotTable).toHaveRowsNumber(0)
    expect(scope.pivotTable).toHaveColumnsNumber(7)
    expect(scope.pivotTable.sum).toBe(0)
    expect(scope.rowKeySize).toBe(1)
    expect(scope.group).toEqual(['group1', 'group2'])
    checkOptions(scope)
  }))

  it('concurrent', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    AP.$timeoutDelay = 100
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { user: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: { accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa' },
      projectKey: 'TIME'
    })

    $timeout.flush(200) // init
    expect(scope.loading).toBe(1)

    scope.weekSumChange()
    expect(scope.loading).toBe(2) // no concurrent execute!

    $httpBackend.flush()
    $timeout.flush(200) // concurrent init and execute
    expect(scope.loading).toBe(0)
    $timeout.verifyNoPendingTasks()

    expect(scope.pivotTable).toBeDefined()
    expect(scope.pivotTable.pivotStrategy).toBeDefined()
    expect(scope.pivotTable).toHaveRowsNumber(0)
    expect(scope.pivotTable).toHaveColumnsNumber(1) // sum week
    expect(scope.pivotTable.sum).toBe(0)
    expect(scope.rowKeySize).toBe(1)
    checkOptions(scope)

    AP.$timeoutDelay = 0
  }))

  it('inplace replacement, delete', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4'])
    var data = {
      action: 'deleted',
      issueKey: 'TIME-2',
      worklogOld: {
        started: '2014-02-25T18:03:49.225+0100',
        timeSpent: '5h',
        timeSpentSeconds: 18000,
        id: '10004'
      }
    }
    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-2'])
  }))

  it('inplace replacement, update', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4'])
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    expect(scope.pivotTable.rows['TIME-2'].columns[scope.pivotTable.sortedColumns()[0].columnKey.keyValue].entries.length).toBe(0)
    expect(scope.pivotTable.rows['TIME-2'].columns[scope.pivotTable.sortedColumns()[1].columnKey.keyValue].entries.length).toBe(1)

    var data = {
      action: 'updated',
      issueKey: 'TIME-2',
      worklogOld: {
        started: '2014-02-25T18:03:49.225+0100',
        timeSpent: '5h',
        timeSpentSeconds: 18000,
        id: '10004'
      },
      worklog: {
        started: '2014-02-24T18:03:49.225+0100',
        timeSpent: '1h',
        timeSpentSeconds: 3600,
        id: '10004'
      }
    }
    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    expect(scope.pivotTable.sum).toBe(79200 - 5 * 3600 + 1 * 3600)
    expect(scope.pivotTable.rows['TIME-2'].columns[scope.pivotTable.sortedColumns()[0].columnKey.keyValue].entries.length).toBe(1)
    expect(scope.pivotTable.rows['TIME-2'].columns[scope.pivotTable.sortedColumns()[1].columnKey.keyValue].entries.length).toBe(0)
  }))

  it('inplace replacement, add', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-7'])
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(2)

    var data = {
      action: 'added',
      issueKey: 'TIME-7',
      worklog: TimeDataTIME_7.worklog.worklogs[0]
    }
    AP.request = function (options) {
      if (options.url.match(/rest\/api\/2\/issue\/TIME-7/)) {
        options.success(angular.copy(TimeDataTIME_7))
      } else {
        AP.requestBak(options)
      }
    }
    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(scope.pivotTable).toHaveRowsNumber(5)
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    expect(scope.pivotTable.sum).toBe(79200 + 3600)
  }))

  it('inplace replacement, add array of worklogs', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { startDate: '2014-02-24', endDate: '2014-02-25', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1'])
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(2)

    var data = {
      action: 'added',
      issueKey: 'TIME-1',
      worklog: [{ timeSpentSeconds: 1000, created: '2014-02-24T18:03:49.225+0100', started: '2014-02-24T18:03:49.225+0100' },
        { timeSpentSeconds: 2000, created: '2014-02-24T18:03:49.225+0100', started: '2014-02-25T18:03:49.225+0100' }]
    }
    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable).toHaveColumnsNumber(2)
    expect(scope.pivotTable.sum).toBe(79200 + 1000 + 2000)
  }))

  it('inplace replacement, add subtask from allIssues, sumSubTasks: true', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, startDate: '2014-02-24', endDate: '2014-02-25', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-5'])
    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-6'])
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.pivotTable).toHaveRowsNumber(3)

    var data = {
      action: 'added',
      issueKey: 'TIME-6',
      worklog: {
        created: '2014-02-24T18:03:49.225+0100',
        started: '2014-02-24T18:03:49.225+0100',
        timeSpent: '1h',
        timeSpentSeconds: 3600 }
    }
    AP.request = function (options) {
      if (options.url.match(/rest\/api\/2\/issue\/TIME-6/)) {
        var issue6 = angular.copy(TimeData.issues[5])
        issue6.worklog.maxResults++
        issue6.worklog.total++
        issue6.worklog.worklogs.push(data.worklog)
        options.success(issue6)
      } else {
        AP.requestBak(options)
      }
    }

    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-5'])
    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-6'])
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable.sum).toBe(79200 + 3600)
  }))

  it('inplace replacement, add subtask not from allIssues, sumSubTasks: true', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, startDate: '2014-02-24', endDate: '2014-02-25', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-5'])
    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-6'])
    expect(scope.pivotTable.sum).toBe(79200)
    expect(scope.pivotTable).toHaveRowsNumber(3)

    var data = {
      action: 'added',
      issueKey: 'TIME-6',
      worklog: {
        created: '2014-02-24T18:03:49.225+0100',
        started: '2014-02-24T18:03:49.225+0100',
        timeSpent: '1h',
        timeSpentSeconds: 3600 }
    }
    AP.request = function (options) {
      if (options.url.match(/rest\/api\/2\/issue\/TIME-6/)) {
        var issue6 = angular.copy(TimeData.issues[5])
        issue6.worklog.maxResults++
        issue6.worklog.total++
        issue6.worklog.worklogs.push(data.worklog)
        options.success(issue6)
      } else {
        AP.requestBak(options)
      }
    }

    // clean reduntant issues to simulate no issues provided
    pivottableService.allIssues = pivottableService.allIssues.filter(function (issue) {
      return issue.key !== 'TIME-5' && issue.key !== 'TIME-6'
    })
    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-5'])
    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-6'])
    expect(scope.pivotTable).toHaveRowsNumber(4)
    expect(scope.pivotTable.sum).toBe(79200 + 3600)
  }))

  it('inplace replacement, add regular task, issue in allIssues, sumSubTasks: true', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, startDate: '2014-02-24', endDate: '2014-02-24', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-2'])
    expect(scope.pivotTable.sum).toBe(32400)
    expect(scope.pivotTable).toHaveRowsNumber(2)

    var data = {
      action: 'added',
      issueKey: 'TIME-2',
      worklog: {
        created: '2014-02-24T18:03:49.225+0100',
        started: '2014-02-24T18:03:49.225+0100',
        timeSpent: '1h',
        timeSpentSeconds: 3600 }
    }
    AP.request = function (options) {
      if (options.url.match(/rest\/api\/2\/issue\/TIME-2/)) {
        var issue2 = angular.copy(TimeData.issues[2])
        issue2.worklog.maxResults++
        issue2.worklog.total++
        issue2.worklog.worklogs.push(data.worklog)
        options.success(issue2)
      } else {
        AP.requestBak(options)
      }
    }

    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-2'])
    expect(scope.pivotTable).toHaveRowsNumber(3)
    expect(scope.pivotTable.sum).toBe(32400 + 3600)
  }))

  it('inplace replacement, add regular task, issue not in allIssues, sumSubTasks: true', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { sumSubTasks: true, startDate: '2017-10-03', endDate: '2017-10-03', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-2'])
    expect(scope.pivotTable.sum).toBe(0)
    expect(scope.pivotTable).toHaveRowsNumber(0)

    var data = {
      action: 'added',
      issueKey: 'TIME-7',
      worklog: {
        created: '2017-10-03T18:03:49.225+0100',
        started: '2017-10-03T18:03:49.225+0100',
        timeSpent: '1h',
        timeSpentSeconds: 3600 }
    }
    AP.request = function (options) {
      if (options.url.match(/rest\/api\/2\/issue\/TIME-7/)) {
        var issue7 = angular.copy(TimeDataTIME_7)
        issue7.worklog.maxResults++
        issue7.worklog.total++
        issue7.worklog.worklogs.push(data.worklog)
        options.success(issue7)
      } else {
        AP.requestBak(options)
      }
    }

    scope.dialogCloseFunction(data)
    $timeout.flush()
    expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-7'])
    expect(scope.pivotTable).toHaveRowsNumber(1)
    expect(scope.pivotTable.sum).toBe(3600)
  }))

  it('inplace replacement, add and delete subtask, sumSubTasks: true, includeEmpty: true, moreFields', inject(function ($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
    var scope = $rootScope.$new()
    $controller('TimesheetController', {
      $scope: scope,
      $route: $route,
      timesheetParams: { moreFields: ['timespent'], includeEmpty: true, sumSubTasks: true, startDate: '2017-10-03', endDate: '2017-10-03', loaded: true },
      $location: $location,
      $sce: $sce,
      pivottableService: pivottableService,
      loggedInUser: {},
      projectKey: 'TIME'
    })

    var checkCommon = function () {
      expect(scope.pivotTable).toHaveRowsNumber(4)
      expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-5'])
      expect(scope.pivotTable.rows['TIME-5'].data.length).toBe(1)
    }

    $timeout.flush()
    expect(scope.loading).toBeDefined()
    $httpBackend.flush()
    $timeout.flush()
    expect(scope.loading).toBeFalsy()

    checkCommon()
    expect(scope.pivotTable.rows['TIME-5'].rowKey._issue.fields['original_timespent']).toBe(undefined)
    expect(scope.pivotTable.rows['TIME-5'].rowKey._issue.fields['timespent']).toBe(36000 + 2 * 3600)
    expect(scope.pivotTable.rows['TIME-5'].data[0].worklog).toBe(undefined)

    var data = {
      action: 'added',
      issueKey: 'TIME-6',
      worklog: {
        id: 'id',
        created: '2017-10-03T18:03:49.225+0100',
        started: '2017-10-03T18:03:49.225+0100',
        timeSpent: '1h',
        timeSpentSeconds: 3600 }
    }

    scope.dialogCloseFunction(data)
    $timeout.flush()

    checkCommon()
    expect(scope.pivotTable.rows['TIME-5'].rowKey._issue.fields['original_timespent']).toBe(36000)
    expect(scope.pivotTable.rows['TIME-5'].rowKey._issue.fields['timespent']).toBe(36000 + 2 * 3600)
    expect(scope.pivotTable.rows['TIME-5'].data[0].worklog).not.toBe(undefined)

    var dataDel = {
      action: 'deleted',
      issueKey: 'TIME-6',
      worklogOld: {
        id: 'id',
        created: '2017-10-03T18:03:49.225+0100',
        started: '2017-10-03T18:03:49.225+0100',
        timeSpent: '1h',
        timeSpentSeconds: 3600 }
    }
    scope.dialogCloseFunction(dataDel)
    $timeout.flush()

    checkCommon()
    expect(scope.pivotTable.rows['TIME-5'].rowKey._issue.fields['original_timespent']).toBe(36000)
    expect(scope.pivotTable.rows['TIME-5'].rowKey._issue.fields['timespent']).toBe(36000 + 2 * 3600)
    expect(scope.pivotTable.rows['TIME-5'].data[0].worklog).toBe(undefined)
  }))
})
