angular.module('userService', [])


.factory('User', function(AuthToken, $http) {

	var userFactory = {};
	var token = AuthToken.getToken();

	userFactory.create = function(userData) {
		return $http.post('/api/signupadmin', userData);
	}

	userFactory.allUsers = function() {
		return $http.get('/api/activeusers');
	}

	userFactory.all = function() {
		return $http.get('/api/allusers');
	}
	userFactory.getServiceAreas = function() {
		return $http.get('/api/get_servicearea');
	}

	userFactory.getAdmin = function(adminid, callback){
		$http({
			url:'api/one_admin_byadmin',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'adminid':adminid}
		})
		.success(function(response){
			callback(response);
		})
	}
	
	userFactory.changeStatus = function(userid, newstatus, callback){
		$http({
			url:'/api/user_changestatus',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'userid':userid, 'newstatus':newstatus}
		})
		.success(function(response){
			callback(response);
		})
	}

	userFactory.changeAdminStatus = function(adminid, newstatus, callback){
		$http({
			url:'/api/admin_changestatus',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'adminid':adminid, 'newstatus':newstatus}
		})
		.success(function(response){
			callback(response);
		})
	}



	return userFactory;

});