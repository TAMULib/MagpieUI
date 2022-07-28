describe("model: MetadataRepo", function () {
  var $q, $rootScope, $scope, Metadata, WsApi, repo;

  var initializeVariables = function (settings) {
    inject(function (_$q_, _$rootScope_, _Metadata_, _WsApi_) {
      $q = _$q_;
      $rootScope = _$rootScope_;

      MockedUser = new mockUser($q);

      Metadata = _Metadata_;
      WsApi = _WsApi_;
    });
  };

  var initializeRepo = function (settings) {
    inject(function ($injector, _MetadataRepo_) {
      $scope = $rootScope.$new();

      repo = _MetadataRepo_;
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
    module("mock.wsApi");
    module("templates");

    installPromiseMatchers();
    initializeVariables();
    initializeRepo();
  });
  
  afterEach(function () {
    $scope.$destroy();
  });

  describe("Is the repo", function () {
    it("defined", function () {
      expect(repo).toBeDefined();
    });
  });

  describe("Is the repo method", function () {
    var methods = [
      "export",
      "get",
      "getByStatus",
      "getHeaders",
      "unlockProject"
    ];

    var repoMethodExists = function (key) {
      return function() {
        expect(repo[key]).toBeDefined();
        expect(typeof repo[key]).toEqual("function");
      };
    };

    for (var i in methods) {
      it(methods[i] + " defined", repoMethodExists(methods[i]));
    }
  });

  describe("Do the repo methods work as expected", function () {
    it("export work as expected", function () {
      spyOn(WsApi, "fetch").and.callThrough();

      repo.export("A", "B");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
    });

    it("get work as expected", function () {
      /* TODO
      spyOn(WsApi, "fetch").and.callThrough();

      repo.get("A");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
      */
    });

    it("getByStatus work as expected", function () {
      spyOn(WsApi, "fetch").and.callThrough();

      repo.getByStatus("A");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
    });

    it("getHeaders work as expected", function () {
      spyOn(WsApi, "fetch").and.callThrough();

      repo.getHeaders("A", "B");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
    });

    it("unlockProject work as expected", function () {
      spyOn(WsApi, "fetch").and.callThrough();

      repo.unlockProject("A");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
    });
  });
});
