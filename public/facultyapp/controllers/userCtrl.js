angular.module('userCtrl', ['userService'])

.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}])

.controller('UserController', function(User, Professional) {


	var vm = this;

	
	/*User.all()
		.success(function(data) {
			vm.users = data;
		})

		Professional.all()
			.success(function(data) {
				vm.professionals = data;
			});*/


})


.controller('UserCreateController', function(User, $location, $window) {

	var vm = this;

	vm.signupUser = function() {
		vm.message = '';

		User.create(vm.userData)
			.then(function(response) {
				vm.userData = {};
				vm.message = response.data.message;

				//$window.localStorage.setItem('token', response.data.token);
				$location.path('/login');
			})
	}

})





.controller('UserUpdateController', function($scope, User, $location, $window, $routeParams, AuthToken, fileUpload, $route) {

	var vm = this;
	vm.display='info';
	vm.processing = false;
	vm.updateUser = function() {
		vm.message = '';
		console.log(vm.userData.birthdate)
		vm.newdate = new Date(vm.newbirthdate);
		console.log(vm.newdate);
		if(vm.newbirthdate){
			vm.userData.birthdate = new Date(vm.newbirthdate);
		}

		console.log(vm.userData.birthdate)
		User.update(vm.userData)
		.then(function(response) {
			vm.userData = {};
			console.log(response);
			AuthToken.setToken(response.data.token)
			$location.path('/');
		})

	}

	vm.sendbtn = 'RESEND';

	vm.verifybtn = 'VERIFY';

	vm.mobile = $routeParams.id;
	
	vm.resendotp = function(){
		User.resendOTP(vm.mobile, function(data){
			console.log('otp sent', data);
		})
	}

	vm.verifyotp = function() {
		User.verifyOTP(vm.mobile, vm.otp, function(data){
			console.log('verified', data);
			vm.sendbtn = 'VERIFIED';
			vm.verifybtn = 'VERIFIED';
			AuthToken.setToken(data.data.token);
			//$location.path('/')
		})
	}

	vm.updateProfilePicture = function(){
		vm.processing=true;
		var file = vm.newFile;
		fileUpload.updateFileToUrl(file,  function(message){
			vm.processing = false;
			$route.reload();
		});
	};
})


.service('fileUpload', ['$http', 'AuthToken', function ($http, AuthToken) {

	this.updateFileToUrl = function(file, callback){
		var fd = new FormData();
		var token = AuthToken.getToken();
		fd.append('file', file);
		$http.post('/api/upload', fd, {
			transformRequest: angular.identity,
			headers: {'x-access-token':token,'Content-Type': undefined}
		})
		.success(function(response){
			AuthToken.setToken(response.token);
			console.log(response);
			callback('updated');
 			//$route.reload();
 		})
		.error(function(){
			callback('errorupdate');
 			//$route.reload();
 		});
	}

}])