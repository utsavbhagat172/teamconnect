angular.module('userService', [])


.factory('User', function($http) {

	var userFactory = {};

	userFactory.create = function(userData) {
		return $http.post('/api/signupuser', userData);
	}

	userFactory.allUsers = function() {
		return $http.get('/api/activeusers');
	}

	userFactory.all = function() {
		return $http.get('/api/allusers');
	}

	userFactory.resendOTP = function(mobile, callback) {
		$http({
			url: '/api/resendotp',
			method: 'POST',
			data: {
				'mobile': mobile
			}
		}).then(function(data){
			callback(data);
		})
	}

	userFactory.verifyOTP = function(mobile, otp, callback) {
		$http({
			url: '/api/verifyotp',
			method: 'POST',
			data: {
				'mobile': mobile,
				'OTPvalue': otp
			}
		}).then(function(data){
			callback(data);
		})
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