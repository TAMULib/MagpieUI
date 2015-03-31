metadataTool.controller('DocumentController', function ($scope, DocumentRepo, User, UserRepo) {

	var userRepo;
	
	var user = User.get();
	
	var annotators = [];
	
	$scope.documents = DocumentRepo.get();
	
	$scope.isAdmin = function() {
		if(sessionStorage.role == "ROLE_ADMIN") {
			return true;
		}
		return false;
	};
	
	$scope.isManager = function() {
		if(sessionStorage.role == "ROLE_MANAGER") {
			return true;
		}
		return false;
	};
	
	$scope.isAnnotator = function() {
		if(sessionStorage.role == "ROLE_ANNOTATOR") {
			return true;
		}
		return false;
	};
	
	$scope.availableAnnotators = function() {		
		if(!userRepo) {
			userRepo = UserRepo.get();
			for(var key in userRepo.list) {
				var user = userRepo.list[key];
				if(user.role == 'ROLE_ANNOTATOR') {
					annotators.push(user);
				}
			}
		}
		return annotators;
	};
	
	$scope.updateAnnotator = function(filename, annotator) {
		if(!annotator) {
			annotator = User.get();
		}
		else {
			annotator = JSON.parse(annotator);
		}
		DocumentRepo.updateAnnotator(filename, annotator.uin);
		
		for(var key in $scope.documents.list) {
			var doc = $scope.documents.list[key];
			if(doc.filename == filename) {
				console.log($scope.documents.list[key]);
				$scope.documents.list[key].status = "Assigned";
			}
		}
		
	};
	
	$scope.isAssignedToMe = function(annotator) {
		return (annotator == user.uin);
	}
	
});

