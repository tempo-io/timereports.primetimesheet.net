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

      '../../timedata.js',
      '../../js/app.js',
      '../../test/jasmine/**/*.js'
    ],

    exclude : [
      '../../test/jasmine/main.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
