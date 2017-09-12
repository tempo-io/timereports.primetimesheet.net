module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      '../../js/bower_components/jquery/dist/jquery.js',
      '../../js/bower_components/angular/angular.js',
      '../../js/bower_components/angular-route/angular-route.js',
      '../../js/bower_components/angular-mocks/angular-mocks.js',

      '../../js/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      '../../js/bower_components/jasmine-ajax/lib/mock-ajax.js',

      '../../js/lib/zef-angularjs-i18n/localization.js',
      '../../js/bower_components/sprintf/src/sprintf.js',
      '../../js/bower_components/moment/moment.js',
      '../../timedata.js',
      '../../js/app.js',
      '../../test/jasmine/**/*.js'
    ],

    exclude : [
      '../../test/jasmine/main.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Firefox'],

    plugins : [
            //'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
