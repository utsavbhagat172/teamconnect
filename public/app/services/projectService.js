angular.module('projectService', [])


.factory('Project', function($http) {


	var projectFactory = {};

	projectFactory.allProjects = function() {
		return $http.post('/api/project_all');
	}

	projectFactory.oneProject = function(projid) {
		return $http.post('/api/project_get', projid);
	}

	projectFactory.createProject = function(projectData) {
		return $http.post('/api/project_create', projectData);
	}

	return projectFactory;


})

.factory('socketio', function($rootScope) {

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

});