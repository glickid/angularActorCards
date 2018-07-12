

var actorApp = angular.module("actorApp", ["ngRoute"]);

actorApp.config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl : 'home.html',
      controller : 'homeCtrl'
    })
    .when('/actresses', {
        templateUrl : 'actresses.html',
        controller : 'actorCtrl'
    })
    .when('/moviesgallery', {
        templateUrl : 'moviesGallery.html',
        controller : 'moviesCtrl'
    })
    .otherwise({redirectTo: '/'
    });
});