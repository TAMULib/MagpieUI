describe('controller: ExportController', function () {

    var controller, scope, ProjectRepo;

    var initializeController = function(settings) {
        inject(function ($controller, $rootScope, $window, _AlertService_, _MetadataRepo_, _ModalService_, _ProjectRepo_, _RestApi_, _StorageService_, _WsApi_) {
            scope = $rootScope.$new();

            ProjectRepo = _ProjectRepo_;

            sessionStorage.role = settings && settings.role ? settings.role : "ROLE_ADMIN";

            controller = $controller('ExportController', {
                $scope: scope,
                $window: $window,
                AlertService: _AlertService_,
                MetadataRepo: _MetadataRepo_,
                ModalService: _ModalService_,
                ProjectRepo: _ProjectRepo_,
                RestApi: _RestApi_,
                StorageService: _StorageService_,
                WsApi: _WsApi_
            });

            // ensure that the isReady() is called.
            scope.$digest();
        });
    };

    beforeEach(function() {
        module('core');
        module('metadataTool');
        module('mock.alertService');
        module('mock.metadataRepo');
        module('mock.modalService');
        module('mock.projectRepo');
        module('mock.restApi');
        module('mock.storageService');
        module('mock.wsApi');

        installPromiseMatchers();
        initializeController();
    });

    describe('Is the controller defined', function () {
        it('should be defined for admin', function () {
            initializeController({role: "ROLE_ADMIN"});
            expect(controller).toBeDefined();
        });
        it('should be defined for manager', function () {
            initializeController({role: "ROLE_MANAGER"});
            expect(controller).toBeDefined();
        });
        it('should be defined for anonymous', function () {
            initializeController({role: "ROLE_ANONYMOUS"});
            expect(controller).toBeDefined();
        });
    });

    describe('Are the scope methods defined', function () {
        it('export should be defined', function () {
            expect(scope.export).toBeDefined();
            expect(typeof scope.export).toEqual("function");
        });
        it('unlock should be defined', function () {
            expect(scope.unlock).toBeDefined();
            expect(typeof scope.unlock).toEqual("function");
        });
    });

    describe('Do the scope methods work as expected', function () {
        it('export should perform an export', function () {
            var response;
            var originalCloseModal = angular.copy(scope.closeModal);
            var formats = {"dspace-saf": "undefined", "dspace-csv": "object", "spotlight-csv": "object"};

            for (var format in formats) {
                scope.closeModal = angular.copy(originalCloseModal);
                spyOn(scope, 'closeModal');
                scope.isExporting = null;

                response = scope.export(mockProject1, format);
                scope.$digest();

                expect(scope.closeModal).toHaveBeenCalled();
                expect(scope.isExporting).toBe(false);
                expect(typeof response).toEqual(formats[format]);
            }

            response = scope.export(mockProject1, "!does_not_exist!");
            scope.$digest();

            expect(typeof response).toEqual('undefined');
        });
        it('unlock should unlock the project', function () {
            spyOn(ProjectRepo, 'reset');

            scope.unlock();
            scope.$digest();

            expect(ProjectRepo.reset).toHaveBeenCalled();
        });
    });

});
