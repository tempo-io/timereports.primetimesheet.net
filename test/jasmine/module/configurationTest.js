describe("configurationModule", function() {

    // wait for async loading required modules
    beforeAll(function(done) {
        require(['app/timesheetApp'], done);
    });

    beforeEach(function() {
        module('talis.services.logging');
        module('configuration');
        inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
            configurationRequestHandler = $httpBackend.when('GET', '/api/configuration/').respond([{key: 'auditorsGroups', value: ['jira-users']}]);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('get configuration', inject(function(configurationService) {
        var promise = configurationService.getConfiguration();
        promise.then(function() {
            expect(configurationService.data.config['auditorsGroups'].key).toEqual('auditorsGroups');
            expect(configurationService.data.config['auditorsGroups'].value).toEqual(['jira-users']);
        });
    }));
});
