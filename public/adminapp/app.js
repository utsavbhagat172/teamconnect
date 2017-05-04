angular.module('AdminApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 
						 'facultyCtrl', 'facultyService', 'questionCtrl', 'questionService',
						 'chatCtrl', 'chatService', 'profileCtrl', 'profileService',
             'angularMoment', 'projectCtrl', 'projectService'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})

.directive('ngScrollBottom', function () {
  return {
    scope: {
      ngScrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('ngScrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
})