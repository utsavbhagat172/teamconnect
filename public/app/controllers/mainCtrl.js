angular.module('mainCtrl', ['userService'])


.controller('MainController', function($rootScope, $location, Auth, User, $routeParams) {

	var vm = this;


	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
		.then(function(data) {
			vm.user = data.data;
			if(!data.data.imgURL){
				data.data.imgURL='https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png';
			}
		});

		if(!vm.loggedIn){
			if($routeParams.id){

			}
			else{
				console.log('login')
				$location.path('/login')
			}
			
		}

	});


	vm.doLogin = function() {

		vm.processing = true;

		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
		.success(function(data) {
			vm.processing = false;

			Auth.getUser()
			.then(function(data) {
				if(!data.data.imgURL){
					data.data.imgURL='https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png';
				}
				vm.user = data.data;
			});

			if(data.success)
				$location.path('/');
			else
				vm.error = data.message;

		});
	}

	vm.getInvitations = function() {
		User.getInvitations().success(function(data){
			console.log(data);
			vm.invitations = data;
		})
	}
	vm.acceptInvitation = function(invitation){
		console.log(invitation._id)
		User.acceptInvitation(invitation._id, function(data){
			console.log(data);
		})
	}
	vm.rejectInvitation = function(invitation){
		console.log(invitation._id)
		User.rejectInvitation(invitation._id).then(function(data){
			console.log(data);
		})
	}


	vm.doLogout = function() {
		Auth.logout();
		$location.path('/logout');
	}
});