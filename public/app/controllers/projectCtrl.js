angular.module('projectCtrl', ['projectService'])


	.controller('ProjectController', function(Project, socketio, $location) {


		var vm = this;
		vm.projects=[];
		
		/*Project.allProjects()
			.success(function(data) {
				vm.projects = data;
			});
*/

		vm.createProject = function() {

			vm.processing = true;

   
			vm.message = '';
			Project.createProject(vm.projectData)
				.success(function(data) {
					vm.processing = false;
					vm.projectData = {};
					vm.message = data.message;
					console.log(data);
					//$location.path('/');
				});

		};

		socketio.on('project', function(data) {
			vm.projects.push(data);
		})

});