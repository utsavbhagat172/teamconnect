angular.module('professionalService', [])


.factory('Professional', function($http) {


	var professionalFactory = {};

	professionalFactory.allProfessionals = function() {
		return $http.get('/api/activeprofessionals');
	}

	professionalFactory.all = function() {
		return $http.get('/api/allprofessionals');
	}

	return professionalFactory;


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