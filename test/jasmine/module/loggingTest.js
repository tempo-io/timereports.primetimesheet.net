describe("loggingModule", function() {

    // wait for async loading required modules
    beforeAll(function(done) {
        require(['app/modules/logging'], done);
    });

    beforeEach(function () {
        jasmine.Ajax.install();
    });
    
    beforeEach(function() {
        module('talis.services.logging')
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('logging', inject(function(applicationLoggingService, exceptionLoggingService, $window) {
        expect(applicationLoggingService).toBeDefined();
        expect(exceptionLoggingService).toBeDefined();
        $window.loggerUrl = '/logger';
        applicationLoggingService.error('loggingTest');
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('/logger');
        delete $window.loggerUrl;
    }));
});