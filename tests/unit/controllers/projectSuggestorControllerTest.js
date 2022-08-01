describe("controller: ProjectSuggestorController", function () {
  var $q, $scope, MockedUser, WsApi, controller;

  var initializeVariables = function () {
    inject(function (_$q_, _WsApi_) {
      $q = _$q_;

      MockedUser = new mockUser($q);

      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$rootScope_, _$window_, _ModalService_, _ProjectRepo_, _ProjectSuggestorRepo_, _RestApi_, _StorageService_, _UserService_) {
      $scope = _$rootScope_.$new();

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      controller = _$controller_("ProjectSuggestorController", {
        $scope: $scope,
        $window: _$window_,
        ModalService: _ModalService_,
        ProjectRepo: _ProjectRepo_,
        ProjectSuggestorRepo: _ProjectSuggestorRepo_,
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
    module("mock.projectSuggestorRepo");
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
    it("create create a new project suggestor", function () {
      var settings = {};

      delete $scope.newSuggestor;
      delete $scope.newSuggestorSettings;

      $scope.create(dataProjectSuggestor1, settings);
      $scope.$digest();

      expect($scope.newSuggestor).toBeDefined();
      expect($scope.newSuggestorSettings).toBeDefined();

      settings = {a: "A"};
      delete $scope.newSuggestor;
      delete $scope.newSuggestorSettings;

      $scope.create(dataProjectSuggestor1, settings);
      $scope.$digest();

      expect($scope.newSuggestor).toBeDefined();
      expect($scope.newSuggestorSettings).toBeDefined();
    });

    it("delete delete a project suggestor", function () {
      spyOn($scope, "closeModal");

      $scope.delete(dataProjectSuggestor1);
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

    it("update change the project suggestor", function () {
      var projectSuggestor = angular.copy($scope.projectSuggestors[0]);

      projectSuggestor.name += " updated";
      projectSuggestor.dirty = function () {};

      spyOn($scope, "closeModal");
      spyOn(projectSuggestor, "dirty");

      $scope.update(projectSuggestor);
      $scope.$digest();

      expect($scope.closeModal).toHaveBeenCalled();
      expect(projectSuggestor.dirty).toHaveBeenCalled();
    });
  });

});
