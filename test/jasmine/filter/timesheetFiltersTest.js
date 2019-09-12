describe('timesheet filters', function () {
  // wait for async loading required modules
  false && beforeAll(function (done) {
    require(['app/timesheetApp'], done)
  })

  beforeEach(module('timesheetApp'))

  it('prettyHours', inject(function ($filter) {
    var func = $filter('prettyHours')
    expect(func('123')).toBe((0.03).toLocaleString() + 'h')
    expect(func('723600', { timeFormat: 'pretty', workingHoursPerDay: 8, workingDaysPerWeek: 5 })).toBe('1m 1w 1h')
    expect(func('27000', { timeFormat: 'pretty', workingHoursPerDay: 7.5, workingDaysPerWeek: 5 })).toBe('1d')
    // issue#950: pretty duration for Pivot By Status (elapsed)
    expect(func('337680', { timeFormat: 'pretty', workingHoursPerDay: 7.5, workingDaysPerWeek: 5 }, /* isElapsedTime */ true)).toBe('3d 21h 48m')
    expect(func('3601', { timeFormat: 'pretty', workingHoursPerDay: 7.5, workingDaysPerWeek: 5 })).toBe('1h')
    expect(func('61', { timeFormat: 'pretty', workingHoursPerDay: 7.5, workingDaysPerWeek: 5 })).toBe('1m')
    expect(func('1', { timeFormat: 'pretty', workingHoursPerDay: 7.5, workingDaysPerWeek: 5 })).toBe('0m')
    expect(func('3600', { timeFormat: 'h', workingHoursPerDay: 7.5, workingDaysPerWeek: 5 })).toBe('1h')
    expect(func('3600', { timeFormat: 'm', workingHoursPerDay: 7.5, workingDaysPerWeek: 5 })).toBe('60m')
    expect(func('' + 3600 * 4, { timeFormat: 'd', workingHoursPerDay: 8, workingDaysPerWeek: 5 })).toBe('0.5d')
    expect(func('')).toBe('')
    expect(func(null)).toBe('')
    expect(func('wrong number')).toBe('')
  }))
})
