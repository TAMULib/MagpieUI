describe("filter: logTypeClass", function () {
  var $scope, filter;

  var initializeVariables = function () {
  };

  var initializeFilter = function (settings) {
    inject(function (_$filter_, _$rootScope_) {
      $scope = _$rootScope_.$new();

      filter = _$filter_("logTypeClass");
    });
  };

  beforeEach(function () {
    module("core");
    module("metadataTool");
    module("templates");

    installPromiseMatchers();
    initializeVariables();
    initializeFilter();
  });
  
  afterEach(function () {
    $scope.$destroy();
  });

  describe("Is the filter", function () {
    it("defined", function () {
      expect(filter).toBeDefined();
    });
  });

  describe("Does the filter", function () {
    it("return nothing on empty input", function () {
      var result;

      result = filter("");
      expect(result).toBe("");
    });

    it("return nothing on unknown input", function () {
      var result;

      result = filter("xxshould never exist xx");
      expect(result).toBe("");
    });

    it("return class name on valid input", function () {
      var result;
      var type = "ATTACHMENT";

      result = filter(type);
      expect(result).toBe("log-type-" + type.toLowerCase());

      type = "ALERT";
      result = filter(type);
      expect(result).toContain("log-type-" + type.toLowerCase());

      type = "WARNING";
      result = filter(type);
      expect(result).toContain("log-type-" + type.toLowerCase());
    });
  });
});
