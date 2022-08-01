describe("controller: ProjectRepositoryController", function () {
  var $q, $scope, MockedUser, WsApi, controller;

  var initializeVariables = function () {
    inject(function (_$q_, _WsApi_) {
      $q = _$q_;

      MockedUser = new mockUser($q);

      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$rootScope_, _$window_, _ModalService_, _ProjectRepo_, _ProjectRepositoryRepo_, _RestApi_, _StorageService_, _UserService_) {
      $scope = _$rootScope_.$new();

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      controller = _$controller_("ProjectRepositoryController", {
        $scope: $scope,
        $window: _$window_,
        ModalService: _ModalService_,
        ProjectRepo: _ProjectRepo_,
        ProjectRepositoryRepo: _ProjectRepositoryRepo_,
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
    module("mock.restApi");
    module("mock.projectRepo");
    module("mock.projectRepositoryRepo");
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
    it("create create a new project repository", function () {
      var settings = {};

      delete $scope.newRepository;
      delete $scope.newRepositorySettings;

      $scope.create(dataProjectRepository1, settings);
      $scope.$digest();

      expect($scope.newRepository).toBeDefined();
      expect($scope.newRepositorySettings).toBeDefined();

      settings = {a: "A"};
      delete $scope.newRepository;
      delete $scope.newRepositorySettings;

      $scope.create(dataProjectRepository1, settings);
      $scope.$digest();

      expect($scope.newRepository).toBeDefined();
      expect($scope.newRepositorySettings).toBeDefined();
    });

    it("delete delete a project repository", function () {
      spyOn($scope, "closeModal");

      $scope.delete(dataProjectRepository1);
      $scope.$digest();

      expect($scope.closeModal).toHaveBeenCalled();
    });

    it("getProjectById return a project", function () {
      var project;

      project = $scope.getProjectById($scope.projects[0].id);
      $scope.$digest();

      expect(project).toBeDefined();

      project = $scope.getProjectById(-1);
      $scope.$digest();

      expect(project).toBe(null);
    });

    it("update change the project repository", function () {
      var projectRepository = angular.copy($scope.projectRepositories[0]);

      projectRepository.name += " updated";
      projectRepository.dirty = function () {};

      spyOn($scope, "closeModal");
      spyOn(projectRepository, "dirty");

      $scope.update(projectRepository);
      $scope.$digest();

      expect($scope.closeModal).toHaveBeenCalled();
      expect(projectRepository.dirty).toHaveBeenCalled();
    });
  });

});
