angular.module('chatCtrl', ['chatService'])


.controller('ProfessionalChatController', function(Chat, Auth, socketio) {


	var vm = this;

	Auth.getUser()
	.success(function(data) {
		vm.prof = data;
		socketio.on('set_nickname_'+vm.prof.id, function(data) {
			vm.chats.push(data);
		})
	});

	Chat.professionalChats()
	.success(function(data) {
		vm.chats = data;
		console.log('chats',vm.chats);
		angular.forEach(vm.chats, function(e){
			socketio.on('send_message_'+e._id, function(data) {
				e.messages.push(data);
				if(e._id==vm.selectedChat._id){
					vm.selectedChat = e;
				}
			})
		})
	});

	vm.selectChat = function(chat){
		vm.selectedChat = chat;
	}

	vm.sendMessage = function(){
		Chat.sendMessage(vm.selectedChat._id,vm.chatData.message).success(function(data){

		})
	}
		/*vm.createQuestion = function() {

			vm.processing = true;

   
			vm.message = '';
			Question.createQuestion(vm.questionData)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.questionData = {};

					vm.message = data.message;

					
				});

			};*/

			

		})

.controller('UserChatController', function(Chat, Auth, socketio) {

	var vm = this;

	Auth.getUser()
	.success(function(data) {
		vm.user = data;
		socketio.on('set_nickname_'+vm.user.id, function(data) {
			vm.chats.push(data);
		})
	});

	Chat.userChats()
	.success(function(data) {
		vm.chats = data;
		angular.forEach(vm.chats, function(e){
			socketio.on('send_message_'+e._id, function(data) {
				e.messages.push(data);
				if(e._id==vm.selectedChat._id){
					vm.selectedChat = e;
				}
			})
		})
	});

	vm.selectChat = function(chat){
		vm.selectedChat = chat;
	}

	vm.sendMessage = function(){
		Chat.sendMessage(vm.selectedChat._id,vm.chatData.message).success(function(data){

		})
	}


		/*vm.createQuestion = function() {

			vm.processing = true;

   
			vm.message = '';
			Question.createQuestion(vm.questionData)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.questionData = {};

					vm.message = data.message;

					
				});

			};*/

			socketio.on('question', function(data) {
				vm.questions.push(data);
			})

		});