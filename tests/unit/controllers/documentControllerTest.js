describe("controller: DocumentController", function () {
  var $q, $scope, ApiResponseActions, MockedDocument, MockedNgTableParams, MockedUser, WsApi, controller;

  var initializeVariables = function () {
    inject(function (_$q_, _WsApi_) {
      $q = _$q_;

      MockedDocument = new mockDocument($q);
      MockedNgTableParams = new mockNgTableParams($q);
      MockedUser = new mockUser($q);

      // TODO: this should be in its own mock file as a mocked constant.
      ApiResponseActions = {
        CREATE: "CREATE",
        READ: "READ",
        UPDATE: "UPDATE",
        DELETE: "DELETE",
        REORDER: "REORDER",
        REMOVE: "REMOVE",
        SORT: "SORT",
        BROADCAST: "BROADCAST",
        CHANGE: "CHANGE",
        ANY: "ANY"
      };

      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$location_, _$rootScope_, _$route_, _$routeParams_, _$window_, _AlertService_, _Document_, _DocumentRepo_, _ModalService_, _NgTableParams_, _ProjectRepo_, _RestApi_, _StorageService_, _UserRepo_, _UserService_) {
      $scope = _$rootScope_.$new();

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      controller = _$controller_("DocumentController", {
        $route: _$route_,
        $routeParams: _$routeParams_,
        $scope: $scope,
        $location: _$location_,
        $window: _$window_,
        AlertService: _AlertService_,
        ApiResponseActions: ApiResponseActions,
        Document: _Document_,
        DocumentRepo: _DocumentRepo_,
        ModalService: _ModalService_,
        NgTableParams: _NgTableParams_,
        ProjectRepo: _ProjectRepo_,
        RestApi: _RestApi_,
        StorageService: _StorageService_,
        UserRepo: _UserRepo_,
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
    module("mock.alertService");
    module("mock.document", function ($provide) {
      var Document = function () {
        return MockedDocument;
      };
      $provide.value("Document", Document);
    });
    module("mock.documentRepo");
    module("mock.modalService");
    module("mock.ngTableParams", function ($provide) {
      var NgTableParams = function () {
        return MockedNgTableParams;
      };
      $provide.value("NgTableParams", NgTableParams);
    });
    module("mock.projectRepo");
    module("mock.restApi");
    module("mock.storageService");
    module("mock.user", function ($provide) {
      var User = function () {
        return MockedUser;
      };
      $provide.value("User", User);
    });
    module("mock.userRepo");
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
      "availableAnnotators",
      "setSelectedUser",
      "setTable",
      "togglePublished",
      "toggleProjectsFilter",
      "update",
      "updateTable"
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
    it("availableAnnotators return an array list", function () {
      var response = $scope.availableAnnotators();

      expect(typeof response).toEqual("object");
    });

    it("setSelectedUser assign the selected user", function () {
      var user = new mockUser($q);
      $scope.selectedUser = null;

      $scope.setSelectedUser(user);

      expect($scope.selectedUser).toEqual(user);
    });

    it("setTable setup the table", function () {
      $scope.tableParams = null;
      $scope.setTable();

      expect($scope.tableParams).toBeDefined();
    });

    it("togglePublished toggle the showPublished boolean", function () {
      $scope.showPublished = false;
      $scope.setTable();

      spyOn($scope.tableParams, "reload");

      $scope.togglePublished();

      expect($scope.showPublished).toBe(true);
      expect($scope.tableParams.reload).toHaveBeenCalled();

      $scope.togglePublished();
      expect($scope.showPublished).toBe(false);
    });

    it("toggleProjectsFilter toggle the showProjectsFilter boolean", function () {
      $scope.showProjectsFilter = false;

      $scope.toggleProjectsFilter();
      expect($scope.showProjectsFilter).toBe(true);

      $scope.toggleProjectsFilter();
      expect($scope.showProjectsFilter).toBe(false);
    });

    it("update update the document status", function () {
      var document = new mockDocument($q);
      document.status = "";

      spyOn(document, "save");

      $scope.update(document, "Open");

      expect(document.status).toEqual("Open");
      expect(document.annotator).not.toBeDefined();
      expect(document.save).toHaveBeenCalled();

      $scope.update(document, "Closed");
      expect(document.status).toEqual("Closed");
      expect(document.annotator).toEqual($scope.user.firstName + " " + $scope.user.lastName);

      $scope.update(document, "Other");
      expect(document.status).toEqual("Other");
    });

    it("updateTable reload the table", function () {
      $scope.setTable();
      $scope.tableNeedsUpdating = true;

      spyOn($scope.tableParams, "reload");

      $scope.updateTable();

      expect($scope.tableNeedsUpdating).toBe(false);
      expect($scope.tableParams.reload).toHaveBeenCalled();
    });
  });

});
