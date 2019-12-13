module.exports = function (config) {
  config.set({

    preprocessors: {
      "app/!(node_modules)/**/*.js": "coverage",
      "app/views/**/*.html": ["ng-html2js"]
    },

    reporters: ["progress", "coverage"],

    basePath: "./",

    files: [
      "app/config/appConfig.js",
      "app/config/apiMapping.js",

      "app/node_modules/jquery/dist/jquery.js",
      "app/node_modules/angular/angular.js",
      "app/node_modules/angular-mocks/angular-mocks.js",
      "app/node_modules/angular-route/angular-route.js",
      "app/node_modules/angular-sanitize/angular-sanitize.min.js",

      "app/node_modules/ng-table/bundles/ng-table.min.js",
      "app/node_modules/ng-csv/build/ng-csv.min.js",
      "app/node_modules/ng-file-upload/dist/ng-file-upload-shim.js",
      "app/node_modules/ng-file-upload/dist/ng-file-upload.js",

      "app/node_modules/jasmine-promise-matchers/dist/jasmine-promise-matchers.js",

      "app/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",

      "app/node_modules/openseadragon/build/openseadragon/openseadragon.min.js",

      "app/node_modules/ng-openseadragon/dist/ng-openseadragon.min.js",

      "app/node_modules/weaver-ui-core/app/config/coreConfig.js",

      "app/node_modules/weaver-ui-core/app/components/**/*.js",

      "app/node_modules/weaver-ui-core/app/core.js",

      "app/node_modules/weaver-ui-core/app/**/*.js",

      "app/node_modules/sockjs-client/dist/sockjs.min.js",
      "app/node_modules/stompjs/lib/stomp.min.js",

      "app/components/**/*.js",

      "tests/testSetup.js",

      "app/app.js",

      "app/config/runTime.js",

      "app/controllers/**/*.js",

      "app/directives/**/*.js",

      "app/filters/**/*.js",

      "app/repo/**/*.js",

      //"app/services/**/*.js",

      "app/model/**/*.js",

      "tests/core/**/*.js",

      "tests/mocks/**/*.js",

      "tests/unit/**/*.js"

    ],

    autoWatch: true,

    frameworks: ["jasmine"],

    failOnEmptyTestSuite: false,

    browsers: ["Chrome", "Firefox"],

    plugins: [
      "karma-chrome-launcher",
      "karma-coverage",
      "karma-firefox-launcher",
      "karma-jasmine",
      "karma-junit-reporter",
      "karma-ng-html2js-preprocessor"
    ],

    ngHtml2JsPreprocessor: {
      stripPrefix: "app/",
      moduleName: "templates"
    },

    coverageReporter: {
      type: "lcov",
      dir: "coverage/"
    }

  });
};
