angular.module('questionCtrl', ['questionService'])


	.controller('QuestionController', function(Question, socketio) {


		var vm = this;
		
		Question.allQuestions()
			.success(function(data) {
				vm.questions = data;
			});


		vm.createQuestion = function() {

			vm.processing = true;

   
			vm.message = '';
			Question.createQuestion(vm.questionData)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.questionData = {};

					vm.message = data.message;

					
				});

		};

		socketio.on('question', function(data) {
			vm.questions.push(data);
		})

});