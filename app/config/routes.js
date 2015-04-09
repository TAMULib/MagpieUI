metadataTool.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.
		when('/users', {
			templateUrl: 'views/users.html'
		}).
		when('/assignments', {
			templateUrl: 'views/assignments.html'
		}).
		when('/documents', {
			templateUrl: 'views/documents.html'
		}).
		when('/myview', {
			templateUrl: 'views/myview.html'
		}).
		when('/annotate/:documentKey', {
			templateUrl: 'views/annotate.html'
		}).
		when('/admin', {
			templateUrl: 'views/admin.html'
		}).
		otherwise({redirectTo: '/',
			templateUrl: 'views/home.html'
		});
}]);