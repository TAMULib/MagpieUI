metadataTool.controller('UserRepoController', function ($controller, $location, $injector, $scope, $route, StorageService, UserService) {
    
    angular.extend(this, $controller('AbstractController', {$scope: $scope}));
    
    $scope.user = UserService.getCurrentUser();

    if($scope.isAdmin() || $scope.isManager()) {

        var UserRepo = $injector.get("UserRepo");

        $scope.userUpdated = {};

        $scope.userRepo = UserRepo.getAll();
            
        $scope.updateRole = function(user) {
            
            angular.extend($scope.userUpdated, user);

            user.save();

            if($scope.user.uin == user.uin) {
                if(user.role == 'ROLE_ANNOTATOR') {
                    $location.path('/assignments');
                }
                else if(user.role == 'ROLE_USER') {
                    $location.path('/myview');
                }
                else {}
            }
        };

        $scope.allowableRoles = function(userRole) {
            if($scope.isAdmin()) {
                return ['ROLE_ADMIN','ROLE_MANAGER','ROLE_ANNOTATOR','ROLE_USER'];
            }
            else if($scope.isManager()) {
                if(userRole == 'ROLE_ADMIN') {
                    return ['ROLE_ADMIN'];
                }
                return ['ROLE_MANAGER','ROLE_ANNOTATOR','ROLE_USER'];
            }
            else {
                return [userRole];
            }
        };

        $scope.delete = function(user) {
            user.delete();
        };

        $scope.canDelete = function(user) {
            var canDelete;            
            if($scope.isAdmin()) {
                canDelete = true;
            }
            else if($scope.isManager()) {
                if(user.role == "ROLE_ADMIN") {
                    canDelete = false;
                }
                else {
                    canDelete = true;
                }
            }
            else {
                canDelete = false;
            }
            if(user.uin == $scope.user.uin) {
                canDelete = false;
            }
            return canDelete;
        };

        UserRepo.listen(function(response) {
            $scope.userUpdated = {};
            $route.reload();
        });

    }

});
