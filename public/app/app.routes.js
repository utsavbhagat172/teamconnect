angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: '/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/professionalHome', {
			templateUrl: '/views/pages/professionalHome.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: '/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: '/views/pages/signup.html'
		})
		.when('/verifyotp/:id', {
			templateUrl: '/views/pages/verifyotp.html'
		})
		.when('/profile', {
			templateUrl: '/views/pages/profile.html'
		})
		.when('/createProject', {
			templateUrl: '/views/pages/createProject.html'
		})
		.otherwise({redirectTo : '/'})

	$locationProvider.html5Mode(true);

})