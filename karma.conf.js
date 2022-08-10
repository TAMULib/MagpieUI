module.exports = function (config) {
  config.set({

    preprocessors: {
      'app/**/*.js': 'coverage',
      'app/**/*.html': ['ng-html2js'],
    },

    reporters: ['progress', 'coverage', 'coveralls'],

    basePath: './',

    files: [
      'dist/appConfig.js',
      'app/config/apiMapping.js',

      'node_modules/jquery/dist/jquery.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'node_modules/sockjs-client/dist/sockjs.js',
      'node_modules/stompjs/lib/stomp.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-loader/angular-loader.js',
      'node_modules/angular-messages/angular-messages.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/ng-csv/build/ng-csv.js',
      'node_modules/ng-table/bundles/ng-table.js',
      'node_modules/ng-file-upload/dist/ng-file-upload-shim.js',
      'node_modules/ng-file-upload/dist/ng-file-upload.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'node_modules/openseadragon/build/openseadragon/openseadragon.js',
      'node_modules/ng-openseadragon/build/angular-openseadragon.js',
      'node_modules/jasmine-promise-matchers/dist/jasmine-promise-matchers.js',

      'node_modules/@wvr/core/app/config/coreConfig.js',
      'node_modules/@wvr/core/app/components/**/*.js',
      'node_modules/@wvr/core/app/core.js',
      'node_modules/@wvr/core/app/**/*.js',

      'tests/testSetup.js',

      'app/app.js',
      'app/config/**/*.js',
      'app/components/**/*.js',
      'app/constants/**/*.js',
      'app/controllers/**/*.js',
      'app/directives/**/*.js',
      'app/filters/**/*.js',
      'app/model/**/*.js',
      'app/repo/**/*.js',
      'app/services/**/*.js',
      'app/**/*.html',

      'tests/core/**/*.js',
      'tests/mock/**/mock*.js',
      //'tests/unit/**/*Test.js'',
      'tests/unit/controllers/adminControllerTest.js',
      'tests/unit/controllers/annotateControllerTest.js',
      'tests/unit/controllers/batchPublishControllerTest.js',
      'tests/unit/controllers/documentControllerTest.js',
      'tests/unit/controllers/exportControllerTest.js',
      'tests/unit/controllers/navigationControllerTest.js',
      'tests/unit/controllers/projectAuthorityControllerTest.js',
      'tests/unit/controllers/projectControllerTest.js',
      'tests/unit/controllers/projectRepositoryControllerTest.js',
      'tests/unit/controllers/projectSuggestorControllerTest.js',
      'tests/unit/controllers/userRepoControllerTest.js',
      'tests/unit/directives/*Test.js',
      'tests/unit/filters/*Test.js',
      'tests/unit/models/*Test.js',
      'tests/unit/repos/*Test.js',
    ],

    autoWatch: true,

    failOnEmptyTestSuite: false,

    frameworks: ['jasmine'],

    browsers: ['ChromeHeadless'],

    plugins: [
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-coveralls',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-ng-html2js-preprocessor',
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'templates',
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
    }

  });
};
