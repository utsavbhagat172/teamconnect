angular.module('chatCtrl', ['chatService', 'projectService'])

.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}])

.controller('UserChatController', function(Chat, Auth, socketio, $scope, fileUpload, $route) {

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
				Chat.getProjectFiles(data.project._id).success(function(files){
					data.files=files;
					vm.selectChat(data);
				})
			})
		})
	}

	vm.selectChat = function(chat){
		vm.selectedChat = chat;
		socketio.on('appointment_'+chat.project._id, function(data) {
			vm.selectedChat.appointmentData.push(data);
		})
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

	vm.selectPrivateChatStudent = function(project, user2){
		Auth.getUser()
		.then(function(data) {
			if(!data.data.imgURL){
				data.data.imgURL='https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png';
			}
			var user = data.data;

			var flag = 0;
			var pchat = {};
			var keepgoing = true;
			console.log(user,user2);
			var chatcount = vm.chats.length;			
			angular.forEach(vm.chats, function(e){
				console.log(e)
				console.log('chatCount: ', chatcount--);
				console.log(keepgoing, vm.selectedChat.project,'--------', e.project, project);
				var nos = e.users.length;
				var nof = e.faculties.length;
				console.log(nos, nof)
				console.log(e.users.indexOf(user.id), e.faculties.indexOf(user2._id))

				if(keepgoing && e.name!=vm.selectedChat.project.title && e.project == project){
					console.log('1111111111111111111')
					if(nos == 2 && nof == 0){
						if(e.users.indexOf(user.id) == 0  && e.faculties.indexOf(user2._id) == 0){
							console.log('flagggggggggggggggggggg')
							flag = 1;
							pchat = e;
							console.log(flag)
							console.log(pchat)
							keepgoing = false;
							vm.getChat(e._id)
							console.log(vm.selectedChat)
						}
					}
				}
				console.log('final',flag)
				if(flag==0 && chatcount == 0){
					console.log('create new conv')
					vm.newconv.users=[];
					vm.newconv.faculties=[];
					vm.newconv.project = project;
					vm.newconv.users.push(user.id);
					vm.newconv.users.push(user2._id);
					Chat.createNewChat(vm.newconv).success(function(data){
						console.log(data)
						data.users = [user, user2];
						vm.chats.push(data);
						vm.newconv = {};
						vm.getChat(data._id)
					})
				}
			})

		});
	}


	vm.selectPrivateChatFaculty = function(project, user2){
		Auth.getUser()
		.then(function(data) {
			if(!data.data.imgURL){
				data.data.imgURL='https://cdn1.iconfinder.com/data/icons/mix-color-4/502/Untitled-1-512.png';
			}
			var user = data.data;

			var flag = 0;
			var pchat = {};
			var keepgoing = true;
			console.log(user,user2);
			var chatcount = vm.chats.length;			
			angular.forEach(vm.chats, function(e){
				console.log(e)
				console.log('chatCount: ', chatcount--);
				console.log(keepgoing, e.project.title,'--------', e.project, project);
				var nos = e.users.length;
				var nof = e.faculties.length;
				console.log(nos, nof)
				console.log(e.users.indexOf(user.id), e.faculties.indexOf(user2._id))

				if(keepgoing && e.name!=vm.selectedChat.project.title && e.project == project){
					console.log('1111111111111111111')
					if(nos == 1 && nof == 1){
						if(e.users.indexOf(user.id) == 0  && e.faculties.indexOf(user2._id) == 0){
							console.log('flagggggggggggggggggggg')
							flag = 1;
							pchat = e;
							console.log(flag)
							console.log(pchat)
							keepgoing = false;
							vm.getChat(e._id)
							console.log(vm.selectedChat)
						}
					}
				}
				console.log('final',flag)
				if(flag==0 && chatcount == 0){
					console.log('create new conv')
					vm.newconv.users=[];
					vm.newconv.faculties=[];
					vm.newconv.project = project;
					vm.newconv.users.push(user.id);
					vm.newconv.faculties.push(user2._id);
					Chat.createNewChat(vm.newconv).success(function(data){
						console.log(data)
						data.users = [user];
						data.faculties = [user2];
						vm.chats.push(data);
						vm.newconv = {};
						vm.getChat(data._id)
					})
				}
			})

		});
	}

	vm.uploadFile = function(){
		var file = $scope.myFile;
		console.log(file, vm.selectedChat.project)
		fileUpload.uploadFileToUrl(file, vm.selectedChat.project._id, function(message){
			console.log(message)
			$route.reload();
		});
	}

})


.service('fileUpload', ['$http', 'AuthToken', function ($http, AuthToken) {
	this.uploadFileToUrl = function(file, projectid, callback){
		var fd = new FormData();
		fd.append('projectid', projectid)
		fd.append('file', file);
		console.log(fd)
		$http.post('/api/file-upload', fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function(data){
			callback(data);
 			//$route.reload();
 		})
		.error(function(data){
			callback('error');
 			//$route.reload();
 		});
	}
}]);
