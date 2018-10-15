describe("configurationModule", function() {

    // wait for async loading required modules
    false && beforeAll(function(done) {
        require(['app/timesheetApp'], done);
    });

    beforeEach(function() {
        module('talis.services.logging');
        module('configuration');
        inject(function($timeout, _$httpBackend_) {
            AP.$timeout = $timeout;
            $httpBackend = _$httpBackend_;
        });
    });

    afterEach(function() {
        delete AP.$timeout;
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('get configuration', function (done) {
        inject(function(configurationService, $timeout) {
            configurationService.getConfiguration({accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa'}).then(function(config) {
                expect(config['weekendType'].val).toEqual('60');
                expect(config['workingTimeInStatus'].val).toEqual({from: 9, to: 17});
                expect(config['durationType'].val).toEqual('h');
                expect(config['maxFractionDigits'].val).toEqual(2);
                expect(config['startedTimeInStatus'].val).toBe(false);
                done();
            }).catch(done.fail);
            $timeout.flush();
        });
    });

    it('get user preferences', function (done) {
        inject(function(configurationService, $timeout) {
            configurationService.getUserPreferences({accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa'}).then(function(config) {
                expect(config['weekendType'].val).toEqual('default');
                expect(config['workingTimeInStatus'].val).toBe(undefined);
                expect(config['durationType'].val).toEqual('default');
                expect(config['maxFractionDigits'].val).toBe(undefined);
                expect(config['startedTimeInStatus']).toBe(undefined);
                done();
            }).catch(done.fail);
            $timeout.flush();
        });
    });

    it('get user configuration', function (done) {
        inject(function(configurationService, $timeout) {
            configurationService.getUserConfiguration({accountId: 'aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa'}).then(function(config) {
                expect(config['weekendType'].val).toEqual('60');
                expect(config['workingTimeInStatus'].val).toEqual({ from: 9, to: 17 });
                expect(config['durationType'].val).toEqual('h');
                expect(config['maxFractionDigits'].val).toEqual(2);
                expect(config['startedTimeInStatus'].val).toBe(false);
                done();
            }).catch(done.fail);
            $timeout.flush();
        });
    });
});
