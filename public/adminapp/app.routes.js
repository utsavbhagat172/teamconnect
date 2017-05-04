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
		.when('/students', {
			templateUrl: '/views/pages/users.html'
		})
		.when('/faculties', {
			templateUrl: '/views/pages/faculties.html'
		})
		.when('/admins', {
			templateUrl: '/views/pages/admins.html'
		})
		.when('/projects', {
			templateUrl: '/views/pages/projects.html'
		})
		.when('/faculty/:id', {
			templateUrl: '/views/pages/facultyHome.html'
		})
		.when('/student/:id', {
			templateUrl: '/views/pages/userHome.html'
		})
		.when('/admin/:id', {
			templateUrl: '/views/pages/adminHome.html'
		})
		.when('/profile', {
			templateUrl: '/views/pages/profile.html'
		})

		

	$locationProvider.html5Mode(true);

})