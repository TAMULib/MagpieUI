describe("controller: ProjectAuthorityController", function () {
  var $q, $scope, MockedUser, ProjectAuthorityRepo, WsApi, controller;

  var initializeVariables = function () {
    inject(function (_$q_, _ProjectAuthorityRepo_, _WsApi_) {
      $q = _$q_;

      MockedUser = new mockUser($q);

      ProjectAuthorityRepo = _ProjectAuthorityRepo_;
      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$rootScope_, _$window_, _ModalService_, _ProjectRepo_, _ProjectAuthorityRepo_, _RestApi_, _StorageService_, _UserService_) {
      $scope = _$rootScope_.$new();

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      controller = _$controller_("ProjectAuthorityController", {
        $scope: $scope,
        $window: _$window_,
        ModalService: _ModalService_,
        ProjectRepo: _ProjectRepo_,
        ProjectAuthorityRepo: _ProjectAuthorityRepo_,
        RestApi: _RestApi_,
        StorageService: _StorageService_,
        UserService: _UserService_,
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
    module("mock.projectRepo");
    module("mock.projectAuthority");
    module("mock.projectAuthorityRepo");
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
      "create",
      "delete",
      "getProjectById",
      "update"
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

  describe("Does the scope method", function () {
    it("create create a new authority", function () {
      var authoritySettings = {a: "A"};
      var file;

      $scope.create(dataProjectAuthority1, authoritySettings, file);
      $scope.$digest();

      expect(authoritySettings.paths).not.toBeDefined();

      authoritySettings = {};
      file = {};

      spyOn($scope, "closeModal");

      $scope.create(dataProjectAuthority1, authoritySettings, file);
      $scope.$digest();

      expect(authoritySettings.paths).toBeDefined();
      expect($scope.closeModal).toHaveBeenCalled();
    });

    it("delete delete an existing authority", function () {
      spyOn($scope, "closeModal");

      $scope.delete($scope.projectAuthorities[0]);
      $scope.$digest();

      expect($scope.closeModal).toHaveBeenCalled();
    });

    it("getProjectById return a project", function () {
      var project;

      project = $scope.getProjectById($scope.projects[0].id);

      expect(project).toBeDefined();

      project = $scope.getProjectById(-1);

      expect(project).toBe(null);
    });

    it("update change an authority", function () {
      var authority;

      authority = angular.copy($scope.projectAuthorities[0]);
      authority.something = "new";
      authority.dirty = function () {};

      spyOn(authority, "dirty");

      $scope.update(authority);

      expect(authority.dirty).toHaveBeenCalled();
    });
  });
});
