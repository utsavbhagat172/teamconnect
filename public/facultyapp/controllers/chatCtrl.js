angular.module('chatCtrl', ['chatService'])


.controller('UserChatController', function(Chat, Auth, socketio) {

	var vm = this;
	vm.newMessage="";
	vm.newschedule="";
	Auth.getUser()
	.success(function(data) {
		vm.user = data;
		socketio.on('new_chat_'+vm.user.id, function(data) {
			vm.chats.push(data);
		})
	});

	Chat.userChats()
	.success(function(data) {
		console.log(data)
		vm.chats = data.chats;
		angular.forEach(vm.chats, function(e){
			socketio.on('chat_message_'+e._id, function(data) {
				console.log('message', data);
				e.messages.push(data);
				if(e._id==vm.selectedChat._id){
					vm.selectedChat.messages = e.messages;
					vm.getChat(e);
				}
			})
		})
	});

	vm.getChat = function(chatid){
		Chat.getChat(chatid).success(function(data){
			Chat.getAppointment(data.project._id).success(function(appointmentData){
				data.appointmentData = appointmentData;
				vm.selectChat(data);
			})
		})
	}

	vm.selectChat = function(chat){
		vm.selectedChat = chat;
		console.log(vm.selectedChat,'hello');
	}

	vm.sendMessage = function(){
		Chat.sendMessage(vm.selectedChat._id,vm.newMessage).success(function(data){
			vm.newMessage="";
			console.log(data)
		})
	}

	vm.scheduleAppointment = function(projectid){
		console.log(vm.appointmentData)
		Chat.scheduleAppointment(projectid, vm.appointmentData.title, vm.appointmentData.schedule).success(function(data){
			console.log(data);
			vm.appointmentData = '';
		})
	}

	vm.rescheduleAppointment = function(id){
		Chat.rescheduleAppointment(id, vm.newschedule).success(function(data){
			console.log(data);
			vm.newschedule="";
		})
	}

	vm.approveAppointment = function(id){
		Chat.approveAppointment(id).success(function(data){
			console.log(data);
		})
	}

	vm.selectPrivateChatStudent = function(user, user2){
		angular.forEach(vm.chats, function(e){
			if(e.name === '' && e.users.indexOf(user2) > -1){
				//open chat
				vm.selectedChat = e;
				$scope.$apply();
			}
			else{
				vm.newconv.users=[];
				vm.newconv.faculties=[];
				vm.newconv.faculties.push(user);
				vm.newconv.users.push(user2);
				Chat.createNewChat(vm.newconv).success(function(data){
					vm.chats.push(data);
					vm.newconv = {};
					vm.selectedChat = data;
					$scope.$apply();
				})
			}
		})
	}

	vm.selectPrivateChatFaculty = function(user, user2){
		angular.forEach(vm.chats, function(e){
			if(e.name === '' && e.faculties.indexOf(user2) > -1){
				//open chat
				vm.selectedChat = e;
				$scope.$apply();
			}
			else{
				vm.newconv.users=[];
				vm.newconv.faculties=[];
				vm.newconv.faculties.push(user);
				vm.newconv.faculties.push(user2);
				Chat.createNewChat(vm.newconv).success(function(data){
					vm.chats.push(data);
					vm.newconv = {};
					vm.selectedChat = data;
					$scope.$apply();
				})
			}
		})
	}

});