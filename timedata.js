if (typeof module === 'object' && module.exports) {
    var window = {};
}
AJS = window.AJS || {$: window.$, progressBars: {update: function() {}, setIndeterminate: function() {}}};
// simulate running in atlassian-connect container
window.AP = {
  user: {
    getLocale: function (cb) {
      cb('en');
    }
  },
  getUser: function(callback) {
    return callback ? setTimeout(function() {
      callback({fullName: 'admin', id: 'admin', key: 'admin', accountId : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa"});
    }) : {displayName: 'Administrator', id: 'admin', key: 'admin', emailAddress: 'azhdanov@gmail.com', accountId : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa"}; // for pivottableJob
  },
  getCurrentUser: function(callback) {
    return callback ? setTimeout(function() {
      callback({"atlassianAccountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa"});
    }) : {"atlassianAccountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa"}; // for pivottableJob
  },
  getLocation: function(callback) {
      setTimeout(function() {
          callback("https://timereports.atlassian.net/timereports?project.id=10000&project.key=DEMO");
      });
  },
  context: {
      getContext: function(cb) {
          cb({});
      }
  },
  events: {
      onPublic: function() {
      }
  },
  request: function(options) {
    this.getTimeoutFunc()(function() {
      var m;
      if (options.url.match(/search/)) {
        options.success(angular.copy(TimeData));
      } else if (options.url.match(/\/user\/picker/)) {
        options.success(userPickerData);
      } else if (options.url.match(/\/user\?.*?=.*aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa/)) {
        options.success(UserAdminData);
      } else if (options.url.match(/\/myself/)) {
        options.success(UserAdminData);
      } else if (options.url.match(/\/user/)) {
        options.success(UserData);
      } else if (options.url.match(/\/filter/)) {
        options.success(FiltersData);
      } else if (options.url.match(/\/project/)) {
        options.success(ProjectsData);
      } else if (options.url.match(/\/field/)) {
        options.success(FieldsData);
      } else if (options.url.match(/\/groups\/picker/)) {
        options.success(GroupsPickerData);
      } else if (options.url.match(/\/statuscategory/)) {
          options.success(StatusCategoryData);
      } else if (options.url.match(/\/status/)) {
        options.success(StatusData);
      } else if (options.url.match(/\/properties\/configuration/)) { // hosted configuraiton
        options.success(PropertiesConfig);
      } else if (options.url.match(/\/properties\/preferences4aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa/)) { // hosted configuraiton
        options.success(PropertiesPreferences4admin);
      } else if (options.url.match(/\/configuration/)) {
        options.success(Configuration);
      } else if (options.url.match(/\/properties/)) { // hosted keys
        options.success(Properties);
      } else if (options.url.match(/\/mypermissions/)) {
        options.success({permissions: {}});
      } else if (m = options.url.match(/\/issue\/\w*-(\d+)\/worklog/)) {
          if (IssueWorklog) {
              return IssueWorklog;
          }
          var issueNumber = parseInt(m[1]);
          var result = issueNumber < 5 ? WorklogData[4 - issueNumber] : WorklogData[issueNumber - 1];
          options.success(angular.copy(result));
      } else if (m = options.url.match(/\/issue\/\w*-(\d+)/)) {
          if (Issue) {
              return Issue;
          }
          var issueNumber = parseInt(m[1]);
          var result = issueNumber < 5 ? TimeData.issues[4 - issueNumber] : TimeData.issues[issueNumber - 1];
          options.success(angular.copy(result));
      }
    }, this.$timeoutDelay);
  },
  $timeoutDelay: 0,
  resize: function() {
  },
  getTimeoutFunc: function() {
      return this.$timeout || window.setTimeout;
  },
  messages: {
        error: function() {
            console.log.apply(console, arguments);
        }
    },
    cookie: {
        read: function(name, callback) {
            callback("{}");
        }
    },
    history: {
        pushState: function(state) {
            console.log('history state: ' + state);
        }
    },
    inlineDialog: {
        hide: function() {
        }
    },
    require: function(what, callback) {
      throw new Error("Not implemented: " + what);
    }
};

var UserData = {name: 'noSuchUser', accountId: 'accountId-noSuchUser-accountId', groups: {items: [{name: 'noGroup'}]}};
var PropertiesConfig = {value: [{key: 'workingTimeInStatus', val: true},
    {key: 'startedTimeInStatus', val: false}]};
var PropertiesPreferences4admin = {};
var Configuration = {timeTrackingConfiguration: {workingHoursPerDay: 8, workingDaysPerWeek: 5, defaultUnit: 'm'}};
var Properties = {keys: [{key: 'configuration'}, {key: 'preferences4aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa'}]};
var IssueWorklog, Issue;

// https://docs.atlassian.com/jira/REST/6.2/#d2e2438
// http://localhost:2990/jira/rest/api/2/search
var TimeData = { "expand" : "schema,names",
    "issues" : [ { "expand" : "editmeta,renderedFields,transitions,changelog,operations,worklog",
        "fields" : { "aggregateprogress" : { "percent" : 100,
                "progress" : 7200,
                "total" : 7200
              },
            "aggregatetimeestimate" : 0,
            "aggregatetimeoriginalestimate" : null,
            "aggregatetimespent" : 7200,
            "assignee" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "components" : [  ],
            "created" : "2013-02-27T18:02:37.000+0100",
            "description" : null,
            "duedate" : null,
            "environment" : null,
            "fixVersions" : [  ],
            "issuelinks" : [  ],
            "issuetype" : { "description" : "A problem which impairs or prevents the functions of the product.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/bug.gif",
                "id" : "1",
                "name" : "Bug",
                "self" : "http://localhost:2990/jira/rest/api/2/issuetype/1",
                "subtask" : false
              },
            "labels" : [  ],
            "priority" : { "iconUrl" : "http://localhost:2990/jira/images/icons/priority_major.gif",
                "id" : "3",
                "name" : "Major",
                "self" : "http://localhost:2990/jira/rest/api/2/priority/3"
              },
            "progress" : { "percent" : 100,
                "progress" : 7200,
                "total" : 7200
              },
            "parent" : {"key": "TIME-3"},
            "project" : { "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10011",
                    "48x48" : "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10011"
                  },
                "id" : "10000",
                "key" : "TIME",
                "name" : "Timeship",
                "self" : "http://localhost:2990/jira/rest/api/2/project/TIME"
              },
            "reporter": {
                "timeZone": "Europe/Kiev",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "creator": {
                "timeZone": "America/Los_Angeles",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "resolution" : null,
            "resolutiondate" : null,
            "status" : { "description" : "The issue is open and ready for the assignee to start work on it.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/status_open.gif",
                "id" : "5",
                "name" : "Done",
                "self" : "http://localhost:2990/jira/rest/api/2/status/5"
              },
            "subtasks" : [  ],
            "summary" : "Mega problem",
            "timeestimate" : 0,
            "timeoriginalestimate" : null,
            "timespent" : 7200,
            "updated" : "2013-03-27T18:03:48.000+0100",
            "versions" : [  ],
            "votes" : { "hasVoted" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-4/votes",
                "votes" : 0
              },
            "watches" : { "isWatching" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-4/watchers",
                "watchCount" : 0
              },
            "workratio" : -1
          },
        "id" : "10003",
        "key" : "TIME-4",
        "self" : "http://localhost:2990/jira/rest/api/2/issue/10003",
        "worklog" : { "maxResults" : 2,
            "startAt" : 0,
            "total" : 3,
            "worklogs" : [ { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 1",
                  "created" : "2013-12-05T00:00:00.000+0100",
                  "id" : "10000",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10003/worklog/10000",
                  "started" : "2014-02-24T18:03:48.589+0100",
                  "timeSpent" : "1h",
                  "timeSpentSeconds" : 3600,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2013-02-27T18:03:48.589+0100"
                },
                { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 2",
                  "created" : "2013-02-25T00:00:00.000+0100",
                  "id" : "10001",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10003/worklog/10001",
                  "started" : "2014-02-25T18:03:48.762+0100",
                  "timeSpent" : "1h",
                  "timeSpentSeconds" : 3600,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2013-02-27T18:03:48.762+0100"
                }
              ]
          },
          "changelog":{
                "startAt":0,
                "maxResults":4,
                "total":4,
                "histories":[
                   {
                      "id":"10010",
                      "author":{
                         "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=admin",
                         "name":"admin",
                         "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                         "emailAddress":"azhdanov@gmail.com",
                         "avatarUrls":{
                            "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                            "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                            "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                            "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                         },
                         "displayName":"Administrator",
                         "active":true,
                         "timeZone":"Europe/Belgrade"
                      },
                      "created":"2017-04-05T07:44:09.382+0200",
                      "items":[
                         {
                            "field":"status",
                            "fieldtype":"jira",
                            "from":"1",
                            "fromString":"Open",
                            "to":"3",
                            "toString":"In Progress"
                         },
                         {
                             "field":"timeestimate",
                             "fieldtype":"jira",
                             "from":null,
                             "to":"7200"
                         }
                      ]
                   },
                   {
                      "id":"10011",
                      "author":{
                         "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=admin",
                         "name":"admin",
                         "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                         "emailAddress":"azhdanov@gmail.com",
                         "avatarUrls":{
                            "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                            "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                            "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                            "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                         },
                         "displayName":"Administrator",
                         "active":true,
                         "timeZone":"Europe/Belgrade"
                      },
                      "created":"2017-04-07T11:54:03.382+0200",
                      "items":[
                         {
                            "field":"status",
                            "fieldtype":"jira",
                            "from":"3",
                            "fromString":"In Progress",
                            "to":"4",
                            "toString":"Testing"
                         },
                         {
                            "field":"timespent",
                            "fieldtype":"jira",
                            "from":"0",
                            "to":"7200"
                         },
                         {
                            "field": "timeestimate",
                            "fieldtype": "jira",
                            "from": "7200",
                            "to": "3600"
                         }
                      ]
                   },
                   {
                      "id":"10012",
                      "author":{
                         "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=admin",
                         "name":"admin",
                         "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                         "emailAddress":"azhdanov@gmail.com",
                         "avatarUrls":{
                            "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                            "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                            "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                            "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                         },
                         "displayName":"Administrator",
                         "active":true,
                         "timeZone":"Europe/Belgrade"
                      },
                      "created":"2017-04-10T11:04:23.382+0200",
                      "items":[
                         {
                            "field":"status",
                            "fieldtype":"jira",
                            "from":"4",
                            "fromString":"Testing",
                            "to":"5",
                            "toString":"Done"
                         },
                         {
                            "field":"timespent",
                            "fieldtype":"jira",
                            "from":"7200",
                            "to":"3600"
                         }
                      ]
                   },
                   {
                      "id":"10013",
                      "author":{
                         "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=admin",
                         "name":"admin",
                         "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                         "emailAddress":"azhdanov@gmail.com",
                         "avatarUrls":{
                            "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                            "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                            "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                            "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                         },
                         "displayName":"Administrator",
                         "active":true,
                         "timeZone":"Europe/Belgrade"
                      },
                      "created":"2017-04-10T15:04:23.382+0200",
                      "items":[
                         {
                             "field": "timeestimate",
                             "fieldtype": "jira",
                             "from": "3600",
                             "to": "0"
                         },
                         {
                             "field":"timespent",
                             "fieldtype":"jira",
                             "from":"3600",
                             "to":"7200"
                          }
                      ]
                   }

                ]
             }
      },
      { "expand" : "editmeta,renderedFields,transitions,changelog,operations,worklog",
        "fields" : { "aggregateprogress" : { "percent" : 100,
                "progress" : 36000,
                "total" : 36000
              },
            "aggregatetimeestimate" : 0,
            "aggregatetimeoriginalestimate" : null,
            "aggregatetimespent" : 36000,
            "assignee" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "components" : [  ],
            "customfield_10007" : "TIME-2",
            "created" : "2013-02-27T18:02:37.000+0100",
            "description" : null,
            "duedate" : null,
            "environment" : null,
            "fixVersions" : [  ],
            "issuelinks" : [  ],
            "issuetype" : { "description" : "A problem which impairs or prevents the functions of the product.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/bug.gif",
                "id" : "1",
                "name" : "Bug",
                "self" : "http://localhost:2990/jira/rest/api/2/issuetype/1",
                "subtask" : false
              },
            "labels" : [  ],
            "priority" : { "iconUrl" : "http://localhost:2990/jira/images/icons/priority_high.gif",
                "id" : "2",
                "name" : "High",
                "self" : "http://localhost:2990/jira/rest/api/2/priority/2"
              },
            "progress" : { "percent" : 100,
                "progress" : 36000,
                "total" : 36000
              },
            "project" : { "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10011",
                    "48x48" : "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10011"
                  },
                "id" : "10000",
                "key" : "TIME",
                "name" : "Timeship",
                "self" : "http://localhost:2990/jira/rest/api/2/project/TIME"
              },
            "reporter": {
                "timeZone": "Europe/Kiev",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "creator": {
                "timeZone": "America/Los_Angeles",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "resolution" : null,
            "resolutiondate" : null,
            "status" : { "description" : "The issue is open and ready for the assignee to start work on it.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/status_open.gif",
                "id" : "3",
                "name" : "In Progress",
                "self" : "http://localhost:2990/jira/rest/api/2/status/3"
              },
            "subtasks" : [  ],
            "summary" : "Hindenbug",
            "timeestimate" : 0,
            "timeoriginalestimate" : 72000,
            "timespent" : 36000,
            "updated" : "2013-02-27T18:03:49.000+0100",
            "versions" : [  ],
            "votes" : { "hasVoted" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-3/votes",
                "votes" : 0
              },
            "watches" : { "isWatching" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-3/watchers",
                "watchCount" : 0
              },
            "workratio" : -1
          },
        "id" : "10002",
        "key" : "TIME-3",
        "self" : "http://localhost:2990/jira/rest/api/2/issue/10002",
        "worklog" : { "maxResults" : 2,
            "startAt" : 0,
            "total" : 2,
            "worklogs" : [ { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 3",
                  "created" : "2013-02-27T18:03:48.891+0100",
                  "id" : "10002",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10002/worklog/10002",
                  "started" : "2014-02-28T00:00:00.000+0100",
                  "timeSpent" : "6h",
                  "timeSpentSeconds" : 21600,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2013-02-27T18:03:48.891+0100"
                },
                { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 4",
                  "created" : "2013-12-02T00:00:00.000+0100",
                  "id" : "10003",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10002/worklog/10003",
                  "started" : "2014-02-24T23:03:49.037+0000",
                  "timeSpent" : "4h",
                  "timeSpentSeconds" : 14400,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2013-02-27T18:03:49.037+0100"
                }
              ]
          }
      },
      { "expand" : "editmeta,renderedFields,transitions,changelog,operations,worklog",
        "fields" : { "aggregateprogress" : { "percent" : 100,
                "progress" : 46800,
                "total" : 46800
              },
            "aggregatetimeestimate" : 0,
            "aggregatetimeoriginalestimate" : null,
            "aggregatetimespent" : 46800,
            "assignee" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "components" : [  ],
            "customfield_10008" : "Test Epic",
            "created" : "2013-02-27T18:02:37.000+0100",
            "description" : null,
            "duedate" : null,
            "environment" : null,
            "fixVersions" : [  ],
            "issuelinks" : [ {
                "type": {
                  "name": "Duplicate"
                },
                "outwardIssue": {
                  "key": "TIME-1"
                }
              } ],
            "issuetype" : { "description" : "A problem which impairs or prevents the functions of the product.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/bug.gif",
                "id" : "1",
                "name" : "Bug",
                "self" : "http://localhost:2990/jira/rest/api/2/issuetype/1",
                "subtask" : false
              },
            "labels" : [  ],
            "priority" : { "iconUrl" : "http://localhost:2990/jira/images/icons/priority_major.gif",
                "id" : "3",
                "name" : "Major",
                "self" : "http://localhost:2990/jira/rest/api/2/priority/3"
              },
            "progress" : { "percent" : 100,
                "progress" : 46800,
                "total" : 46800
              },
            "project" : { "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10011",
                    "48x48" : "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10011"
                  },
                "id" : "10000",
                "key" : "TIME",
                "name" : "Timeship",
                "self" : "http://localhost:2990/jira/rest/api/2/project/TIME"
              },
            "reporter": {
                "timeZone": "Europe/Kiev",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "creator": {
                "timeZone": "America/Los_Angeles",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "resolution" : null,
            "resolutiondate" : null,
            "status" : { "description" : "The issue is open and ready for the assignee to start work on it.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/status_open.gif",
                "id" : "1",
                "name" : "Open",
                "self" : "http://localhost:2990/jira/rest/api/2/status/1"
              },
            "subtasks" : [  ],
            "summary" : "Loch Ness Monster Bug",
            "timeestimate" : 0,
            "timeoriginalestimate" : 93600,
            "timespent" : 46800,
            "updated" : "2013-02-27T18:03:49.000+0100",
            "versions" : [  ],
            "votes" : { "hasVoted" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-2/votes",
                "votes" : 0
              },
            "watches" : { "isWatching" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-2/watchers",
                "watchCount" : 0
              },
            "workratio" : -1
          },
        "id" : "10001",
        "key" : "TIME-2",
        "self" : "http://localhost:2990/jira/rest/api/2/issue/10001",
        "worklog" : { "maxResults" : 2,
            "startAt" : 0,
            "total" : 2,
            "worklogs" : [ { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 5 #tag5",
                  "created" : "2013-02-17T00:00:00.000+0100",
                  "id" : "10004",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10001/worklog/10004",
                  "started" : "2014-02-25T18:03:49.225+0100",
                  "timeSpent" : "5h",
                  "timeSpentSeconds" : 18000,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2013-02-27T18:03:49.225+0100"
                },
                { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 6",
                  "created" : "2013-02-26T00:00:00.000+0100",
                  "id" : "10005",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10001/worklog/10005",
                  "started" : "2014-02-27T18:05:49.376+0100",
                  "timeSpent" : "1d",
                  "timeSpentSeconds" : 28800,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2013-02-27T18:03:49.376+0100"
                }
              ]
          }
      },
      { "expand" : "editmeta,renderedFields,transitions,changelog,operations,worklog",
        "fields" : { "aggregateprogress" : { "percent" : 100,
                "progress" : 39600,
                "total" : 39600
              },
            "aggregatetimeestimate" : 0,
            "aggregatetimeoriginalestimate" : null,
            "aggregatetimespent" : 39600,
            "assignee" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "components" : [  ],
            "created" : "2013-02-27T18:02:37.000+0100",
            "description" : null,
            "duedate" : null,
            "environment" : null,
            "fixVersions" : [  ],
            "issuelinks" : [ {
                "type": {
                  "name": "Duplicate"
                },
                "inwardIssue": {
                  "key": "TIME-2"
                }
              } ],
            "issuetype" : { "description" : "A problem which impairs or prevents the functions of the product.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/bug.gif",
                "id" : "1",
                "name" : "Bug",
                "self" : "http://localhost:2990/jira/rest/api/2/issuetype/1",
                "subtask" : false
              },
            "labels" : [ ],
            "priority" : { "iconUrl" : "http://localhost:2990/jira/images/icons/priority_major.gif",
                "id" : "3",
                "name" : "Major",
                "self" : "http://localhost:2990/jira/rest/api/2/priority/3"
              },
            "progress" : { "percent" : 100,
                "progress" : 39600,
                "total" : 39600
              },
            "project" : { "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10011",
                    "48x48" : "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10011"
                  },
                "id" : "10000",
                "key" : "TIME",
                "name" : "Timeship",
                "self" : "http://localhost:2990/jira/rest/api/2/project/TIME"
              },
            "reporter": {
                "timeZone": "Europe/Kiev",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "creator": {
                "timeZone": "America/Los_Angeles",
                "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "resolution" : null,
            "resolutiondate" : null,
            "status" : { "description" : "The issue is open and ready for the assignee to start work on it.",
                "iconUrl" : "http://localhost:2990/jira/images/icons/status_open.gif",
                "id" : "1",
                "name" : "Open",
                "self" : "http://localhost:2990/jira/rest/api/2/status/1"
              },
            "subtasks" : [  ],
            "summary" : "Hocus Focus Problem",
            "timeestimate" : 118800,
            "timeoriginalestimate" : null,
            "timespent" : 39600,
            "updated" : "2013-02-27T18:03:49.000+0100",
            "versions" : [  ],
            "votes" : { "hasVoted" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-1/votes",
                "votes" : 0
              },
            "watches" : { "isWatching" : false,
                "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-1/watchers",
                "watchCount" : 0
              },
            "workratio" : -1
          },
        "id" : "10000",
        "key" : "TIME-1",
        "self" : "http://localhost:2990/jira/rest/api/2/issue/10000",
        "worklog" : { "maxResults" : 2,
            "startAt" : 0,
            "total" : 2,
            "worklogs" : [ { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 7",
                  "created" : "2013-02-18T00:00:00.000+0100",
                  "id" : "10006",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10000/worklog/10006",
                  "started" : "2014-02-25T18:03:49.536+0100",
                  "timeSpent" : "3h",
                  "timeSpentSeconds" : 10800,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2014-01-27T18:03:49.536+0100"
                },
                { "author" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "timeZone": "Europe/Moscow",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "comment" : "test 8 #tag8",
                  "created" : "2013-02-27T18:03:49.685+0100",
                  "id" : "10007",
                  "self" : "http://localhost:2990/jira/rest/api/2/issue/10000/worklog/10007",
                  "started" : "2014-02-24T00:00:00.000+0100",
                  "timeSpent" : "1d",
                  "timeSpentSeconds" : 28800,
                  "updateAuthor" : { "active" : true,
                      "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                          "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                      "displayName" : "admin",
                      "emailAddress" : "admin@example.com",
                      "name" : "admin",
                      "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                      "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                  "updated" : "2013-02-27T18:03:49.685+0100"
                }
              ]
          }
      },
        { "expand" : "editmeta,renderedFields,transitions,changelog,operations,worklog",
            "fields" : { "aggregateprogress" : { "percent" : 100,
                "progress" : 36000,
                "total" : 36000
            },
                "aggregatetimeestimate" : 0,
                "aggregatetimeoriginalestimate" : null,
                "aggregatetimespent" : 36000,
                "assignee" : { "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                "components" : [  ],
                "customfield_10007" : "",
                "customfield_10004" : 2.0,
                "created" : "2013-02-27T18:02:37.000+0100",
                "description" : null,
                "duedate" : null,
                "environment" : null,
                "fixVersions" : [  ],
                "issuelinks" : [  ],
                "issuetype" : { "description" : "A problem which impairs or prevents the functions of the product.",
                    "iconUrl" : "http://localhost:2990/jira/images/icons/bug.gif",
                    "id" : "1",
                    "name" : "Bug",
                    "self" : "http://localhost:2990/jira/rest/api/2/issuetype/1",
                    "subtask" : false
                },
                "labels" : [  ],
                "priority" : { "iconUrl" : "http://localhost:2990/jira/images/icons/priority_major.gif",
                    "id" : "3",
                    "name" : "Major",
                    "self" : "http://localhost:2990/jira/rest/api/2/priority/3"
                },
                "progress" : { "percent" : 100,
                    "progress" : 36000,
                    "total" : 36000
                },
                "project" : { "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10011",
                    "48x48" : "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10011"
                },
                    "id" : "10000",
                    "key" : "TIME",
                    "name" : "Timeship",
                    "self" : "http://localhost:2990/jira/rest/api/2/project/TIME"
                },
                "reporter": {
                    "timeZone": "Europe/Kiev",
                    "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                "creator": {
                    "timeZone": "America/Los_Angeles",
                    "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                "resolution" : null,
                "resolutiondate" : null,
                "status" : { "description" : "The issue is open and ready for the assignee to start work on it.",
                    "iconUrl" : "http://localhost:2990/jira/images/icons/status_open.gif",
                    "id" : "3",
                    "name" : "In Progress",
                    "self" : "http://localhost:2990/jira/rest/api/2/status/3"
                },
                "subtasks" : [  ],
                "summary" : "Hindenbug",
                "timeestimate" : 0,
                "timeoriginalestimate" : 100000,
                "timespent" : 36000,
                "updated" : "2013-02-27T18:03:49.000+0100",
                "versions" : [  ],
                "votes" : { "hasVoted" : false,
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-5/votes",
                    "votes" : 0
                },
                "watches" : { "isWatching" : false,
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-5/watchers",
                    "watchCount" : 0
                },
                "workratio" : -1
            },
            "id" : "10004",
            "key" : "TIME-5",
            "self" : "http://localhost:2990/jira/rest/api/2/issue/10002",
            "worklog" : { "maxResults" : 2,
                "startAt" : 0,
                "total" : 2,
                "worklogs" : [ { "author" : { "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "timeZone": "Europe/Moscow",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                    "comment" : "test 3",
                    "created" : "2014-10-20T18:03:48.891+0100",
                    "id" : "10002",
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/10002/worklog/10002",
                    "started" : "2014-02-28T09:00:00.000+0100",
                    "timeSpent" : "5h",
                    "timeSpentSeconds" : 18000,
                    "updateAuthor" : { "active" : true,
                        "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                            "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                        "displayName" : "admin",
                        "emailAddress" : "admin@example.com",
                        "name" : "admin",
                        "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                        "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                    "updated" : "2014-10-20T13:03:48.891+0100"
                },
                { "author" : { "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "timeZone": "Europe/Moscow",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                    "comment" : "test 4",
                    "created" : "2014-10-20T18:03:48.891+0100",
                    "id" : "10002",
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/10002/worklog/10002",
                    "started" : "2014-02-27T09:00:00.000+0100",
                    "timeSpent" : "5h",
                    "timeSpentSeconds" : 18000,
                    "updateAuthor" : { "active" : true,
                        "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                            "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                        "displayName" : "admin",
                        "emailAddress" : "admin@example.com",
                        "name" : "admin",
                        "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                        "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                    "updated" : "2014-10-20T13:03:48.891+0100"
                }
                ]
            }
        },
        { "expand" : "editmeta,renderedFields,transitions,changelog,operations,worklog",
            "fields" : { "aggregateprogress" : { "percent" : 100,
                "progress" : 7200,
                "total" : 7200
            },
                "aggregatetimeestimate" : 0,
                "aggregatetimeoriginalestimate" : null,
                "aggregatetimespent" : 7200,
                "assignee" : { "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                "components" : [  ],
                "created" : "2013-02-27T18:02:37.000+0100",
                "description" : null,
                "duedate" : null,
                "environment" : null,
                "fixVersions" : [  ],
                "issuelinks" : [  ],
                "issuetype" : { "description" : "A problem which impairs or prevents the functions of the product.",
                    "iconUrl" : "http://localhost:2990/jira/images/icons/bug.gif",
                    "id" : "1",
                    "name" : "Bug",
                    "self" : "http://localhost:2990/jira/rest/api/2/issuetype/1",
                    "subtask" : false
                },
                "labels" : [  ],
                "priority" : { "iconUrl" : "http://localhost:2990/jira/images/icons/priority_major.gif",
                    "id" : "3",
                    "name" : "Major",
                    "self" : "http://localhost:2990/jira/rest/api/2/priority/3"
                },
                "progress" : { "percent" : 100,
                    "progress" : 7200,
                    "total" : 7200
                },
                "parent" : {"key": "TIME-5"},
                "project" : { "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10011",
                    "48x48" : "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10011"
                },
                    "id" : "10000",
                    "key" : "TIME",
                    "name" : "Timeship",
                    "self" : "http://localhost:2990/jira/rest/api/2/project/TIME"
                },
                "reporter": {
                    "timeZone": "Europe/Kiev",
                    "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                "creator": {
                    "timeZone": "America/Los_Angeles",
                    "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                "resolution" : null,
                "resolutiondate" : null,
                "status" : { "description" : "The issue is open and ready for the assignee to start work on it.",
                    "iconUrl" : "http://localhost:2990/jira/images/icons/status_open.gif",
                    "id" : "1",
                    "name" : "Open",
                    "self" : "http://localhost:2990/jira/rest/api/2/status/1"
                },
                "subtasks" : [  ],
                "summary" : "Mega problem",
                "timeestimate" : 0,
                "timeoriginalestimate" : null,
                "timespent" : 7200,
                "updated" : "2013-03-27T18:03:48.000+0100",
                "versions" : [  ],
                "votes" : { "hasVoted" : false,
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-6/votes",
                    "votes" : 0
                },
                "watches" : { "isWatching" : false,
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/TIME-6/watchers",
                    "watchCount" : 0
                },
                "workratio" : -1
            },
            "id" : "10005",
            "key" : "TIME-6",
            "self" : "http://localhost:2990/jira/rest/api/2/issue/10003",
            "worklog" : { "maxResults" : 2,
                "startAt" : 0,
                "total" : 2,
                "worklogs" : [ { "author" : { "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "timeZone": "Europe/Moscow",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                    "comment" : "test 1",
                    "created" : "2014-10-00T08:00:00.000+0100",
                    "id" : "10000",
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/10003/worklog/10000",
                    "started" : "2014-02-28T18:03:48.589+0100",
                    "timeSpent" : "1h",
                    "timeSpentSeconds" : 3600,
                    "updateAuthor" : { "active" : true,
                        "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                            "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                        "displayName" : "admin",
                        "emailAddress" : "admin@example.com",
                        "name" : "admin",
                        "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                        "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                    "updated" : "2014-10-20T18:03:48.589+0100"
                },
                { "author" : { "active" : true,
                    "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                        "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                    },
                    "displayName" : "admin",
                    "emailAddress" : "admin@example.com",
                    "name" : "admin",
                    "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                    "timeZone": "Europe/Moscow",
                    "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                },
                    "comment" : "test 2",
                    "created" : "2014-10-00T08:00:00.000+0100",
                    "id" : "10000",
                    "self" : "http://localhost:2990/jira/rest/api/2/issue/10003/worklog/10000",
                    "started" : "2014-02-28T18:03:48.589+0100",
                    "timeSpent" : "1h",
                    "timeSpentSeconds" : 3600,
                    "updateAuthor" : { "active" : true,
                        "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                            "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                        },
                        "displayName" : "admin",
                        "emailAddress" : "admin@example.com",
                        "name" : "admin",
                        "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                        "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
                    },
                    "updated" : "2014-10-20T18:03:48.589+0100"
                }
                ]
            },
            "changelog":{
                "startAt":0,
                "maxResults":2,
                "total":2,
                "histories":[
                    {
                        "id":"10010",
                        "author":{
                            "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=admin",
                            "name":"admin",
                            "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                            "emailAddress":"azhdanov@gmail.com",
                            "avatarUrls":{
                                "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                                "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                                "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                                "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                            },
                            "displayName":"Administrator",
                            "active":true,
                            "timeZone":"Europe/Belgrade"
                        },
                        "created":"2013-12-04T14:39:40.382+0200",
                        "items":[
                            {
                                "field":"status",
                                "fieldtype":"jira",
                                "from":"1",
                                "fromString":"Open",
                                "to":"3",
                                "toString":"In Progress"
                            },
                            {
                                "field":"assignee",
                                "fieldtype":"jira",
                                "from":null,
                                "fromString":null,
                                "to":"admin",
                                "toString":"Administrator"
                            },
                            {
                                "field":"timespent",
                                "fieldtype":"jira",
                                "from":"0",
                                "to":"3600"
                            }
                        ]
                    },
                    {
                        "id":"10011",
                        "author":{
                            "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=admin",
                            "name":"admin",
                            "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                            "emailAddress":"azhdanov@gmail.com",
                            "avatarUrls":{
                                "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                                "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                                "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                                "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                            },
                            "displayName":"Administrator",
                            "active":true,
                            "timeZone":"Europe/Belgrade"
                        },
                        "created":"2013-12-05T14:39:40.382+0200",
                        "items":[
                            {
                                "field":"timespent",
                                "fieldtype":"jira",
                                "from":"3600",
                                "to":"7200"
                            }
                        ]
                    }
                ]
            }
        }
    ],
  "maxResults" : 50,
  "startAt" : 0,
  "total" : 6,
  "names":{"customfield_10007": "Epic Link"}
};
var TimeDataTIME_7 = {
    "expand": "editmeta,renderedFields,transitions,changelog,operations,worklog",
    "fields": {
        "aggregateprogress": {
            "percent": 100,
            "progress": 3600,
            "total": 3600
        },
        "aggregatetimeestimate": 0,
        "aggregatetimeoriginalestimate": null,
        "aggregatetimespent": 3600,
        "assignee": {
            "active": true,
            "avatarUrls": {
                "16x16": "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                "48x48": "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
            },
            "displayName": "user",
            "emailAddress": "user@example.com",
            "name": "user",
            "self": "http://localhost:2990/jira/rest/api/2/user?username=user"
        },
        "components": [],
        "customfield_10007": "",
        "customfield_10004": 2.0,
        "creator": {
            "self": "https://avelytchenko.atlassian.net/rest/api/2/user?username=user",
            "name": "user",
            "key": "user",
            "emailAddress": "user@ukr.net",
            "avatarUrls": {
                "48x48": "https://avatar-cdn.atlassian.com/bea67933ceee0576c2dd9381176590ff?s=48&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2Fbea67933ceee0576c2dd9381176590ff%3Fd%3Dmm%26s%3D48%26noRedirect%3Dtrue",
                "24x24": "https://avatar-cdn.atlassian.com/bea67933ceee0576c2dd9381176590ff?s=24&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2Fbea67933ceee0576c2dd9381176590ff%3Fd%3Dmm%26s%3D24%26noRedirect%3Dtrue",
                "16x16": "https://avatar-cdn.atlassian.com/bea67933ceee0576c2dd9381176590ff?s=16&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2Fbea67933ceee0576c2dd9381176590ff%3Fd%3Dmm%26s%3D16%26noRedirect%3Dtrue",
                "32x32": "https://avatar-cdn.atlassian.com/bea67933ceee0576c2dd9381176590ff?s=32&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2Fbea67933ceee0576c2dd9381176590ff%3Fd%3Dmm%26s%3D32%26noRedirect%3Dtrue"
            },
            "displayName": "user",
            "active": true,
            "timeZone": "America/Los_Angeles"
        },
        "created": "2017-04-05T06:44:09.382+0200",
        "description": null,
        "duedate": null,
        "environment": null,
        "fixVersions": [],
        "issuelinks": [],
        "issuetype": {
            "description": "A problem which impairs or prevents the functions of the product.",
            "iconUrl": "http://localhost:2990/jira/images/icons/bug.gif",
            "id": "1",
            "name": "Bug",
            "self": "http://localhost:2990/jira/rest/api/2/issuetype/1",
            "subtask": false
        },
        "labels": [],
        "priority": {
            "iconUrl": "http://localhost:2990/jira/images/icons/priority_major.gif",
            "id": "3",
            "name": "Major",
            "self": "http://localhost:2990/jira/rest/api/2/priority/3"
        },
        "progress": {
            "percent": 100,
            "progress": 3600,
            "total": 3600
        },
        "project": {
            "avatarUrls": {
                "16x16": "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10011",
                "48x48": "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10011"
            },
            "id": "10000",
            "key": "TIME",
            "name": "Timeship",
            "self": "http://localhost:2990/jira/rest/api/2/project/TIME"
        },
        "reporter": {
            "timeZone": "Europe/Kiev",
            "active": true,
            "avatarUrls": {
                "16x16": "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                "48x48": "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
            },
            "displayName": "user",
            "emailAddress": "user@example.com",
            "name": "user",
            "self": "http://localhost:2990/jira/rest/api/2/user?username=user"
        },
        "resolution": null,
        "resolutiondate": null,
        "status": {
            "description": "The issue is open and ready for the assignee to start work on it.",
            "iconUrl": "http://localhost:2990/jira/images/icons/status_open.gif",
            "id": "3",
            "name": "In Progress",
            "self": "http://localhost:2990/jira/rest/api/2/status/3"
        },
        "subtasks": [],
        "summary": "Hindenbug",
        "timeestimate": 3600,
        "timeoriginalestimate": 7200,
        "timespent": 3600,
        "updated": "2013-02-27T18:03:49.000+0100",
        "versions": [],
        "votes": {
            "hasVoted": false,
            "self": "http://localhost:2990/jira/rest/api/2/issue/TIME-7/votes",
            "votes": 0
        },
        "watches": {
            "isWatching": false,
            "self": "http://localhost:2990/jira/rest/api/2/issue/TIME-7/watchers",
            "watchCount": 0
        },
        "workratio": -1
    },
    "id": "10007",
    "key": "TIME-7",
    "self": "http://localhost:2990/jira/rest/api/2/issue/10007",
    "worklog": {
        "maxResults": 1,
        "startAt": 0,
        "total": 1,
        "worklogs": [{
            "author": {
                "active": true,
                "avatarUrls": {
                    "16x16": "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48": "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                },
                "displayName": "user",
                "emailAddress": "user@example.com",
                "name": "user",
                "timeZone": "Europe/Moscow",
                "self": "http://localhost:2990/jira/rest/api/2/user?username=user"
            },
            "comment": "test 3",
            "created": "2014-02-24T18:03:49.225+0100",
            "id": "10008",
            "self": "http://localhost:2990/jira/rest/api/2/issue/10007/worklog/10008",
            "started": "2014-02-24T18:03:49.225+0100",
            "timeSpent": "1h",
            "timeSpentSeconds": 3600,
            "updateAuthor": {
                "active": true,
                "avatarUrls": {
                    "16x16": "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48": "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                },
                "displayName": "user",
                "emailAddress": "user@example.com",
                "name": "user",
                "self": "http://localhost:2990/jira/rest/api/2/user?username=user"
            },
            "updated": "2014-02-24T18:03:49.225+0100"
        }
        ]
    },
    "changelog":{
        "startAt":0,
        "maxResults":3,
        "total":3,
        "histories":[
            {
                "id":"10010",
                "author":{
                    "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=user",
                    "name":"user",
                    "emailAddress":"user@gmail.com",
                    "avatarUrls":{
                        "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                        "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                        "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                        "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                    },
                    "displayName":"user",
                    "active":true,
                    "timeZone":"Europe/Belgrade"
                },
                "created":"2017-04-05T07:44:09.382+0200",
                "items":[
                    {
                        "field":"status",
                        "fieldtype":"jira",
                        "from":"1",
                        "fromString":"Open",
                        "to":"3",
                        "toString":"In Progress"
                    },
                    {
                        "field":"timeestimate",
                        "fieldtype":"jira",
                        "from":null,
                        "to":"7200"
                    },
                    {
                        "field":"timeoriginalestimate",
                        "fieldtype":"jira",
                        "from":null,
                        "to":"7200"
                    }
                ]
            },
            {
                "id":"10011",
                "author":{
                    "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=user",
                    "name":"user",
                    "emailAddress":"user@gmail.com",
                    "avatarUrls":{
                        "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                        "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                        "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                        "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                    },
                    "displayName":"user",
                    "active":true,
                    "timeZone":"Europe/Belgrade"
                },
                "created":"2017-04-07T11:54:03.382+0200",
                "items":[
                    {
                        "field":"status",
                        "fieldtype":"jira",
                        "from":"3",
                        "fromString":"In Progress",
                        "to":"4",
                        "toString":"Testing"
                    },
                    {
                        "field":"timespent",
                        "fieldtype":"jira",
                        "from":"0",
                        "to":"7200"
                    },
                    {
                        "field": "timeestimate",
                        "fieldtype": "jira",
                        "from": "7200",
                        "to": "3600"
                    }
                ]
            },
            {
                "id":"10012",
                "author":{
                    "self":"https://timesheet-report-dev.jira-dev.com/rest/api/2/user?username=user",
                    "name":"user",
                    "emailAddress":"user@gmail.com",
                    "avatarUrls":{
                        "48x48":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=48",
                        "24x24":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=24",
                        "16x16":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=16",
                        "32x32":"https://secure.gravatar.com/avatar/0e6d4fc0601c429541b57e0cd8dc84ec?d=mm&s=32"
                    },
                    "displayName":"user",
                    "active":true,
                    "timeZone":"Europe/Belgrade"
                },
                "created":"2017-04-10T11:04:23.382+0200",
                "items":[
                    {
                        "field":"status",
                        "fieldtype":"jira",
                        "from":"4",
                        "fromString":"Testing",
                        "to":"5",
                        "toString":"Done"
                    },
                    {
                        "field":"timespent",
                        "fieldtype":"jira",
                        "from":"7200",
                        "to":"3600"
                    }
                ]
            }

        ]
    }
};

var WorklogData = [
  // TIME-4
  { "maxResults" : 3,
      "startAt" : 0,
      "total" : 3,
      "worklogs" : [ { "author" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "timeZone": "Europe/Moscow",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "comment" : "test 1",
            "created" : "2013-12-05T00:00:00.000+0100",
            "id" : "10000",
            "self" : "http://localhost:2990/jira/rest/api/2/issue/10003/worklog/10000",
            "started" : "2014-02-24T18:03:48.589+0100",
            "timeSpent" : "1h",
            "timeSpentSeconds" : 3600,
            "updateAuthor" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "updated" : "2013-02-27T18:03:48.589+0100"
          },
          { "author" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "timeZone": "Europe/Moscow",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "comment" : "test 2",
            "created" : "2013-02-25T00:00:00.000+0100",
            "id" : "10001",
            "self" : "http://localhost:2990/jira/rest/api/2/issue/10003/worklog/10001",
            "started" : "2014-02-25T18:03:48.762+0100",
            "timeSpent" : "1h",
            "timeSpentSeconds" : 3600,
            "updateAuthor" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "updated" : "2013-02-27T18:03:48.762+0100"
          },
          { "author" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "timeZone": "Europe/Moscow",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "comment" : "test 2",
            "created" : "2013-02-25T00:00:00.000+0100",
            "id" : "10001",
            "self" : "http://localhost:2990/jira/rest/api/2/issue/10003/worklog/10001",
            "started" : "2014-02-26T18:03:48.762+0100",
            "timeSpent" : "1h",
            "timeSpentSeconds" : 3600,
            "updateAuthor" : { "active" : true,
                "avatarUrls" : { "16x16" : "http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
                    "48x48" : "http://localhost:2990/jira/secure/useravatar?avatarId=10122"
                  },
                "displayName" : "admin",
                "emailAddress" : "admin@example.com",
                "name" : "admin",
                "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
                "self" : "http://localhost:2990/jira/rest/api/2/user?username=admin"
              },
            "updated" : "2013-02-27T18:03:48.762+0100"
          }
        ]
    }
];
// https://docs.atlassian.com/jira/REST/6.2/#d2e3764
// http://localhost:2990/jira/rest/api/2/user?username=admin
var UserAdminData = {
   "self":"http://localhost:2990/jira/rest/api/2/user?username=admin",
   "key":"admin",
   "name":"admin",
   "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
   "emailAddress":"admin@example.com",
   "avatarUrls":{
      "16x16":"http://localhost:2990/jira/secure/useravatar?size=xsmall&avatarId=10122",
      "24x24":"http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
      "32x32":"http://localhost:2990/jira/secure/useravatar?size=medium&avatarId=10122",
      "48x48":"http://localhost:2990/jira/secure/useravatar?avatarId=10122"
   },
   "displayName":"admin",
   "active":true,
   "timeZone":"Europe/Moscow",
   "groups":{
      "size":3,
      "items":[
        {
          "name":"jira-administrators",
          "self":"http://localhost:2990/jira/rest/api/2/group?groupname=jira-administrators"
        }, {
          "name":"jira-developers",
          "self":"http://localhost:2990/jira/rest/api/2/group?groupname=jira-developers"
        }, {
          "name":"jira-users",
          "self":"http://localhost:2990/jira/rest/api/2/group?groupname=jira-users"
        }
      ]
   },
   "expand":"groups"
};
// https://docs.atlassian.com/jira/REST/6.2/#d2e1283
// http://localhost:2990/jira/rest/api/2/filter/favourite
var FiltersData = [
   {
      "self":"http://localhost:2990/jira/rest/api/latest/filter/10000",
      "id":"10000",
      "name":"All issues",
      "owner":{
         "self":"http://localhost:2990/jira/rest/api/2/user?username=admin",
         "key":"admin",
         "name":"admin",
         "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
         "avatarUrls":{
            "16x16":"http://localhost:2990/jira/secure/useravatar?size=xsmall&avatarId=10122",
            "24x24":"http://localhost:2990/jira/secure/useravatar?size=small&avatarId=10122",
            "32x32":"http://localhost:2990/jira/secure/useravatar?size=medium&avatarId=10122",
            "48x48":"http://localhost:2990/jira/secure/useravatar?avatarId=10122"
         },
         "displayName":"admin",
         "active":true
      },
      "jql":"project = DEMO ORDER BY key ASC",
      "viewUrl":"http://localhost:2990/jira/secure/IssueNavigator.jspa?mode=hide&requestId=10000",
      "searchUrl":"http://localhost:2990/jira/rest/api/latest/search?jql=project+%3D+DEMO+ORDER+BY+key+ASC",
      "favourite":true,
      "sharePermissions":[

      ],
      "sharedUsers":{
         "size":0,
         "items":[

         ],
         "max-results":1000,
         "start-index":0,
         "end-index":0
      },
      "subscriptions":{
         "size":0,
         "items":[

         ],
         "max-results":1000,
         "start-index":0,
         "end-index":0
      }
   }
];
var ProjectsData = [
    {
        avatarUrls: {
            "16x16": "http://localhost:2990/jira/secure/projectavatar?size=xsmall&pid=10000&avatarId=10400",
            "24x24": "http://localhost:2990/jira/secure/projectavatar?size=small&pid=10000&avatarId=10400",
            "32x32": "http://localhost:2990/jira/secure/projectavatar?size=medium&pid=10000&avatarId=10400",
            "48x48": "http://localhost:2990/jira/secure/projectavatar?pid=10000&avatarId=10400"
        },
        expand: "description,lead,url,projectKeys",
        id: "10000",
        key: "DEMO",
        name: "Demonstration Project",
        self: "http://localhost:2990/jira/rest/api/2/project/10000"
    }
];
// https://docs.atlassian.com/jira/REST/6.2/#d2e131
// http://localhost:2990/jira/rest/api/latest/field
var FieldsData=[
   {
      "id":"progress",
      "name":"Progress",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "progress"
      ],
      "schema":{
         "type":"progress",
         "system":"progress"
      }
   },
   {
      "id":"summary",
      "name":"Summary",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "summary"
      ],
      "schema":{
         "type":"string",
         "system":"summary"
      }
   },
   {
      "id":"timetracking",
      "name":"Time Tracking",
      "custom":false,
      "orderable":true,
      "navigable":false,
      "searchable":true,
      "clauseNames":[

      ],
      "schema":{
         "type":"timetracking",
         "system":"timetracking"
      }
   },
   {
      "id":"issuekey",
      "name":"Key",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "id",
         "issue",
         "issuekey",
         "key"
      ]
   },
   {
      "id":"issuetype",
      "name":"Issue Type",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "issuetype",
         "type"
      ],
      "schema":{
         "type":"issuetype",
         "system":"issuetype"
      }
   },
   {
      "id":"votes",
      "name":"Votes",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "votes"
      ],
      "schema":{
         "type":"array",
         "items":"votes",
         "system":"votes"
      }
   },
   {
      "id":"security",
      "name":"Security Level",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "level"
      ],
      "schema":{
         "type":"securitylevel",
         "system":"security"
      }
   },
   {
      "id":"fixVersions",
      "name":"Fix Version/s",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "fixVersion"
      ],
      "schema":{
         "type":"array",
         "items":"version",
         "system":"fixVersions"
      }
   },
   {
      "id":"resolution",
      "name":"Resolution",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "resolution"
      ],
      "schema":{
         "type":"resolution",
         "system":"resolution"
      }
   },
   {
      "id":"resolutiondate",
      "name":"Resolved",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "resolutiondate",
         "resolved"
      ],
      "schema":{
         "type":"datetime",
         "system":"resolutiondate"
      }
   },
   {
      "id":"timespent",
      "name":"Time Spent",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "timespent"
      ],
      "schema":{
         "type":"number",
         "system":"timespent"
      }
   },
   {
      "id":"creator",
      "name":"Creator",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "creator"
      ],
      "schema":{
         "type":"user",
         "system":"creator"
      }
   },
   {
      "id":"reporter",
      "name":"Reporter",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "reporter"
      ],
      "schema":{
         "type":"user",
         "system":"reporter"
      }
   },
   {
      "id":"aggregatetimeoriginalestimate",
      "name":"Σ Original Estimate",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[

      ],
      "schema":{
         "type":"number",
         "system":"aggregatetimeoriginalestimate"
      }
   },
   {
      "id":"updated",
      "name":"Updated",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "updated",
         "updatedDate"
      ],
      "schema":{
         "type":"datetime",
         "system":"updated"
      }
   },
   {
      "id":"created",
      "name":"Created",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "created",
         "createdDate"
      ],
      "schema":{
         "type":"datetime",
         "system":"created"
      }
   },
   {
      "id":"description",
      "name":"Description",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "description"
      ],
      "schema":{
         "type":"string",
         "system":"description"
      }
   },
   {
      "id":"priority",
      "name":"Priority",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "priority"
      ],
      "schema":{
         "type":"priority",
         "system":"priority"
      }
   },
   {
      "id":"duedate",
      "name":"Due Date",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "due",
         "duedate"
      ],
      "schema":{
         "type":"date",
         "system":"duedate"
      }
   },
   {
      "id":"issuelinks",
      "name":"Linked Issues",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[

      ],
      "schema":{
         "type":"array",
         "items":"issuelinks",
         "system":"issuelinks"
      }
   },
   {
      "id":"watches",
      "name":"Watchers",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "watchers"
      ],
      "schema":{
         "type":"array",
         "items":"watches",
         "system":"watches"
      }
   },
   {
      "id":"worklog",
      "name":"Log Work",
      "custom":false,
      "orderable":true,
      "navigable":false,
      "searchable":true,
      "clauseNames":[

      ],
      "schema":{
         "type":"array",
         "items":"worklog",
         "system":"worklog"
      }
   },
   {
      "id":"subtasks",
      "name":"Sub-Tasks",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "subtasks"
      ],
      "schema":{
         "type":"array",
         "items":"issuelinks",
         "system":"subtasks"
      }
   },
   {
      "id":"status",
      "name":"Status",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "status"
      ],
      "schema":{
         "type":"status",
         "system":"status"
      }
   },
   {
      "id":"labels",
      "name":"Labels",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "labels"
      ],
      "schema":{
         "type":"array",
         "items":"string",
         "system":"labels"
      }
   },
   {
      "id":"assignee",
      "name":"Assignee",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "assignee"
      ],
      "schema":{
         "type":"user",
         "system":"assignee"
      }
   },
   {
      "id":"workratio",
      "name":"Work Ratio",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "workratio"
      ],
      "schema":{
         "type":"number",
         "system":"workratio"
      }
   },
   {
      "id":"attachment",
      "name":"Attachment",
      "custom":false,
      "orderable":true,
      "navigable":false,
      "searchable":true,
      "clauseNames":[
         "attachments"
      ],
      "schema":{
         "type":"array",
         "items":"attachment",
         "system":"attachment"
      }
   },
   {
      "id":"aggregatetimeestimate",
      "name":"Σ Remaining Estimate",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[

      ],
      "schema":{
         "type":"number",
         "system":"aggregatetimeestimate"
      }
   },
   {
      "id":"versions",
      "name":"Affects Version/s",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "affectedVersion"
      ],
      "schema":{
         "type":"array",
         "items":"version",
         "system":"versions"
      }
   },
   {
      "id":"project",
      "name":"Project",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "project"
      ],
      "schema":{
         "type":"project",
         "system":"project"
      }
   },
   {
      "id":"environment",
      "name":"Environment",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "environment"
      ],
      "schema":{
         "type":"string",
         "system":"environment"
      }
   },
   {
      "id":"thumbnail",
      "name":"Images",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[

      ]
   },
   {
      "id":"timeestimate",
      "name":"Remaining Estimate",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "remainingEstimate",
         "timeestimate"
      ],
      "schema":{
         "type":"number",
         "system":"timeestimate"
      }
   },
   {
      "id":"aggregateprogress",
      "name":"Σ Progress",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[

      ],
      "schema":{
         "type":"progress",
         "system":"aggregateprogress"
      }
   },
   {
      "id":"lastViewed",
      "name":"Last Viewed",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "lastViewed"
      ],
      "schema":{
         "type":"datetime",
         "system":"lastViewed"
      }
   },
   {
      "id":"components",
      "name":"Component/s",
      "custom":false,
      "orderable":true,
      "navigable":true,
      "searchable":true,
      "clauseNames":[
         "component"
      ],
      "schema":{
         "type":"array",
         "items":"component",
         "system":"components"
      }
   },
   {
      "id":"comment",
      "name":"Comment",
      "custom":false,
      "orderable":true,
      "navigable":false,
      "searchable":true,
      "clauseNames":[
         "comment"
      ],
      "schema":{
         "type":"array",
         "items":"comment",
         "system":"comment"
      }
   },
   {
      "id":"timeoriginalestimate",
      "name":"Original Estimate",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[
         "originalEstimate",
         "timeoriginalestimate"
      ],
      "schema":{
         "type":"number",
         "system":"timeoriginalestimate"
      }
   },
   {
      "id":"aggregatetimespent",
      "name":"Σ Time Spent",
      "custom":false,
      "orderable":false,
      "navigable":true,
      "searchable":false,
      "clauseNames":[

      ],
      "schema":{
         "type":"number",
         "system":"aggregatetimespent"
      }
   },
   {
     "id": "customfield_10003",
     "name": "Epic/Theme",
     "custom": true,
     "orderable": true,
     "navigable": true,
     "searchable": true,
     "clauseNames": [
       "cf[10003]",
       "Epic/Theme"
     ],
     "schema": {
       "type": "array",
       "items": "string",
       "custom": "com.atlassian.jira.plugin.system.customfieldtypes:labels",
       "customId": 10003
     }
   },
   {
     "id": "customfield_10004",
     "name": "Story Points",
     "custom": true,
     "orderable": true,
     "navigable": true,
     "searchable": true,
     "clauseNames": [
       "cf[10004]",
       "Story Points"
     ],
     "schema": {
       "type": "number",
       "custom": "com.atlassian.jira.plugin.system.customfieldtypes:float",
       "customId": 10004
     }
   },
   {
     "id": "customfield_10007",
     "name": "Epic Link",
     "custom": true,
     "orderable": true,
     "navigable": true,
     "searchable": true,
     "clauseNames": [
       "cf[10007]",
       "Epic Link"
     ],
     "schema": {
       "type": "array",
       "items": "string",
       "custom": "com.pyxis.greenhopper.jira:gh-epic-link",
       "customId": 10005
     }
   },
   {
     "id": "customfield_10008",
     "name": "Epic Name",
     "custom": true,
     "orderable": true,
     "navigable": true,
     "searchable": true,
     "clauseNames": [
       "cf[10008]",
       "Epic Name"
     ],
     "schema": {
       "type": "string",
       "custom": "com.pyxis.greenhopper.jira:gh-epic-label",
       "customId": 10008
     }
   }
];
// https://docs.atlassian.com/software/jira/docs/api/REST/6.2/#d2e3922
// http://localhost:2990/jira/rest/api/2/userpicker?query=a
var userPickerData = {
   "users":[
      {
         "name":"admin",
         "accountId" : "aaaa:aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaaa",
         "key":"admin",
         "html":"<strong>a</strong>dmin - <strong>a</strong>dmin@example.com (<strong>a</strong>dmin)",
         "displayName":"admin"
      }
   ],
   "total":1,
   "header":"Showing 1 of 1 matching users"
};

