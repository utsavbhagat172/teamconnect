angular.module('profileCtrl', ['profileService'])


.controller('ProfileController', function(Profile) {


	var vm = this;

	
	Profile.allusers(function(data) {
		vm.users = data;
		console.log(data)
	});

	Profile.allfaculties(function(data) {
		vm.faculties = data;
		console.log(data)

	})
	Profile.alladmins(function(data) {
		vm.admins = data;
		console.log(data)
	})

	


})


.controller('ProfileCreateController', function(Profile, $location, $window) {

	var vm = this;

	vm.signupUser = function() {
		vm.message = '';

		User.create(vm.userData)
		.then(function(response) {
			vm.userData = {};
			vm.message = response.data.message;

			$window.localStorage.setItem('token', response.data.token);
			$location.path('/');
		})
	}

})