describe("timesheetControllerTest", function() {

    // wait for async loading required modules
    beforeAll(function(done) {
        require(['app/controllers/timesheetController', 'app/services/pivottableService'], done);
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
            },
            toHaveColumnsNumber: function() {
                return {
                    compare: function (actual, expected) {
                        var rowsCount = Object.keys(actual.totals).length;
                        return JasmineMatcherUtils.getMatcherResult(
                                rowsCount == expected,
                                "PivotTable must have " + expected + " columns",
                                "PivotTable mustn't have " + expected + " columns");
                    }
                };
            }
        });
    });
    
    var getFirstColumnKey = function(pivotTable) {
        var totalKeys = Object.keys(pivotTable.totals);
        return pivotTable.totals[totalKeys[0]].columnKey;
    };

    var getFirstRowKey = function(pivotTable) {
        var rowKeys = Object.keys(pivotTable.rows);
        return pivotTable.rows[rowKeys[0]].rowKey;
    };

    var checkOptions = function(scope) {
        expect(scope.groupByOptions).not.toBeNull();
        expect(scope.groupByOptions).toBeInstanceOf(TimesheetSelectOptions);
        expect(scope.groupByOptions.options.length).toBe(scope.pivotTableType == 'TimeTracking' ? 38 : 39);
        expect(scope.groupByOptions.options).toContainInProperty('Security Level', 'label');
        expect(scope.groupByOptions.options).toContainInProperty('resolution', 'id');
        expect(scope.filterByOptions).not.toBeNull();
        expect(scope.filterByOptions).toBeInstanceOf(TimesheetSelectOptions);
        expect(scope.filterByOptions.options.length).toBe(2);
        expect(scope.filterByOptions.options).toContainInProperty('All issues', 'label');
        expect(scope.filterByOptions.options).toContainInProperty('Demonstration Project', 'label');
        expect(scope.filterByOptions.options).toContainInProperty('filter_10000', 'id');
        expect(scope.filterByOptions.options).toContainInProperty('project_DEMO', 'id');
    };

    // TESTS START

    beforeEach(function() {
        module('talis.services.logging');
        module('configuration');
        module('timesheetApp');
        inject(function($timeout, $window, _$httpBackend_) {
            AP.$timeout = $timeout;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/templates/main.html').respond('');
            $window.i18nDefault = 'i18n/default.json';
            $httpBackend.when("GET", 'i18n/default.json').respond({});
        });
        AP.requestBak = AP.request;
    });
    
    afterEach(function() {
        delete AP.$timeout;
        AP.request = AP.requestBak;
    });

    it('default (no params)', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(0);
        expect(scope.pivotTable).toHaveColumnsNumber(7);
        expect(scope.pivotTable.sum).toBe(0);
        expect(scope.rowKeySize).toBe(1);
        checkOptions(scope);
    }));

    it('default (no params) [sumSubTasks]', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {sumSubTasks: true},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            configurationService: {
                getConfiguration: function () {
                    var deferred = $q.defer();
                    deferred.resolve({
                        compositionIssueLink: {},
                        parentIssueField: {},
                        auditorsGroups: {}
                    });
                    return deferred.promise;
                }
            },
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(0);
        expect(scope.pivotTable).toHaveColumnsNumber(7);
        expect(scope.pivotTable.sum).toBe(0);
        expect(scope.rowKeySize).toBe(1);
        checkOptions(scope);
    }));

    it('PARAMETERS: startDate', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {startDate: '2014-02-24'},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(6);
        expect(scope.pivotTable).toHaveColumnsNumber(7);
        expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4', 'TIME-5', 'TIME-6']);
        expect(scope.pivotTable.sum).toBe(176400);
        expect(scope.rowKeySize).toBe(5);
        checkOptions(scope);
    }));

    it('PARAMETERS: startDate, endDate', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {startDate: '2014-02-24', endDate: '2014-02-25'},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(4);
        expect(scope.pivotTable).toHaveColumnsNumber(2);
        expect(getFirstColumnKey(scope.pivotTable).keyName).toEqual('dayOfTheWeek');
        expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4']);
        expect(Object.keys(scope.pivotTable.rows)).not.toContainAll(['TIME-5', 'TIME-6']);
        expect(scope.pivotTable.sum).toBe(79200);
        expect(scope.rowKeySize).toBe(5);
        checkOptions(scope);
    }));

    it('PARAMETERS: monthView', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {startDate: '2014-02-24', endDate: '2014-02-25', view: 'month'},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(4);
        expect(scope.pivotTable).toHaveColumnsNumber(1);
        expect(getFirstColumnKey(scope.pivotTable).keyName).toEqual('weekOfTheYear');
        expect(Object.keys(scope.pivotTable.rows)).toContainAll(['TIME-1', 'TIME-2', 'TIME-3', 'TIME-4']);
        expect(scope.pivotTable.sum).toBe(79200);
        expect(scope.rowKeySize).toBe(5);
        checkOptions(scope);
    }));

    it('PARAMETERS: groupByField', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {startDate: '2014-02-24', endDate: '2014-02-25', groupByField: 'created'},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(1);
        expect(getFirstRowKey(scope.pivotTable).keyName).toEqual("created");
        expect(scope.pivotTable).toHaveColumnsNumber(2);
        expect(scope.pivotTable.sum).toBe(79200);
        expect(scope.rowKeySize).toBe(5);
        checkOptions(scope);
    }));

    it('PARAMETERS: pivotTableType=IssueWorkedTimeByUser', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {pivotTableType: 'IssueWorkedTimeByUser', startDate: null, endDate: null},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(6);
        expect(scope.pivotTable).toHaveColumnsNumber(1);
        var totalColumn = getFirstColumnKey(scope.pivotTable);
        expect(totalColumn.keyName).toEqual('user');
        expect(totalColumn.keyValue).toEqual('admin');
        expect(scope.pivotTable.sum).toBe(176400);
        expect(scope.rowKeySize).toBe(5);
        checkOptions(scope);
    }));

    it('PARAMETERS: pivotTableType=TimeTracking', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {pivotTableType: 'TimeTracking'},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(6);
        expect(scope.pivotTable).toHaveColumnsNumber(5);
        var totalColumn = getFirstColumnKey(scope.pivotTable);
        expect(totalColumn.keyName).toEqual('PlannedVsActual');
        expect(totalColumn.keyValue).toEqual('1timeoriginalestimate');
        expect(scope.pivotTable.sum).toBe(265600);
        expect(scope.rowKeySize).toBe(5);
        checkOptions(scope);
    }));

    it('PARAMETERS: user=noSuchUser', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {startDate: '2014-02-24', user: 'noSuchUser'},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(0);
        expect(scope.pivotTable).toHaveColumnsNumber(7);
        var totalColumn = getFirstColumnKey(scope.pivotTable);
        expect(totalColumn.keyName).toEqual('dayOfTheWeek');
        console.error('Expect \'' + totalColumn.keyValue + '\' to equal \'' + 1393192800000 + '\'');
        //expect(totalColumn.keyValue).toEqual(1393192800000);
        expect(scope.pivotTable.sum).toBe(0);
        expect(scope.rowKeySize).toBe(1);
        checkOptions(scope);
    }));

    it('cache configuration', inject(function($controller, configurationService, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {

        var configCalled = false;
        AP.request = function(options) {
            configCalled = options.url.match(/properties\/configuration/);
        };
        configurationService.getConfiguration();
        $timeout.flush();
        expect(configCalled).toBeTruthy();
        configCalled = false;
        configurationService.getConfiguration();
        //$timeout.flush();
        expect(configCalled).toBeFalsy();
        configurationService.resetState();
        configurationService.getConfiguration();
        $timeout.flush();
        expect(configCalled).toBeTruthy();
    }));

    it('PARAMETERS: group', inject(function($controller, pivottableService, $route, $location, $sce, $rootScope, $q, $timeout) {
        var scope = $rootScope.$new();
        $controller('TimesheetController', {
            $scope: scope,
            $route: $route,
            $routeParams: {user: 'admin', group: ['group1', 'group2']},
            $location: $location,
            $sce: $sce,
            pivottableService: pivottableService,
            loggedInUser: {},
            projectKey: 'DEMO'
        });

        $timeout.flush();
        expect(scope.loading).toBeDefined();
        $httpBackend.flush();

        expect(scope.TimesheetUtils).not.toBeNull();
        expect(scope.loading).toBeFalsy();
        expect(scope.pivotTable).not.toBeNull();
        expect(scope.pivotTable.pivotStrategy).not.toBeNull();
        expect(scope.pivotTable).toHaveRowsNumber(0);
        expect(scope.pivotTable).toHaveColumnsNumber(7);
        expect(scope.pivotTable.sum).toBe(0);
        expect(scope.rowKeySize).toBe(1);
        expect(scope.group).toEqual(['group1', 'group2']);
        checkOptions(scope);
    }));
});