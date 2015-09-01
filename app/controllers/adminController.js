metadataTool.controller('AdminController', function ($controller, $route, $scope, AssumedControl, AuthServiceApi, Metadata, StorageService, User, WsApi) {

    angular.extend(this, $controller('AbstractController', {$scope: $scope}));

    if(typeof StorageService.get("assuming") === 'undefined') {
		StorageService.set('assuming', 'false');
	}

	$scope.user = User.get();

	$scope.exportFormat = "saf"

    $scope.assumedControl = AssumedControl.get();
    
    AssumedControl.set({
		'netid': '',
		'button': (StorageService.get("assuming") == 'true') ? 'Unassume' : 'Assume',
		'status': ''
	});
	
	$scope.$watch('user.role', function() {
		if($scope.user.role) {
			StorageService.set('role', $scope.user.role);
			if ($scope.user.role == 'ROLE_ADMIN') {
				$scope.admin = true;
			}
			else {
				$scope.admin = false;
			}
		}
	});

	$scope.isAssuming = function() {
		return StorageService.get("assuming");
	};

	$scope.isMocking = function() {
		if(globalConfig.mockRole) {
			return true;
		}
		else {
			return false;
		}
	};
	
	$scope.assumeUser = function(assume) {
	
		if($scope.isAssuming() == 'false') {

			if ((typeof assume !== 'undefined') && assume.netid) {	

				logger.log("Assuming user");

				StorageService.set('assumedUser', JSON.stringify(assume));
				StorageService.set('assuming', 'true');
				StorageService.set('adminToken', StorageService.get("token"));

				AuthServiceApi.getAssumedUser(assume).then(function(data) {
					
					WsApi.fetch({
						endpoint: '/private/queue', 
						controller: 'admin', 
						method: 'confirmuser',
					}).then(function(data) {

						if(data) {
						
							User.refresh();

							AssumedControl.set({
								'netid': '',
								'button': 'Unassume',
								'status': ''
							});

							angular.element("#assumeUserModal").modal("hide");
							
							$route.reload();

						}
						else {

							StorageService.set('assuming', 'false');

							AssumedControl.set({
								'netid': assume.netid,
								'button': 'Assume',
								'status': 'invalid netid'
							});
						}

					});
				});
			}
		} else {
			console.log("Unassuming user");

			StorageService.delete('assumedUser');
			StorageService.set('assuming', 'false', 'session');
			StorageService.set('token', StorageService.get("adminToken"));
			
			AssumedControl.set({
				'netid': '',
				'button': 'Assume',
				'status': ''
			});

			User.refresh();

			StorageService.set("role", $scope.user.role);

			$route.reload();
			
		}
		
	};

	$scope.exportMetadata = function(project) {
		
		logger.log("Exporting metadata for " + project);

		$scope.headers = [];
		
		return Metadata.getHeaders(project).then(function(data) {
			
			var headers = JSON.parse(data.body).content["ArrayList<String>"];
			
			for(var key in headers) {
				$scope.headers.push(headers[key]);
			}
			
			return Metadata.getPublishedByProject(project).then(function(data) {
				return  JSON.parse(data.body).content["ArrayList<ArrayList>"];
			});

		});
		
	};

	Metadata.getProjects().then(function(data) {
		$scope.projects = JSON.parse(data.body).content["ArrayList<String>"];
		if(typeof $scope.projects !== 'undefined') {
			$scope.project = $scope.projects[0];
		}		
		$scope.getProjects = function() {		
			return $scope.projects;
		};
	});
	
	$scope.getFormats = function() {		
		return ["csv","saf"];
	};

	$scope.export = function() {
	
		
	
	}

	$scope.sync = function() {
		WsApi.fetch({
				endpoint: '/private/queue', 
				controller: 'admin', 
				method: 'sync'
		}).then(function(data) {
			logger.log(data);
		});
	};
	
});
