angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 
						 'projectCtrl', 'projectService', 'chatCtrl', 'chatService','angularMoment'])

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