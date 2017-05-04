angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: '/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: '/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: '/views/pages/signup.html'
		})
		.when('/profile', {
			templateUrl: '/views/pages/profile.html'
		})

	$locationProvider.html5Mode(true);

})