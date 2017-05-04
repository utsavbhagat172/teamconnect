angular.module('projectCtrl', ['projectService', 'userService', 'facultyService'])


.controller('ProjectController', function(User, Project, socketio, $scope, $routeParams) {


	var vm = this;

	Project.allProjects()
	.success(function(data) {
		console.log(data);
		angular.forEach(data, function(proj){
			proj.service_areas=[];
			var array = proj.service_area.split(',');
			angular.forEach(array, function(e){
				proj.service_areas.push(e);
			})
		})
		vm.projects = data;

	});

	User.getServiceAreas()
	.success(function(data) {
		vm.serviceareas = data;
	});



	vm.addProject = function(projid) {
		Project.addProject(projid).success(function(data){
			console.log(data);
			angular.forEach(vm.projects, function(element){
				if(element._id==projid){
					element.statusbyadmin=true;
				}
			})
		})
	}

	vm.removeProject = function(projid) {
		Project.removeProject(projid).success(function(data){
			console.log(data);
			angular.forEach(vm.projects, function(element){
				if(element._id==projid){
					element.statusbyadmin=false;
				}
			})
		})
	}
	$scope.showAll = true;
	$scope.checkChange = function() {
		for(t in vm.serviceareas){
			if(vm.serviceareas[t].on){
				$scope.showAll = false;
				return;
			}
		}
		$scope.showAll = true;
	};
	$scope.serviceFilter = function(a) {
		if($scope.showAll) { return true; }

		var sel = false;

		for(tech in vm.serviceareas){
			var t = vm.serviceareas[tech];
			if(t.on){
				if(a.service_area.indexOf(t.servicearea) != -1){
					return true;
				}else{
					sel = false;
				}
			}           
		}
		return sel;
	};

	vm.sort = function(keyname){
		console.log(keyname)
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    vm.getOneProject = function() {
    	Project.getOneProject($routeParams.id, function(data){
    		console.log(data);
    		vm.oneproject = data.data;
    	})
    }

    socketio.on('project', function(data) {
    	data.service_areas=[];
    	var array = data.service_area.split(',');
    	angular.forEach(array, function(e){
    		data.service_areas.push(e)
    	})
    	vm.projects.push(data);
    })

})

