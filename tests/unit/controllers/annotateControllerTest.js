describe("controller: AnnotateController", function () {
  var $location, $q, $routeParams, $scope, $timeout, $window, AlertService, MockedUser, PublishingEvent, DocumentRepo, ProjectRepositoryRepo, WsApi, controller;

  var initializeVariables = function (settings) {
    inject(function (_$location_, _$q_, _$routeParams_, _$timeout_, _$window_, _DocumentRepo_, _ProjectRepositoryRepo_, _WsApi_) {
      $location = _$location_;
      $q = _$q_;
      $routeParams = _$routeParams_;
      $timeout = _$timeout_;
      $window = _$window_;

      MockedUser = new mockUser($q);

      DocumentRepo = _DocumentRepo_;
      ProjectRepositoryRepo = _ProjectRepositoryRepo_;
      WsApi = _WsApi_;
    });
  };

  var initializeController = function (settings) {
    inject(function (_$controller_, _$http_, _$rootScope_, _$window_, _AlertService_, _ControlledVocabularyRepo_, _ModalService_, _PublishingEvent_, _RestApi_, _ResourceRepo_, _StorageService_, _UserService_) {
      $scope = _$rootScope_.$new();

      AlertService = _AlertService_;
      PublishingEvent = _PublishingEvent_;

      sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";
      sessionStorage.token = settings && settings.token ? settings.token : "faketoken";

      if (settings && settings.$routeParams) {
        if (typeof settings.$routeParams == "object") {
          angular.extend($routeParams, settings.$routeParams);
        }
      } else {
        angular.extend($routeParams, {
          projectKey: "Project 001",
          documentKey: "Document 002",
          action: "annotate"
        });
      }

      controller = _$controller_("AnnotateController", {
        $http: _$http_,
        $location: $location,
        $q: $q,
        $routeParams: $routeParams,
        $scope: $scope,
        $timeout: $timeout,
        $window: _$window_,
        AlertService: _AlertService_,
        ControlledVocabularyRepo: _ControlledVocabularyRepo_,
        DocumentRepo: DocumentRepo,
        ModalService: _ModalService_,
        ProjectRepositoryRepo: ProjectRepositoryRepo,
        PublishingEvent: PublishingEvent,
        RestApi: _RestApi_,
        ResourceRepo: _ResourceRepo_,
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
    module("mock.alertService");
    module("mock.controlledVocabularyRepo");
    module("mock.document");
    module("mock.documentRepo");
    module("mock.modalService");
    module("mock.projectRepository");
    module("mock.projectRepositoryRepo");
    module("mock.publishingEvent");
    module("mock.restApi");
    module("mock.resource");
    module("mock.resourceRepo");
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
      "accept",
      "addMetadataField",
      "addSuggestion",
      "cannotPublish",
      "delete",
      "hasFileType",
      "managerAnnotating",
      "managerReviewing",
      "getControlledVocabulary",
      "getFilesOfType",
      "getIIIFUrls",
      "getRepositoryById",
      "push",
      "removeMetadataField",
      "requiredFieldsPresent",
      "requiresCuration",
      "save",
      "submit",
      "submitRejection"
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

  describe("Does the $scope method", function () {
    it("accept submit a document as accepted", function () {
      delete $scope.document.status;

      spyOn($scope.document, "save").and.callThrough();

      $scope.accept();
      $scope.$digest();

      expect($scope.document.status).toEqual("Accepted");
      expect($scope.document.save).toHaveBeenCalled();
    });

    it("addMetadataField add a new field value", function () {
      var field = {
        id: 1,
        label: {
          profile: { defaultValue: "" },
          value: "Mock Field"
        },
        values: [{
          field: 1,
          value: "first"
        }]
      };

      $scope.addMetadataField(field);

      expect(field.values.length).toEqual(2);
    });

    it("addSuggestion add a suggestion", function () {
      var field = {
        id: 1,
        label: {
          profile: { defaultValue: "" },
          value: "Mock Field"
        },
        values: [{
          field: 1,
          value: "first"
        }]
      };
      var suggestion = { field: 1, value: "second" };

      $scope.addSuggestion(field, suggestion);

      expect(field.values.length).toEqual(2);

      field.values[0].value = "";
      suggestion.value = "third";

      $scope.addSuggestion(field, suggestion);

      expect(field.values[0].value).toEqual("third");
    });

    it("cannotPublish return a boolean", function () {
      var response;
      var document1 = new mockDocument($q);
      var document2 = new mockDocument($q);
      document1.publishing = false;
      document2.publishing = true;

      $scope.document = document1;
      response = $scope.cannotPublish();
      expect(response).toBe(false);

      $scope.document = document2;
      response = $scope.cannotPublish();
      expect(response).toBe(true);

      document2.publishing = "failsafe check";
      response = $scope.cannotPublish();
      expect(response).toBe(false);
    });

    it("delete delete a document", function () {
      var document = $scope.document;

      spyOn(document, "delete").and.callThrough();

      $scope.delete(document);
      $scope.$digest();
      $timeout.flush();

      expect(document.delete).toHaveBeenCalled();
    });

    it("hasFileType return a boolean", function () {
      var response;

      response = $scope.hasFileType("text");
      expect(response).toBe(true);

      // TODO: fixme!!
      // response = $scope.hasFileType("image");
      // expect(response).toBe(false);

      $scope.resources = [];
      response = $scope.hasFileType("text");
      expect(response).toBe(false);
    });

    it("managerAnnotating return a boolean", function () {
      var response;

      $routeParams.action = "annotate";
      response = $scope.managerAnnotating();

      expect(response).toBe(true);

      delete $routeParams.action;
      response = $scope.managerAnnotating();

      expect(response).toBe(false);
    });

    it("managerReviewing return a boolean", function () {
      var response;

      $routeParams.action = "review";
      response = $scope.managerReviewing();

      expect(response).toBe(true);

      delete $routeParams.action;
      response = $scope.managerReviewing();

      expect(response).toBe(false);
    });

    it("getControlledVocabulary return a controlled vocabulary", function () {
      var response;

      response = $scope.getControlledVocabulary(0);

      expect(response).toBe($scope.cv[0]);

      response = $scope.getControlledVocabulary(-1);

      expect(response).toEqual([]);
    });

    it("getFilesOfType return a list of files", function () {
      var response;

      response = $scope.getFilesOfType("text");

      expect(response.length).toEqual(1);
      expect(response[0].name).toEqual("Resource 001");
      expect(response[0].document).toEqual("Document 001");
      expect(response[0].mimeType).toEqual("text/plain");


      delete $scope.resources;
      response = $scope.getFilesOfType("text");

      expect(response).toEqual([]);
    });

    it("getIIIFUrls return a list of URLs", function () {
      var response;

      $scope.document = new mockDocument($q);
      $scope.document.publishedLocations = [];

      response = $scope.getIIIFUrls();
      $scope.$digest();

      expect(response.length).toEqual(0);

      $scope.document.publishedLocations.push(new mockPublishedLocation($q));
      $scope.document.publishedLocations.push(new mockPublishedLocation($q));
      $scope.document.publishedLocations.push(new mockPublishedLocation($q));

      $scope.document.publishedLocations[1].mock(dataPublishedLocation2);
      $scope.document.publishedLocations[2].mock(dataPublishedLocation3);

      response = $scope.getIIIFUrls();
      $scope.$digest();

      // TODO: fixme!!
      // NOTE: sporadically fails
      // expect(response.length).toEqual(6);
    });

    it("getRepositoryById return a repository", function () {
      var response;

      for (var i in $scope.repositories) {
        if ($scope.repositories.hasOwnProperty(i)) {
          response = $scope.getRepositoryById($scope.repositories[i].id);
          expect(response).toBe($scope.repositories[i]);
        }
      }

      response = $scope.getRepositoryById(-1);

      expect(response).toBe(undefined);
    });

    it("push push a document", function () {
      delete $scope.document.status;

      spyOn($scope.document, "push").and.callThrough();

      $scope.push();
      $scope.$digest();

      expect($scope.document.push).toHaveBeenCalled();
    });

    it("removeMetadataField remove a specific metadata field", function () {
      var length;

      $scope.document.fields = {
        a: {
          values: ["first", "second"]
        }
      };

      $scope.document.dirty = function () { };
      length = $scope.document.fields.a.values.length;

      spyOn($scope.document, "dirty");

      $scope.removeMetadataField($scope.document.fields.a, 0);

      expect($scope.document.fields.a.values.length).toEqual(length - 1);
      expect($scope.document.dirty).toHaveBeenCalled();
    });

    it("requiredFieldsPresent return a boolean", function () {
      var response;

      $scope.document.fields = {
        a: {
          label: {
            profile: {
              required: true
            }
          }
        }
      };

      response = $scope.requiredFieldsPresent();

      expect(response).toBe(true);

      $scope.document.mock(dataDocument2);
      $scope.document.fields = {
        a: {
          label: {
            profile: {
              required: false
            }
          }
        }
      };

      response = $scope.requiredFieldsPresent();

      expect(response).toBe(false);
    });

    it("requiresCuration submit a document as requires curation", function () {
      delete $scope.document.status;

      spyOn($scope.document, "save").and.callThrough();
      spyOn($location, "path");

      $scope.requiresCuration();

      expect($scope.document.status).toEqual("Requires Curation");
      expect($scope.document.save).toHaveBeenCalled();
    });

    it("save save a document", function () {
      $scope.openModal = function () { };
      $scope.closeModal = function () { };

      spyOn($scope, "openModal");
      spyOn($scope.document, "save").and.callThrough();

      $scope.save();
      $scope.$digest();

      expect($scope.document.save).toHaveBeenCalled();
      expect($scope.openModal).toHaveBeenCalled();
    });

    it("submit submit a document as annotated", function () {
      $scope.openModal = function () { };
      $scope.closeModal = function () { };

      spyOn($scope, "openModal");
      spyOn($scope.document, "save").and.callThrough();
      spyOn($location, "path");

      $scope.submit();
      $scope.$digest();
      $timeout.flush();

      expect($scope.document.status).toEqual("Annotated");
      expect($scope.document.save).toHaveBeenCalled();
      expect($scope.openModal).toHaveBeenCalled();
      expect($location.path).toHaveBeenCalled();
    });

    it("submitRejection save a document as rejected", function () {
      var notes = "notes";

      spyOn($scope.document, "save").and.callThrough();
      spyOn(AlertService, "add");
      spyOn($location, "path");

      $scope.submitRejection(notes);
      $scope.$digest();
      $timeout.flush();

      expect($scope.document.status).toEqual("Rejected");
      expect($scope.document.notes).toBe(notes);
      expect($scope.document.save).toHaveBeenCalled();
    });
  });

  describe("Does the control listen on", function () {
    it("'/channel/publishing/document/' work as expected", function () {
      var publishingEvent = new mockPublishingEvent($q);

      WsApi.listen = function (path) {
        var payload = {
          PublishingEvent: publishingEvent
        };
        return notifyPromise($timeout, $q.defer(), payload, null, null, "BROADCAST");
      };

      initializeController();
      $scope.$digest();
      $timeout.flush();

      expect($scope.publishingEvents.length).toBe(1);
      expect($scope.publishingEvents[0].id).toBe(publishingEvent.id);

      WsApi.listen = function (path) {
        var payload = {
          PublishingEvent: publishingEvent
        };
        return notifyPromise($timeout, $q.defer(), payload, null, null, "INVALID");
      };

      initializeController();
      $scope.$digest();
      $timeout.flush();

      expect($scope.publishingEvents.length).toBe(0);

      WsApi.listen = function (path) {
        var payload = {
        };
        return notifyPromise($timeout, $q.defer(), payload, null, null, "BROADCAST");
      };

      initializeController();
      $scope.$digest();
      $timeout.flush();

      expect($scope.publishingEvents.length).toBe(0);
    });

    it("'/channel/document' work as expected", function () {
      var document = new mockDocument($q);

      // @todo
      //$scope.publishingEvents.push(new mockPublishingEvent($q));
      //expect($scope.publishingEvents.length).toBe(0);
    });
  });

  describe("Does the controller initialization", function () {
    it("process field.values", function () {
      var document = new mockDocument($q);
      document.mock(dataDocument2);
      document.fields[0].values = [];

      DocumentRepo.update(document);
      $scope.$digest();

      initializeController();
      expect(controller).toBeDefined();
    });

    it("render view action on disallowed document statuses", function () {
      initializeController();
      expect(controller).toBeDefined();
      expect($scope.action).toBe("annotate");

      initializeController({
        $routeParams: {
          projectKey: "Project 001",
          documentKey: "Document 001"
        }
      });
      expect(controller).toBeDefined();
      expect($scope.action).toBe("view");

      initializeController({
        $routeParams: {
          projectKey: "Project 002",
          documentKey: "Document 003"
        }
      });
      expect(controller).toBeDefined();
      expect($scope.action).toBe("view");
    });
  });
});