var GroupsPickerData = {
    groups: [{name: "atlassian-addons", html: "atlassian-addons"}, {name: "jira-users", html: "jira-users"}],
    header: "Showing 2 of 2 matching groups",
    total: 2
};

var StatusData = [
  {
    self: "https://timereports.atlassian.net/rest/api/2/status/3",
    description:
      "This issue is being actively worked on at the moment by the assignee.",
    iconUrl:
      "https://timereports.atlassian.net/images/icons/statuses/inprogress.png",
    name: "In Progress",
    id: "3",
    statusCategory: {
      self: "https://timereports.atlassian.net/rest/api/2/statuscategory/4",
      id: 4,
      key: "indeterminate",
      colorName: "yellow",
      name: "In Progress"
    }
  },
  {
    self: "https://timereports.atlassian.net/rest/api/2/status/10000",
    description: "",
    iconUrl: "https://timereports.atlassian.net/",
    name: "To Do",
    id: "10000",
    statusCategory: {
      self: "https://timereports.atlassian.net/rest/api/2/statuscategory/2",
      id: 2,
      key: "new",
      colorName: "blue-gray",
      name: "To Do"
    }
  },
  {
    self: "https://timereports.atlassian.net/rest/api/2/status/10001",
    description: "",
    iconUrl: "https://timereports.atlassian.net/",
    name: "Done",
    id: "10001",
    statusCategory: {
      self: "https://timereports.atlassian.net/rest/api/2/statuscategory/3",
      id: 3,
      key: "done",
      colorName: "green",
      name: "Done"
    }
  }
];

