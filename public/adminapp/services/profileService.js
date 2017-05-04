angular.module('profileService', [])


.factory('Profile', function(AuthToken, $http) {

	var profileFactory = {};
	var token = AuthToken.getToken();

	profileFactory.create = function(userData) {
		return $http.post('/api/signupuser', userData);
	}

	profileFactory.activeusers = function(callback) {
		$http({
			url:'api/activeusers',
			method:'GET',
			headers:{'x-access-token': token}
		})
		.success(function(response){
			callback(response);
		})
	}
	profileFactory.allusers = function(callback) {
		$http({
			url:'api/allusers',
			method:'GET',
			headers:{'x-access-token': token}
		})
		.success(function(response){
			callback(response);
		})
	}
	profileFactory.getUserByAdmin = function(userid, callback){
		$http({
			url:'api/one_user_byadmin',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'userid':userid}
		})
		.success(function(response){
			callback(response);
		})
	}

	profileFactory.activefaculties = function(callback) {
		$http({
			url:'api/activefaculties',
			method:'GET',
			headers:{'x-access-token': token}
		})
		.success(function(response){
			callback(response);
		})
	}
	profileFactory.allfaculties = function(callback) {
		$http({
			url:'api/allfaculty',
			method:'GET',
			headers:{'x-access-token': token}
		})
		.success(function(response){
			callback(response);
		})
	}
	profileFactory.getFacultyByAdmin = function(facid, callback){
		$http({
			url:'api/one_faculty_byadmin',
			method:'POST',
			headers:{'x-access-token': token},
			data: {'facid':facid}
		})
		.success(function(response){
			callback(response);
		})
	}



	profileFactory.activeadmins = function(callback) {
        $http({
            url:'api/activeadmins',
            method:'GET',
            headers:{'x-access-token': token}
        })
        .success(function(response){
            callback(response);
        })
	}
	profileFactory.alladmins = function(callback) {
        $http({
            url:'api/alladmins',
            method:'GET',
            headers:{'x-access-token': token}
        })
        .success(function(response){
            callback(response);
        })
	}
	return profileFactory;

});