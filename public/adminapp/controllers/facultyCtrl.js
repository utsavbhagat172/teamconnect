angular.module('facultyCtrl', ['facultyService'])


.controller('FacultyController', function(User, Faculty, $routeParams, $scope, Profile) {


	var vm = this;
	facultyid = $routeParams.id;
	vm.newstatus = '';
	vm.newprice = '';

	vm.getFaculty = function() {
		console.log(facultyid)
		Profile.getFacultyByAdmin(facultyid, function(data){
			console.log('faculty-----',data)
			vm.faculty = data;
			vm.display = 'info';
		})
	};


	vm.changeFacultyStatus = function() {
		Faculty.changeStatus(facultyid, vm.newstatus, function(data){
			console.log(data)
			vm.faculty = data;
			vm.newstatus = '';

			vm.getFaculty();
		})
	}
})

