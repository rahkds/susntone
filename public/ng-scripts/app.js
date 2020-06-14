angular.module('User', []);
angular.module('Home', []);
angular.module('Student', []);
angular.module('Subject', []);
angular.module('Faculty', []);

var app = angular.module('test1', [
	//'filters',
	//'directive',
	'Home',
	'User',
	'Student',
	'Subject',
	'Faculty',
	'ngRoute'
]);

var autoclose_popup = 500;
var base_url = 'http://localhost:8081/sunstone/';


app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false,
	});

	$routeProvider.when('/students', {
		controller: 'studentCtrl',
		templateUrl: 'modules/students/views/student.html',
	}).when('/faculties', {
		controller: 'facultyCtrl',
		templateUrl: 'modules/faculties/views/faculty.html',
	}).when('/subjects', {
		controller: 'subjectCtrl',
		templateUrl: 'modules/subjects/views/subject.html',
	}).otherwise({
		redirect: '/'
	});

	// $routeProvider.when('/', {
	// 	controller: 'homeCtrl',
	// 	templateUrl: 'modules/home/views/home.html',
	// }).when('/login', {
	// 	controller: 'loginCtrl',
	// 	templateUrl: 'modules/users/views/login.html',
	// }).when('/userlisting', {
	// 	controller: 'userListingCtrl',
	// 	templateUrl: 'modules/users/views/userlisting.html',
	// }).otherwise({
	// 	redirect: '/'
	// });
}]);


app.run(['$rootScope', function($rootScope) {
	$rootScope.server_url = 'http://localhost:8081/';
}]);