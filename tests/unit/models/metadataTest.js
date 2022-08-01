describe("model: Metadata", function () {
  var $q, $rootScope, $scope, MockedUser, WsApi, model;

  var initializeVariables = function (settings) {
    inject(function (_$q_, _$rootScope_, _WsApi_) {
      $q = _$q_;
      $rootScope = _$rootScope_;

      MockedUser = new mockUser($q);

      WsApi = _WsApi_;
    });
  };

  var initializeModel = function (settings) {
    inject(function (_Metadata_) {
      $scope = $rootScope.$new();

      model = angular.extend(new _Metadata_(), dataMetadata1);

      // ensure that the isReady() is called.
      if (!$scope.$$phase) {
        $scope.$digest();
      }
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
    initializeModel();
  });
  
  afterEach(function () {
    $scope.$destroy();
  });

  describe("Is the model", function () {
    it("defined", function () {
      expect(model).toBeDefined();
    });
  });
});
