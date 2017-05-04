angular.module('questionService', [])


.factory('Question', function($http, AuthToken) {


	var questionFactory = {};
	var token = AuthToken.getToken();

	questionFactory.allQuestions = function() {
		return $http.post('/api/get_questions_byadmin');
	}

	questionFactory.createQuestion = function(questionData) {
		return $http.post('/api/askquestion', questionData);
	}
	questionFactory.getQuestionAnswers = function( quesid, callback) {
		$http({
			url:'/api/question_answers', 
			method: 'POST',
			header:{'x-access-token':token},
			data: {
				'quesid':quesid
			}
		}).then(function(response){
			callback(response);
		})
	}
	questionFactory.addQuestion = function(quesid) {
		return $http({
			url: '/api/add_question_admin',
			method: 'POST',
			data: {
				'quesid': quesid
			}
		})
	}

	questionFactory.removeQuestion = function(quesid) {
		return $http({
			url: '/api/remove_question_admin',
			method: 'POST',
			data: {
				'quesid': quesid
			}
		})
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