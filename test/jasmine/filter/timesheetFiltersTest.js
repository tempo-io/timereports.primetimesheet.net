describe("timesheet filters", function(){

    // wait for async loading required modules
    beforeAll(function(done) {
        require(['app/timesheetApp'], done);
    });

    beforeEach(module('timesheetApp'));

    it('prettyHours', inject(function($filter){
        var func = $filter('prettyHours');
        expect(func('123')).toBe('0.03h');
        expect(func('723600', {timeFormat: 'pretty', workingHoursPerDay: 8, workingDaysPerWeek: 5})).toBe('1m 1w 1h');
        expect(func('')).toBe('');
        expect(func(null)).toBe('');
        expect(func('wrong number')).toBe('');
    }));
});