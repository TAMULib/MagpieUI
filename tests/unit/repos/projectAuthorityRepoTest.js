describe("model: ProjectAuthorityRepo", function () {
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
    inject(function ($injector, _ProjectAuthorityRepo_) {
      $scope = $rootScope.$new();

      repo = _ProjectAuthorityRepo_;
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
      "uploadCsv"
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

  describe("Does the repo method", function () {
    it("uploadCsv work as expected", function () {
      /* TODO
      var file = { name: "a" };
      spyOn(WsApi, "fetch").and.callThrough();

      repo.uploadCsv(file);
      scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
      */
    });
  });
});