var StatusCategoryData = [
    {
        "self": "https://timereports.atlassian.net/rest/api/2/statuscategory/1",
        "id": 1,
        "key": "undefined",
        "colorName": "medium-gray",
        "name": "No Category"
    },
    {
        "self": "https://timereports.atlassian.net/rest/api/2/statuscategory/2",
        "id": 2,
        "key": "new",
        "colorName": "blue-gray",
        "name": "To Do"
    },
    {
        "self": "https://timereports.atlassian.net/rest/api/2/statuscategory/4",
        "id": 4,
        "key": "indeterminate",
        "colorName": "yellow",
        "name": "In Progress"
    },
    {
        "self": "https://timereports.atlassian.net/rest/api/2/statuscategory/3",
        "id": 3,
        "key": "done",
        "colorName": "green",
        "name": "Done"
    }
];

var TimeStatuses = {
    1: {order: 1, categoryId: "2"},
    3: {order: 3, categoryId: "4"},
    4: {order: 4, categoryId: "4"},
    5: {order: 5, categoryId: "3"},
    10000: {order: 6, categoryId: "2"},
    10001: {order: 7, categoryId: "3"}
};

var translations = {};
jQuery.getJSON('../../i18n/default.json', function (data) {
    angular.extend(translations, data);
});

var processFlightData = function() {
    var params;
    var hasRest = false;
    var skipRest = false;
    for (var i = 0; i < FLIGHT_RECORDER_DATA.length; i++) {
        var item = FLIGHT_RECORDER_DATA[i];
        if (item.action == 'parameters') {
            if (hasRest) {
                skipRest = true;
                console.log('Parameters were changed. IGNORED.');
            } else {
                params = item.params;
            }
        }  else if (skipRest) {
            console.log('SKIPPING: ' + item.request.url);
        } else if (item.action == 'rest') {
            hasRest = true;
            var itemData = item.response || item.error;
            if (item.request.url.match(/search/)) {
                TimeData = itemData;
            } else if (item.request.url.match(/\/user\/picker/)) {
                userPickerData = itemData;
            } else if (item.request.url.match(/\/user\?.*?=admin/)) {
                UserAdminData = itemData;
            } else if (item.request.url.match(/\/user/)) {
                UserData = itemData;
            } else if (item.request.url.match(/\/filter/)) {
                FiltersData = itemData;
            } else if (item.request.url.match(/\/project/)) {
                ProjectsData = itemData;
            } else if (item.request.url.match(/\/field/)) {
                FieldsData = itemData;
            } else if (item.request.url.match(/\/groups\/picker/)) {
                GroupsPickerData = itemData;
            } else if (item.request.url.match(/\/properties\/configuration/)) { // hosted configuraiton
                PropertiesConfig = itemData;
            } else if (item.request.url.match(/\/properties/)) { // hosted keys
                Properties = itemData;
            } else if (item.request.url.match(/\/issue\/.*\/worklog/)) {
                IssueWorklog = itemData;
            } else if (item.request.url.match(/\/issue\/.*/)) {
                Issue = itemData;
            }
        }
    }
    if (params) {
        document.location.href =
            document.location.href.split('?')[0] + '?' + $.param(params);
    }
};

//$.getScript("/flightRecorderData.js", processFlightData);

if (typeof module === 'object' && module.exports) {
    module.exports = {
        TimeData: TimeData,
        UserAdminData: UserAdminData,
        ProjectsData: ProjectsData,
        FieldsData: FieldsData,
        WorklogData: WorklogData,
        Configuration:Configuration,
        Properties:Properties,
        PropertiesConfig:PropertiesConfig,
        PropertiesPreferences4admin:PropertiesPreferences4admin
    };
}
