angular.module('chatCtrl', ['chatService', 'projectService'])


.controller('UserChatController', function(Chat, Auth, socketio, $scope) {

	var vm = this;
	vm.newMessage="";
	vm.newschedule="";
	vm.newconv={};
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

	vm.sendInvite = function(projectid, chatid){
		Chat.sendInvite(projectid, chatid, vm.inviteData.email, vm.inviteData.role).success(function(data){
			console.log(data);
			vm.inviteData = '';
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

	vm.selectPrivateChatStudent = function(projectid, user2){
		Auth.getUser()
		.then(function(data) {
			if(!data.data.imgURL){
				data.data.imgURL='https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png';
			}
			var user = data.data;
			console.log(user)
			var flag = 0;
			var pchat = {};
			var keepgoing = true;
			console.log(user,user2)
			angular.forEach(vm.chats, function(e){
				console.log('foreach')
				console.log(keepgoing)
				if(keepgoing){
					var nos = e.users.length;
					var nof = e.faculties.length;
					if(nos == 2 && nof == 0){
						if(e.users.indexOf(user.id) != -1  && e.users.indexOf(user2._id) != -1){
							flag = 1;
							pchat = e;
							console.log(flag)
							console.log(pchat)
							keepgoing = false;
							vm.selectedChat = e;
							console.log(vm.selectedChat)
						}
						else{
							console.log(flag)
							flag=0;
						}
					}

				}
			})
			if(flag==0){
				console.log('create new conv')
				vm.newconv.users=[];
				vm.newconv.faculties=[];
				vm.newconv.projectid = projectid;
				vm.newconv.users.push(user.id);
				vm.newconv.users.push(user2._id);
				Chat.createNewChat(vm.newconv).success(function(data){
					console.log(data)
					vm.chats.push(data);
					vm.newconv = {};
					vm.selectedChat = data;
				})
			}
		});
	}

	vm.selectPrivateChatFaculty = function(projectid, user2){
		Auth.getUser()
		.then(function(data) {
			if(!data.data.imgURL){
				data.data.imgURL='https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png';
			}
			var user = data.data;

			var flag = 0;
			var pchat = {};
			var keepgoing = true;
			console.log(user,user2)
			angular.forEach(vm.chats, function(e){
				console.log('foreach')
				if(keepgoing){
					var nos = e.users.length;
					var nof = e.faculties.length;
					if(nos == 1 && nof == 1){
						if(e.users.indexOf(user.id) != -1  && e.faculties.indexOf(user2._id) != -1){
							flag = 1;
							pchat = e;
							console.log(flag)
							console.log(pchat)
							keepgoing = false;
							vm.selectedChat = e;
							console.log(vm.selectedChat)
						}
						else{
							console.log(flag)
							flag=0;
						}
					}

				}
			})
			if(flag==0){
				console.log('create new conv')
				vm.newconv.users=[];
				vm.newconv.faculties=[];
				vm.newconv.projectid = projectid;
				vm.newconv.users.push(user.id);
				vm.newconv.faculties.push(user2._id);
				Chat.createNewChat(vm.newconv).success(function(data){
					console.log(data)
					vm.chats.push(data);
					vm.newconv = {};
					vm.selectedChat = data;
				})
			}
		});
	}

});