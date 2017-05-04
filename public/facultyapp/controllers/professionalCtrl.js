angular.module('professionalCtrl', ['professionalService'])


	.controller('ProfessionalController', function(User, Professional) {


		var vm = this;

		Professional.all()
			.success(function(data) {
				vm.professionals = data;
			})

		User.all()
			.success(function(data) {
			vm.users = data;
		})


		/*vm.createStory = function() {

			vm.processing = true;

   
			vm.message = '';
			Professional.create(vm.storyData)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.storyData = {};

					vm.message = data.message;

					
				});

		};*/

		/*socketio.on('story', function(data) {
			vm.stories.push(data);
		})*/

})

