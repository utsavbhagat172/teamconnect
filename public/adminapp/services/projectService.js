angular.module('projectService', [])


.factory('Project', function($http, AuthToken) {


	var projectFactory = {};
	var token = AuthToken.getToken();

	projectFactory.allProjects = function() {
		return $http.post('/api/get_projects_byadmin');
	}
	projectFactory.getBookmarks = function() {
		return $http.post('/api/get_bookmark_projects');
	}

	projectFactory.createProject = function(projectData) {
		return $http.post('/api/project_create', projectData);
	}

	projectFactory.addProject = function(projid) {
		return $http({
			url: '/api/add_project_admin',
			method: 'POST',
			data: {
				'projid': projid
			}
		})
	}

	projectFactory.removeProject = function(projid) {
		return $http({
			url: '/api/remove_project_admin',
			method: 'POST',
			data: {
				'projid': projid
			}
		})
	}

	projectFactory.getOneProject = function(projid, callback) {
		$http({
			url:'/api/project_get', 
			method: 'POST',
			header:{'x-access-token':token},
			data: {
				'id':projid
			}
		}).then(function(response){
			callback(response);
		})
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