describe("model: DocumentRepo", function () {
  var $q, $rootScope, $scope, Document, WsApi, repo;

  var initializeVariables = function (settings) {
    inject(function (_$q_, _$rootScope_, _Document_, _WsApi_) {
      $q = _$q_;
      $rootScope = _$rootScope_;

      Document = _Document_;
      WsApi = _WsApi_;
    });
  };

  var initializeRepo = function (settings) {
    inject(function ($injector, _DocumentRepo_) {
      $scope = $rootScope.$new();

      repo = _DocumentRepo_;
    });
  };

  beforeEach(function () {
    module("core");
    module("metadataTool");
    module("mock.wsApi");

    initializeVariables();
    initializeRepo();
  });

  describe("Is the repo", function () {
    it("defined", function () {
      expect(repo).toBeDefined();
    });
  });

  describe("Is the repo method", function () {
    var methods = [
      "get",
      "page"
    ];

    for (var i in methods) {
      it(methods[i] + " defined", function () {
        expect(repo[methods[i]]).toBeDefined();
        expect(typeof repo[methods[i]]).toEqual("function");
      });
    }
  });

  describe("Does the repo method", function () {
    it("get work as expected", function () {
      /* TODO
      spyOn(WsApi, "fetch").and.callThrough();

      repo.get("A");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
      */
    });

    it("page work as expected", function () {
      /* TODO
      spyOn(WsApi, "fetch").and.callThrough();

      repo.page("A", "B", "C", "D", "E");
      $scope.$digest();

      expect(WsApi.fetch).toHaveBeenCalled();
      */
    });
  });
});
