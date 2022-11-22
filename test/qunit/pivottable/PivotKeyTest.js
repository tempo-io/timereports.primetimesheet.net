const { module, test, assert } = QUnit

module('pivotKey', () => {
  module('getField', () => {
    const ASSIGNEE_ID = 'assignee'
    // const REPORTER_ID = 'reporter'

    test('should return the given issue\'s field unmodified if no changes are found after worklog start time for given fieldId', () => {
      // arrange
      const fieldId = ASSIGNEE_ID
      const started = new Date()
      const issue = {
        fields: {
          [fieldId]: Mocks.users.ASSIGNEE_MOCK
        },
        changelog: {
          histories: [
            {
              ...Mocks.histories.HISTORY_MOCK,
              created: moment(started).subtract(1, 'h') // one hour before worklog start time
            }
          ]
        }
      }
      const configOptions = {}

      // act
      const field = PivotKey.getField(issue, fieldId, configOptions, started)

      // assert
      assert.deepEqual(field, Mocks.users.ASSIGNEE_MOCK)
    })

    test('should return the given issue\'s field unmodified even if changes are found after worklog start time for given fieldId if the user is not different', () => {
      // arrange
      const fieldId = ASSIGNEE_ID
      const started = new Date()
      const issue = {
        fields: {
          [fieldId]: Mocks.users.ASSIGNEE_MOCK // field assignee has the same user as history's from
        },
        changelog: {
          histories: [{ ...Mocks.histories.HISTORY_MOCK, created: moment(started).add(1, 'h') }]
        }
      }
      const configOptions = {}

      // act
      const field = PivotKey.getField(issue, fieldId, configOptions, started)

      // assert
      assert.deepEqual(field, Mocks.users.ASSIGNEE_MOCK)
    })

    test('should return the "from" of the oldest change for given fieldId as an overwrtestten field if test occurs after worklog start time', () => {
      // arrange
      const fieldId = ASSIGNEE_ID
      const started = new Date()
      const issue = {
        fields: {
          [fieldId]: Mocks.users.ASSIGNEE_MOCK_3
        },
        changelog: {
          histories: [
            {
              ...Mocks.histories.HISTORY_MOCK,
              created: moment(started).add(1, 'h') // oldest
            },
            {
              ...Mocks.histories.HISTORY_MOCK_2,
              created: moment(started).add(2, 'h')
            }
          ]
        }
      }
      const configOptions = {}

      // act
      const field = PivotKey.getField(issue, fieldId, configOptions, started)

      // assert
      assert.deepEqual(field, {
        key: Mocks.histories.HISTORY_MOCK.items[0].from,
        displayName: Mocks.histories.HISTORY_MOCK.items[0].fromString
      })
    })

    test('should return overwritten field with the value "Unassigned" for the "displayName" property if the issue was unassigned at the moment of the oldest assignee change ("from" is null)', () => {
      // arrange
      const UNASSIGNED = 'Unassigned'
      const fieldId = ASSIGNEE_ID
      const started = new Date()
      const FROM_NULL_HISTORY_ITEM_MOCK = {
        ...Mocks.historyItems.HISTORY_ITEM_MOCK,
        from: null,
        fromString: null
      }
      const issue = {
        fields: {
          [fieldId]: Mocks.users.ASSIGNEE_MOCK_3
        },
        changelog: {
          histories: [
            {
              ...Mocks.histories.HISTORY_MOCK,
              created: moment(started).add(1, 'h'), // oldest
              items: [FROM_NULL_HISTORY_ITEM_MOCK]
            },
            {
              ...Mocks.histories.HISTORY_MOCK_2,
              created: moment(started).add(2, 'h')
            }
          ]
        }
      }
      const configOptions = {}

      // act
      const field = PivotKey.getField(issue, fieldId, configOptions, started)

      // assert
      assert.deepEqual(field, {
        key: null,
        displayName: UNASSIGNED
      })
    })
  })
})
