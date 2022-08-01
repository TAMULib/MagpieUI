describe("model: ResourceRepo", function () {
  var $q, $rootScope, $scope, WsApi, repo;

  var initializeVariables = function (settings) {
    inject(function (_$q_, _$rootScope_, _WsApi_) {
      $q = _$q_;
      $rootScope = _$rootScope_;

      MockedUser = new mockUser($q);

      WsApi = _WsApi_;
    });
  };

  var initializeRepo = function (settings) {
    inject(function ($injector, _ResourceRepo_) {
      $scope = $rootScope.$new();

      repo = _ResourceRepo_;
    });
  };

  beforeEach(function () {
    module("core");
    module("metadataTool");
    module('templates');
    module("mock.user", function ($provide) {
      var User = function () {
        return MockedUser;
      };
      $provide.value("User", User);
    });
    module("mock.userService");
    module("mock.wsApi");

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
      "getAllByProjectNameAndDocumentName"
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

  describe("Do the repo method", function () {
    it("getAllByProjectNameAndDocumentName perform an API fetch", function () {
      spyOn(WsApi, "fetch").and.callThrough();

      repo.getAllByProjectNameAndDocumentName("A", "B");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
    });
  });
});
