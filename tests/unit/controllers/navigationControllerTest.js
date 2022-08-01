describe("controller: NavigationController", function () {
  var $q, $scope, $window, MockedUser, WsApi, controller;

  var initializeVariables = function () {
    inject(function (_$q_, _$window_, _WsApi_) {
      $q = _$q_;
      $window = _$window_;

      MockedUser = new mockUser($q);

      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$location_, _$rootScope_, _ModalService_, _RestApi_, _StorageService_) {
      $scope = _$rootScope_.$new();

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      controller = _$controller_("NavigationController", {
        $location: _$location_,
        $scope: $scope,
        $window: $window,
        ModalService: _ModalService_,
        RestApi: _RestApi_,
        StorageService: _StorageService_,
        WsApi: WsApi
      });

      // ensure that the isReady() is called.
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    });
  };

  beforeEach(function () {
    module("core");
    module("metadataTool");
    module('templates');
    module("mock.modalService");
    module("mock.restApi");
    module("mock.storageService");
    module("mock.user", function ($provide) {
      var User = function () {
        return MockedUser;
      };
      $provide.value("User", User);
    });
    module("mock.userService");
    module("mock.wsApi");

    installPromiseMatchers();
    initializeVariables();
    initializeController();
  });

  afterEach(function () {
    $scope.$destroy();
  });

  describe("Is the controller", function () {
    var roles = [ "ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER", "ROLE_ANONYMOUS" ];

    var controllerExists = function (setting) {
      return function() {
        initializeController(setting);
        expect(controller).toBeDefined();
      };
    };

    for (var i in roles) {
      it("defined for " + roles[i], controllerExists({ role: roles[i] }));
    }
  });

  describe("Is the scope method", function () {
    var methods = [
      "updateHeight",
      "updateWidth"
    ];

    var scopeMethodExists = function (method) {
      return function() {
        expect($scope[method]).toBeDefined();
        expect(typeof $scope[method]).toEqual("function");
      };
    };

    for (var i in methods) {
      it(methods[i] + " defined", scopeMethodExists(methods[i]));
    }
  });

  describe("Does the window method", function () {
    it("onresize call scope resize methods", function () {
      spyOn($scope, "updateWidth");
      spyOn($scope, "updateHeight");

      $window.onresize();

      expect($scope.updateWidth).toHaveBeenCalled();
      expect($scope.updateHeight).toHaveBeenCalled();
    });
  });

  describe("Does the $on method", function () {
    it("$routeChangeStart update the view", function () {
      delete $scope.view;

      $scope.$broadcast("$routeChangeStart");
      $scope.$apply();

      expect($scope.view).toBeDefined();
    });
  });

});
