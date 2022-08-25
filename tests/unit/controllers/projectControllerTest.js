describe("controller: ProjectController", function () {
  var $q, $scope, AlertService, MockedUser, WsApi, controller;

  var initializeVariables = function () {
    inject(function (_$q_, _AlertService_, _WsApi_) {
      $q = _$q_;

      MockedUser = new mockUser($q);

      AlertService = _AlertService_;
      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$rootScope_, _$window_, _MetadataRepo_, _ModalService_, _RestApi_, _ProjectAuthorityRepo_, _ProjectRepo_, _ProjectRepositoryRepo_, _StorageService_, _ProjectSuggestorRepo_, _UserService_) {
      $scope = _$rootScope_.$new();

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      controller = _$controller_("ProjectController", {
        $scope: $scope,
        $window: _$window_,
        AlertService: AlertService,
        MetadataRepo: _MetadataRepo_,
        ModalService: _ModalService_,
        ProjectAuthorityRepo: _ProjectAuthorityRepo_,
        ProjectRepo: _ProjectRepo_,
        ProjectRepositoryRepo: _ProjectRepositoryRepo_,
        RestApi: _RestApi_,
        StorageService: _StorageService_,
        ProjectSuggestorRepo: _ProjectSuggestorRepo_,
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
    module("mock.alert");
    module("mock.metadataRepo");
    module("mock.modalService");
    module("mock.projectAuthorityRepo");
    module("mock.projectRepo");
    module("mock.projectRepositoryRepo");
    module("mock.projectSuggestorRepo");
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
      "onCancelFieldProfileForm",
      "projectHasService",
      "resetFieldProfileForm",
      "setFieldProfileForm",
      "syncDocuments",
      "update",
      "updateFieldProfile"
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
    it("create create a new project", function () {
      var services = {};

      delete $scope.newProject;
      delete $scope.newProjectServices;

      $scope.create(dataProject1, services);
      $scope.$digest();

      expect($scope.newProject).toBeDefined();
      expect($scope.newProjectServices).toBeDefined();

      $scope.projectServices.a = [];
      services = {a: "A"};
      delete $scope.newProject;
      delete $scope.newProjectServices;

      $scope.create(dataProject1, services);
      $scope.$digest();

      expect($scope.newProject).toBeDefined();
      expect($scope.newProjectServices).toBeDefined();
    });

    it("delete delete an existing project", function () {
      spyOn($scope, "resetFieldProfileForm");

      $scope.delete(dataProject1);
      $scope.$digest();

      expect($scope.resetFieldProfileForm).toHaveBeenCalled();
    });

    it("onCancelFieldProfileForm clear the response", function () {
      spyOn($scope, "resetFieldProfileForm");

      $scope.onCancelFieldProfileForm();

      expect($scope.resetFieldProfileForm).toHaveBeenCalled();
    });

    it("projectHasService return a boolean", function () {
      var response;
      var serviceType = {id: 0};

      response = $scope.projectHasService($scope.projects[0], "!DoesNotExist!", 0);

      expect(response).toBe(false);

      dataProject1.ExampleServiceType = [serviceType];
      $scope.projectServices.ExampleServiceType = [serviceType];

      response = $scope.projectHasService(dataProject1, "ExampleServiceType", 0);

      expect(response).toBe(true);
    });

    it("resetFieldProfileForm clear the response", function () {
      var alert2 = new mockAlert($q);
      var alert3 = new mockAlert($q);
      var mockedAlerts;

      alert2.mock(dataAlert2);
      alert3.mock(dataAlert3);

      alert2.channel = "project/1/add-field-profile";
      alert3.channel = "project/1/update-field-profile";

      AlertService.get = function () {
        return mockedAlerts;
      };

      $scope.project = new mockProject($q);

      spyOn($scope, "closeModal");
      spyOn($scope, "setFieldProfileForm");

      $scope.resetFieldProfileForm();
      expect($scope.closeModal).toHaveBeenCalled();
      expect($scope.setFieldProfileForm).toHaveBeenCalled();


      spyOn(AlertService, "remove");

      mockedAlerts = {
        list: [
          alert2,
          alert3
        ]
      };

      $scope.resetFieldProfileForm();
      expect(AlertService.remove).toHaveBeenCalled();
    });

    it("setFieldProfileForm setup the profile", function () {
      var profile = {
        gloss: "Test Profile",
        id: 2345
      };

      $scope.isEditing = false;
      delete $scope.managingLabels;
      delete $scope.managingProfile;

      $scope.setFieldProfileForm(profile);
      $scope.$digest();

      expect($scope.isEditing).toBe(true);
      expect($scope.managingLabels).toBeDefined();
      expect($scope.managingProfile).toBe(profile);
    });

    it("syncDocuments sync documents", function () {
      delete $scope.isSyncing;

      spyOn($scope, "resetFieldProfileForm");

      $scope.syncDocuments($scope.projects[0]);
      $scope.$digest();

      expect($scope.isSyncing).toBe(false);
      expect($scope.resetFieldProfileForm).toHaveBeenCalled();

      delete $scope.isSyncing;

      $scope.syncDocuments(dataProject1);
      $scope.$digest();

      expect($scope.isSyncing).toBe(false);
    });

    it("update change the project", function () {
      var project = angular.copy($scope.projects[0]);
      var serviceType = {id: 0};

      project.name += " updated";
      project.dirty = function () {};

      spyOn($scope, "resetFieldProfileForm");
      spyOn(project, "dirty");

      $scope.update(project);
      $scope.$digest();

      expect($scope.resetFieldProfileForm).toHaveBeenCalled();
      expect(project.dirty).toHaveBeenCalled();

      project.dirty = function () {};
      $scope.projectServices.ExampleServiceType = [serviceType];
      $scope.updateableProjectServices.ExampleServiceType = [serviceType];

      spyOn(project, "dirty");

      $scope.update(project);
      $scope.$digest();

      expect(project.dirty).toHaveBeenCalled();
    });

    it("updateFieldProfile update the field profile", function () {
      var profile = {};
      var labels = [];
      var result;

      $scope.projects[0].dirty = function () {};

      result = $scope.updateFieldProfile($scope.projects[0].id, profile, labels);
      $scope.$digest();

      $scope.isEditing = true;

      $q.all([
        $scope.updateFieldProfile(-1, profile, labels),
        $scope.updateFieldProfile(false, profile, labels),
        $scope.updateFieldProfile($scope.projects[0].id, profile, labels)
      ]).then(function (results) {
      });
      $scope.$digest();
    });
  });

});
