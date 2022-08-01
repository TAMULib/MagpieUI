describe("directive: inputDirective", function () {
  var $compile, $q, $scope, MockedUser, directive, element, field;

  var initializeVariables = function () {
    inject(function (_$q_, _$compile_) {
      $q = _$q_;
      $compile = _$compile_;

      field = new mockMetadataFieldLabel($q);
      field.label = new mockMetadataFieldLabel($q);
      field.value = new mockMetadataFieldValue($q);
      MockedUser = new mockUser($q);
    });
  };

  var initializeDirective = function (settings) {
    inject(function (_$httpBackend_, _$rootScope_) {
      $scope = _$rootScope_.$new();
      $scope.field = angular.copy(field);

      var attr = settings && settings.attr ? settings.attr : "";
      var body = settings && settings.body ? settings.body : "";

      _$httpBackend_.whenGET("views/directives/input.html").respond("<input></input>");

      element = angular.element("<metadatainput ng-model=\"model\" " + attr + ">" + body + "</metadatainput>");
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
