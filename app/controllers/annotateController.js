metadataTool.controller('AnnotateController', function($controller, $http, $location, $routeParams, $route, $q, $scope, $timeout, ControlledVocabularyRepo, DocumentRepo, StorageService, UserService) {

    angular.extend(this, $controller('AbstractController', {$scope: $scope}));

    $scope.user = UserService.getCurrentUser();

    $scope.document = DocumentRepo.get($routeParams.projectKey, $routeParams.documentKey);

    $scope.cv = ControlledVocabularyRepo.getAll();

    $scope.action = $routeParams.action;

    $scope.loadingText = "Loading...";

    $q.all([$scope.document.ready(), ControlledVocabularyRepo.ready()]).then(function() {

        $scope.document.getSuggestions();

        console.log('received', $scope.document);

        var emptyFieldValue = function(field) {
            return {
                value: field.label.profile.defaultValue ? field.label.profile.defaultValue : ''
            };
        };

        for(var k in $scope.document.fields) {
            var field = $scope.document.fields[k];
            if(field.values.length === 0) {
                field.values.push(emptyFieldValue(field));
            }
        }

        $scope.removeMetadataField = function(field, index) {
            field.values.splice(index, 1);
        };

        $scope.addMetadataField = function(field) {
            field.values.push(emptyFieldValue(field));
        };

        $scope.save = function() {
            $scope.loadingText = "Saving...";
            $scope.openModal('#pleaseWaitDialog');
            $scope.document.save().then(function(data) {
                $scope.closeModal();
            });
        };

        $scope.submit = function() {
            $scope.loadingText = "Submitting...";
            $scope.openModal('#pleaseWaitDialog');
            $scope.document.status = 'Annotated';
            $scope.document.save().then(function(data) {
                $scope.closeModal();
                $timeout(function() {
                    $location.path('/assignments');
                }, 500);
            });
        };

        $scope.accept = function() {
            $scope.loadingText = "Accepting...";
            $scope.openModal('#pleaseWaitDialog');
            $scope.document.status = 'Accepted';
            $scope.document.notes = '';
            $scope.document.save().then(function(data) {
                $scope.closeModal();
                $scope.action = 'view';
            });
        };

        $scope.push = function() {
            $scope.loadingText = "Pushing document to repository over REST API...";
            $scope.openModal('#pleaseWaitDialog');
            $scope.document.push().then(function(data) {
                $scope.closeModal();
                $scope.action = 'view';
                $scope.document = DocumentRepo.get($routeParams.projectKey, $routeParams.documentKey);
            });
        };

        $scope.managerAnnotating = function() {
            return ($routeParams.action == 'annotate');
        };

        $scope.managerReviewing = function() {
            return ($routeParams.action == 'review');
        };

        $scope.submitRejection = function(rejectionNotes) {
            if(rejectionNotes) {
                DocumentRepo.update($scope.document.name, 'Rejected', $scope.document.annotator, rejectionNotes).then(function() {
                    $timeout(function() {
                        $location.path('/documents');
                    }, 500);
                });
            }
        };

        $scope.requiresCuration = function() {
            DocumentRepo.update($scope.document.name, 'Requires Curation', $scope.user.firstName + " " + $scope.user.lastName + " (" + $scope.user.uin + ")");
            $location.path('/assignments');
        };

        $scope.getControlledVocabulary = function(label) {
            if(typeof $scope.cv[label] === 'undefined') {
                return [];
            }
            return $scope.cv[label];
        };

        $scope.requiredFieldsPresent = function() {
            for(var k in $scope.document.fields) {
                if($scope.document.fields[k].label.profile.required) {
                    return true;
                }
            }
            return false;
        };

    });

});
