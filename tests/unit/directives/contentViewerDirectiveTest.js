describe("directive: contentViewer", function () {
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

      var attr = settings && settings.attr ? settings.attr : "";
      var body = settings && settings.body ? settings.body : "";
      var viewers = settings && settings.viewers ? settings.viewers : ["default", "image", "pdf", "seadragon", "text"];

      for (var i in viewers) {
        _$httpBackend_.whenGET("views/directives/viewers/" + i + "Viewer.html").respond("<div></div>");
      }

      element = angular.element("<contentviewer " + attr + ">" + body + "</contentviewer>");
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

  describe("Does the directive", function () {
    it("work with default", function () {
      initializeDirective({ attr: "title=\"Default\" type=\"default\"" });
      expect(directive).toBeDefined();
    });

    it("work with image", function () {
      initializeDirective({ attr: "title=\"Image\" type=\"image\"" });
      expect(directive).toBeDefined();
    });

    it("work with seadragon", function () {
      initializeDirective({ attr: "title=\"Seadragon\" type=\"seadragon\"" });
      expect(directive).toBeDefined();
    });

    it("work with text", function () {
      initializeDirective({ attr: "title=\"Text\" type=\"text\"" });
      expect(directive).toBeDefined();
    });
  });
});
