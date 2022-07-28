describe("model: ControlledVocabularyRepo", function () {
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
    inject(function ($injector, _ControlledVocabularyRepo_) {
      $scope = $rootScope.$new();

      repo = _ControlledVocabularyRepo_;
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
});
