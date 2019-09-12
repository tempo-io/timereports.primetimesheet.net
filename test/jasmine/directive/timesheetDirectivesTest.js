describe('timesheet directive', function () {
  var scope
  var compile

  // wait for async loading required modules
  false && beforeAll(function (done) {
    require(['app/timesheetApp'], done)
  })

  // jasmine matchers and helpers methods

  var prepareJQueryElement = function (text) {
    var formElement = angular.element(text)
    var element = compile(formElement)(scope)
    scope.$digest()
    return element
  }

  // TESTS START

  beforeEach(module('timesheetApp'))

  beforeEach(inject(function ($rootScope, $compile, $window) {
    scope = $rootScope.$new()
    compile = $compile
    $window.i18nDefault = 'i18n/default.json'
  }))

  it('context', inject(function ($httpBackend) {
    $httpBackend.when('GET', 'i18n/default.json').respond(200, {})
    prepareJQueryElement('<context items="{prop1:4,prop2:8}"/>')
    expect(scope['prop1']).toEqual(4)
    expect(scope['prop2']).toEqual(8)
  }))

  it('issueField', inject(function () {
    // TODO implement
  }))

  it('columnKey', inject(function () {
    // TODO implement
  }))

  it('issueType', inject(function () {
    // TODO implement
  }))

  it('issueKey', inject(function ($httpBackend) {
    $httpBackend.when('GET', 'i18n/default.json').respond(200, {})
    var issueKey = 'IssueKey-1'
    scope.issue = { key: issueKey }

    var element = prepareJQueryElement('<issue-key issue="issue"/>')

    expect(element).toEqual('a')
    expect(element).toContainText(issueKey)
    expect(element).toHaveClass('ng-scope')
    expect(element).toHaveClass('ng-isolate-scope')
    expect(element).toContainElement('span.ng-binding')
    expect(element).toHaveAttr('href', '/browse/' + issueKey)
    expect(element).toHaveAttr('target', '_parent')
  }))

  it('issueSummary', inject(function () {
    // TODO implement
  }))

  it('issuePriority', inject(function () {
    // TODO implement
  }))

  it('auiDatePicker', inject(function () {
    // TODO implement
  }))

  it('pivottableSlider', inject(function () {
    // TODO implement
  }))

  it('auiUserPicker', inject(function () {
    // TODO implement
  }))

  it('selectedOption', inject(function ($httpBackend) {
    $httpBackend.when('GET', 'i18n/default.json').respond(200, {
      lab: 'My label value is %s'
    })

    var closeFuncSpy = jasmine.createSpy('closeFuncSpy')

    scope.doWithOption = function (value) {
      closeFuncSpy(value)
    }

    $httpBackend.flush()

    scope.option = { label: 'lab', labelParam: 'PAR' }
    var element = prepareJQueryElement(
      '<selected-option option="option" remove-action="doWithOption(\'OPT\')"/>')

    expect(element).toContainText('My label value is PAR')
    expect(element).toContainElement('span.aui-label')

    expect(closeFuncSpy).not.toHaveBeenCalled()

    element.find('span.icon-close').click()

    expect(closeFuncSpy.calls.count()).toEqual(1)
    expect(closeFuncSpy).toHaveBeenCalledWith('OPT')
  }))
})
