angular.module('userService', [])


.factory('User', function($http) {

	var userFactory = {};

	userFactory.create = function(userData) {
		return $http.post('/api/signupfaculty', userData);
	}

	userFactory.allUsers = function() {
		return $http.get('/api/activeusers');
	}

	userFactory.all = function() {
		return $http.get('/api/allusers');
	}

	userFactory.getInvitations = function() {
		return $http.get('/api/get_invitations')
	}

	userFactory.acceptInvitation = function(invid) {
		return $http.post('/api/invite_accept', {invid:invid})
	}

	userFactory.rejectInvitation = function(invid) {
		return $http.post('/api/invite_reject', {invid:invid})
	}
	



	return userFactory;

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