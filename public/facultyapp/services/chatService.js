angular.module('chatService', [])


.factory('Chat', function($http) {


	var chatFactory = {};

	chatFactory.userChats = function() {
		return $http.post('/api/faculty_getchats');
	}

	chatFactory.sendMessage = function(chatid, message) {

		return $http.post('/api/send_message', {
			chatid: chatid,
			message: message
		})
		.success(function(data) {
			return data;
		})
	}

	chatFactory.getChat = function(chatid) {

		return $http.post('/api/get_onechat', {
			chatid: chatid
		})
	}

	chatFactory.getAppointment = function(projectid){
		return $http.post('/api/get_appointment', {
			projectid: projectid
		})
	}

	chatFactory.scheduleAppointment = function(projectid, title, schedule){
		return $http.post('/api/create_appointment', {
			projectid: projectid,
			title: title,
			schedule: schedule
		})
	}

	chatFactory.approveAppointment = function(id){
		return $http.post('/api/approve_appointment', {
			id: id
		})
	}

	chatFactory.rescheduleAppointment = function(id, newschedule){
		return $http.post('/api/reschedule_appointment', {
			id: id,
			newschedule: newschedule
		})
	}

	chatFactory.createNewChat = function(newconv){
		return $http.post('/api/start_conversation', {
			newconv: newconv
		})
	}
	chatFactory.getProjectFiles = function(projectid){
		return $http.post('/api/getProjectFiles', {
			projectid: projectid
		})
	}



	return chatFactory;


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