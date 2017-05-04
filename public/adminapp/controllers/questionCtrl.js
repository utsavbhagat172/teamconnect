angular.module('questionCtrl', ['questionService'])


	.controller('QuestionController', function(Question, socketio, $scope, User) {


		var vm = this;
		
		Question.allQuestions()
			.success(function(data) {
				console.log(data);
				angular.forEach(data, function(ques){
					ques.service_areas=[];
					var array = ques.service_area.split(',');
					angular.forEach(array, function(e){
						ques.service_areas.push(e);
					})
				})
				vm.questions = data;

			});


	User.getServiceAreas()
	.success(function(data) {
		angular.forEach(data, function(e){
			e.on=false;
		})
		vm.serviceareas = data;
	});


	vm.addQuestion = function(quesid) {
		Question.addQuestion(quesid).success(function(data){
			angular.forEach(vm.questions, function(element){
				if(element._id==quesid){
					element.status=true;
				}
			})
		})
	}

	vm.removeQuestion = function(quesid) {
		Question.removeQuestion(quesid).success(function(data){
			angular.forEach(vm.questions, function(element){
				if(element._id==quesid){
					element.status=false;
				}
			})
		})
	}



		$scope.showAll = true;

	$scope.checkChange = function() {
		for(t in vm.serviceareas){
			if(vm.serviceareas[t].on){
				$scope.showAll = false;
				return;
			}
		}
		$scope.showAll = true;
	};
	$scope.serviceFilter = function(a) {
		if($scope.showAll) { return true; }

		var sel = false;

		for(tech in vm.serviceareas){
			var t = vm.serviceareas[tech];
			if(t.on){
				if(a.service_area.indexOf(t.servicearea) != -1){
					return true;
				}else{
					sel = false;
				}
			}           
		}
		return sel;
	};


	$scope.showAllTypes = true;
	vm.types = [{type:'Private'},{type:'Public'}];

	$scope.checkTypeChange = function() {
		for(t in vm.types){
			if(vm.types[t].on){
				$scope.showAllTypes = false;
				return;
			}
		}
		$scope.showAllTypes = true;
	};
	$scope.typeFilter = function(a) {
		if($scope.showAllTypes) { return true; }

		var sel = false;

		for(tech in vm.types){
			var t = vm.types[tech];
			if(t.on){
				if(a.visibility.indexOf(t.type) != -1){
					return true;
				}else{
					sel = false;
				}
			}           
		}
		return sel;
	};

	vm.viewAnswers = function(question){

		Question.getQuestionAnswers(question._id, function(data){
			console.log(data.data);
			question.answers=data.data;
		})
	}
	vm.sort = function(keyname){
		console.log(keyname)
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


		socketio.on('question', function(data) {
			vm.questions.push(data);
		})

});