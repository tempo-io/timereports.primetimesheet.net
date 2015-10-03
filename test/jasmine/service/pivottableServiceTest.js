describe("pivottableServiceTest", function() {
    beforeEach(function() {
        module('timesheetApp');
        inject(function ($timeout, $window, _$httpBackend_) {
            AP.$timeout = $timeout;
            $window.i18nDefault = 'i18n/default.json';
            _$httpBackend_.whenGET("i18n/default.json").respond({});
            _$httpBackend_.flush();
        })
        AP.requestBak = AP.request;
    });

    afterEach(function() {
        delete AP.$timeout;
        AP.request = AP.requestBak;
    });

    // jasmine matchers and helpers methods

    beforeEach(function () {
        jasmine.addMatchers({
            toHaveRowsNumber: function() {
                return {
                    compare: function (actual, expected) {
                        var rowsCount = Object.keys(actual.rows).length;
                        return JasmineMatcherUtils.getMatcherResult(
                                rowsCount == expected,
                                "PivotTable must have " + expected + " rows, but has " + rowsCount,
                                "PivotTable mustn't have " + expected + " rows, but has " + rowsCount);
                    }
                };
            }
        });
    });

    it('Timesheet', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'Timesheet', startDate: '2014-02-24', configOptions: {}};
        var pivotTable;
        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {
            pivotTable = _pivotTable;
        });
        $timeout.flush();
        expect(pivotTable).toBeDefined();
        expect(pivotTable).toHaveRowsNumber(6);
    }));

    it('Timesheet [endDate, w/out startDate]', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'Timesheet', endDate: '2014-03-06', configOptions: {}};
        var pivotTable;
        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {
            pivotTable = _pivotTable;
        });
        $timeout.flush();
        expect(pivotTable).toBeDefined();
        expect(pivotTable).toHaveRowsNumber(3);
        expect(pivotTable.rows['TIME-3'].sum).toEqual(21600);
        expect(pivotTable.rows['TIME-5'].sum).toEqual(18000);
        expect(pivotTable.rows['TIME-6'].sum).toEqual(7200);
        expect(pivotTable.sum).toEqual(46800);
    }));

    it('IssueWorkedTimeByUser', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}};
        var pivotTable;
        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {
            pivotTable = _pivotTable;
        });
        $timeout.flush();
        expect(pivotTable).toBeDefined();
        expect(pivotTable).toHaveRowsNumber(6);
        expect(pivotTable.rows['TIME-5'].sum).toEqual(36000);
        expect(pivotTable.rows['TIME-6'].sum).toEqual(7200);
        expect(pivotTable.sum).toEqual(176400);
    }));

    it('IssueWorkedTimeByUser_sumSubTasks', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'IssueWorkedTimeByUser', configOptions: {parentIssueField: 'customfield_10005', compositionIssueLink: 'Duplicate'}, sumSubTasks: true};
        var pivotTable;
        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {
            pivotTable = _pivotTable;
            pivotTable.queue['TIME-5'].promise.then(function(issue) {
                // check it is not overwritten by subscequent resolve
                expect(issue.worklog.worklogs.length).toEqual(4);
            });
        });
        $timeout.flush();
        expect(pivotTable).toBeDefined();
        expect(pivotTable).toHaveRowsNumber(2);
        expect(Object.keys(pivotTable.rows)).toContainAll(["TIME-1", "TIME-5"]);
        expect(pivotTable.rows['TIME-1'].sum).toEqual(532800);
        expect(pivotTable.rows['TIME-5'].sum).toEqual(86400);
        expect(pivotTable.sum).toEqual(619200);
    }));

    // verify subsequent resolve does not make effect
    it('deferredTest', inject(function($timeout, $q) {
        var deferred = $q.defer();
        deferred.resolve(1);
        deferred.resolve(2);
        deferred.promise.then(function(result) {
            expect(result).toEqual(1);
        });
        $timeout.flush();
    }));

    it('getPivotTable [options:set/reset] sumSubTasks: true', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, sumSubTasks: true};

        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {});

        $timeout.flush();

        expect(pivottableService.sumSubTasks).toEqual(true);
        expect(pivottableService.startDate).not.toBeDefined();
        expect(pivottableService.endDate).not.toBeDefined();
    }));

    it('getPivotTable [options:set/reset] sumSubTasks: false', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, sumSubTasks: false};

        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {});

        $timeout.flush();

        expect(pivottableService.sumSubTasks).toEqual(false);
        expect(pivottableService.startDate).not.toBeDefined();
        expect(pivottableService.endDate).not.toBeDefined();
    }));

    it('getPivotTable [options:set/reset] startDate', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, startDate: '2015-01-25'};

        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {});

        $timeout.flush();

        expect(pivottableService.startDate).toEqual('2015-01-25');
        expect(pivottableService.sumSubTasks).not.toBeDefined();
    }));

    it('loadAllWorklogs [worklog.total > worklog.maxResults]', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();

        var generateWorklogs = function(count) {
            var worklog = {
                "maxResults" : count,
                "startAt" : 0,
                "total" : count,
                "worklogs" : []
            };
            for (var i = 0; i < count; i++) {
                worklog.worklogs.push({
                    "comment" : "test comment " + i,
                    "created" : "2013-12-05T00:00:00.000+0100",
                    "id" : i + "00",
                    "started" : "2014-02-24T18:03:48.589+0100",
                    "timeSpent" : i + "h",
                    "timeSpentSeconds" : i * 3600
                });
            }
            return worklog;
        };

        AP.request = function(options) {
            this.getTimeoutFunc()(function() {
                if (options.url.match(/issue\/TIME-999\/worklog/)) {
                    options.success(generateWorklogs(22));
                }
            }, 500);
        };

        var issue = {
            "key": "TIME-999",
            "fields": {
                "worklog": {
                    "total": 22,
                    "maxResults": 20
                }
            }
        };
        var result;

        pivottableService.loadAllWorklogs(issue).promise.then(function(_issue) {
            result = _issue;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.fields.worklog.worklogs.length).toEqual(22);
    }));

    it('Parent issue not in search result', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'IssueWorkedTimeByUser', configOptions: {}, sumSubTasks: true};

        var childIssue = {};
        angular.copy(TimeData.issues[5], childIssue);
        var worklog = childIssue.worklog || childIssue.fields.worklog;
        worklog.total += worklog.maxResults + 1;
        var searchResult = {issues: [childIssue]};

        AP.request = function(options) {
            this.getTimeoutFunc()(function() {
                if (options.url.match(/search/)) {
                    options.success(searchResult);
                }
            }, 500);
        };

        var spy = spyOn(pivottableService, 'loadAllWorklogs').and.callThrough();

        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {});

        $timeout.flush();

        expect(pivottableService.allIssues.length).toBe(0);
        expect(spy.calls.count()).toBe(1);
    }));

    it('PARAMETERS: groups', inject(function($timeout, pivottableService) {
        expect(pivottableService).toBeDefined();
        var loggedInUser = {};
        var options = {pivotTableType: 'IssueWorkedTimeByUser', groups: ["group1", "group2"]};

        var requestCalled = false;

        AP.request = function(options) {
            if (options.url.match(/search/)) {
                this.getTimeoutFunc()(function() {
                        requestCalled = true;
                        expect(options.url).toContain("jql=(worklogAuthor%20in%20membersOf(%22group1%22)%20or%20worklogAuthor%20in%20membersOf(%22group2%22))");
                        options.success(angular.copy(TimeData));
                }, 500);
            } else {
                AP.requestBak(options);
            }
        };

        pivottableService.getPivotTable(loggedInUser, options).then(function(_pivotTable) {});

        $timeout.flush();

        expect(requestCalled).toBeTruthy();
        expect(pivottableService.allIssues.length).toBe(6);
    }));
});