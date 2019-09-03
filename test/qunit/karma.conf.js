module.exports = function(config){
  config.set({

    basePath : '../../',

    files : [
      'js/bower_components/jquery/dist/jquery.js',
      'js/bower_components/angular/angular.js',
      'timedata.js',
      {pattern: 'i18n/default.json', included: false},
      'js/app.js',
      'test/qunit/**/*.js'
    ],

    proxies : {
      '/i18n/': '/base/i18n/'
    },

    exclude : [
      'test/qunit/main.js'
    ],

    autoWatch : true,

    frameworks: ['qunit'],

    browsers: ['ChromeHeadless'],

    plugins : [
            'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-qunit',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
