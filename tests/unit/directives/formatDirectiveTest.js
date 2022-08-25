describe("directive: formatDirective", function () {
  var $compile, $q, $scope, MockedUser, directive, element;

  var initializeVariables = function () {
    inject(function (_$q_, _$compile_) {
      $q = _$q_;
      $compile = _$compile_;

      MockedUser = new mockUser($q);
    });
  };

  var initializeDirective = function (settings) {
    inject(function (_$httpBackend_, _$rootScope_) {
      $scope = _$rootScope_.$new();

      var attr = settings && settings.attr ? settings.attr : " ng-model";
      var body = settings && settings.body ? settings.body : "";

      element = angular.element("<format ng-model=\"model\" " + attr + ">" + body + "</format>");
      directive = $compile(element)($scope);

      $scope.$digest();
    });
  };

  beforeEach(function () {
    module("core");
    module("metadataTool");
    module("mock.user", function ($provide) {
      var User = function () {
        return MockedUser;
      };
      $provide.value("User", User);
    });
    module("mock.userService");
    module("templates");

    installPromiseMatchers();
    initializeVariables();
  });

  afterEach(function () {
    $scope.$destroy();
  });

  describe("Is the directive", function () {
    it("defined", function () {
      initializeDirective();
      expect(directive).toBeDefined();
    });
  });
});
