angular.module('questionService', [])


.factory('Question', function($http) {


	var questionFactory = {};

	questionFactory.allQuestions = function() {
		return $http.post('/api/get_questions');
	}

	questionFactory.createQuestion = function(questionData) {
		return $http.post('/api/askquestion', questionData);
	}

	return questionFactory;


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