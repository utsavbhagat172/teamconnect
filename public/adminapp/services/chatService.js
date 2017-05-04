angular.module('chatService', [])


.factory('Chat', function($http) {


	var chatFactory = {};

	chatFactory.professionalChats = function() {
		return $http.post('/api/professional_getchats');
	}

	chatFactory.userChats = function() {
		return $http.post('/api/user_getchats');
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