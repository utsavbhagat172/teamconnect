angular.module('facultyService', [])


.factory('Faculty', function($http, AuthToken) {


	var facultyFactory = {};
	var token = AuthToken.getToken();

	facultyFactory.allProfessionals = function() {
		return $http.get('/api/activeprofessionals');
	}

	facultyFactory.all = function() {
		return $http.get('/api/allprofessionals');
	}

	facultyFactory.getProfessional = function(userid, callback){
		$http({
			url:'api/one_professional_byadmin',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'userid':userid}
		})
		.success(function(response){
			callback(response);
		})
	}
	facultyFactory.changeStatus = function(facid, newstatus, callback){
		$http({
			url:'/api/faculty_changestatus',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'facid':facid, 'newstatus':newstatus}
		})
		.then(function(response){
			callback(response);
		})
	}
	facultyFactory.getAnsweredQueries = function(profid, callback){
		$http({
			url:'api/get_answeredqueries_byuser',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'profid':profid}
		})
		.then(function(response){
			callback(response);
		})
	}
	facultyFactory.getReviews = function(profid, callback){
		$http({
			url:'api/get_reviews',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'profid':profid}
		})
		.then(function(response){
			callback(response);
		})
	}
	facultyFactory.changePrice = function(professionalid, newprice, callback){
		$http({
			url:'/api/professional_changeprice',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'profid':professionalid, 'newprice':newprice}
		})
		.then(function(response){
			callback(response);
		})
	}

	return facultyFactory;


});

/*.factory('socketio', function($rootScope) {

	var socket = io.connect();
	return {

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

	};

});*/