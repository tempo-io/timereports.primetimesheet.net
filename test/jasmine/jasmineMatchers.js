var JasmineMatcherUtils = {}

JasmineMatcherUtils.getMatcherResult = function (pass, msg, notMsg) {
  return {
    pass: pass,
    message: pass ? notMsg : msg
  }
}

beforeEach(function () {
  jasmine.addMatchers({
    toContainInProperty: function () {
      return {
        compare: function (actual, expected, property) {
          var contains = false
          for (var i = 0; i < actual.length; i++) {
            if (actual[i][property] == expected) {
              contains = true
              break
            }
          }
          return JasmineMatcherUtils.getMatcherResult(
            contains,
            'At least one item of array (length=' + actual.length + ') must have property "' + property + '" with value "' + expected + '"',
            'Every item of array (length=' + actual.length + ') must have no property "' + property + '" with value "' + expected + '"')
        }
      }
    },
    toContainAll: function () {
      return {
        compare: function (actual, expected) {
          var contains = true
          var missedElement = ''
          for (var i = 0; i < expected.length; i++) {
            if ($.inArray(expected[i], actual) == -1) {
              contains = false
              missedElement = expected[i]
              break
            }
          }
          return JasmineMatcherUtils.getMatcherResult(
            contains,
            'Actual array must contain all expected items. Missing element: "' + missedElement + '"',
            "Actual array mustn't have at least one item of expected array")
        }
      }
    },
    toBeInstanceOf: function () {
      return {
        compare: function (actual, expected) {
          return JasmineMatcherUtils.getMatcherResult(
            actual instanceof expected,
            'Must be instance of ' + expected.name,
            'Must not be instance of ' + expected.name)
        }
      }
    }
  })
})
