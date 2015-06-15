metadataTool.service("User", function(WsApi, AbstractModel) {

	var self;

	var User = function(futureData) {
		self = this;

		//This causes our model to extend AbstractModel
		angular.extend(self, AbstractModel);
		
		self.unwrap(self, futureData, "Credentials");
		
	};
	
	User.data = null;

	User.promise = null;
	
	User.set = function(data) {
		self.unwrap(self, data, "Credentials");
	};

	User.get = function() {

		if(User.promise) return User.data;

		var newUserPromise = WsApi.fetch({
				endpoint: '/private/queue', 
				controller: 'user', 
				method: 'credentials',
		});

		User.promise = newUserPromise;

		if(User.data) {
			newUserPromise.then(function(data) {
				User.set(JSON.parse(data.body).content.Credentials);
			});
		}
		else {
			User.data = new User(newUserPromise);	
		}

		return User.data;	
	};

	User.ready = function() {
		return User.promise;
	};

	User.refresh = function() {
		User.promise = null;
		User.get();
	};

	return User;
	
});
