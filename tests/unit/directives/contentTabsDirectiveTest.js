describe("directive: contentTabs", function () {
  var $compile, $q, $scope, directive, element;

  var initializeVariables = function () {
    inject(function (_$q_, _$compile_) {
      $q = _$q_;
      $compile = _$compile_;
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

      element = angular.element("<content-tabs " + attr + ">" + body + "</content-tabs>");
      directive = $compile(element)($scope);

      $scope.$digest();
    });
  };

  beforeEach(function () {
    module("core");
    module("metadataTool");
    module("templates");

    installPromiseMatchers();
    initializeVariables();
  });

  describe("Is the directive", function () {
    it("defined", function () {
      initializeDirective();
      expect(directive).toBeDefined();
    });
  });

  describe("Does the directive", function () {
    it("work with content-viewers", function () {
      initializeDirective({ body: "<content-viewer title=\"Text\" type=\"text\"></content-viewer><content-viewer title=\"PDF\" type=\"pdf\"></content-viewer>" });
      expect(directive).toBeDefined();
    });
  });
});
