var EspadonApp = angular.module('EspadonApp', ['ngResource','ngRoute','angular-md5', 'ngMap']);

EspadonApp.config(function($routeProvider, $httpProvider, $locationProvider) {

  $routeProvider.
      when('/login', {
        controller: 'LoginController',
        templateUrl: 'views/login.html'
      }).
      when('/map', {
        controller: 'MapController',
        templateUrl: 'views/map.html'
      }).
      when('/grid', {
        controller: 'GridController',
        templateUrl: 'views/grid.html'
      }).
      when('/fullscreen/:photoId', {
        controller: 'FullScreenController',
        templateUrl: 'views/fullscreen.html'
      }).
      when('/collection', {
        controller: 'CollectionController',
        templateUrl: 'views/collection.html'
      }).
       when('/backOffice', {
        controller: 'BackOfficeController',
        templateUrl: 'views/backOffice.html'
      }).
        when('/about', {
        controller: 'AboutController',
        templateUrl: 'views/about.html'
      }).
       when('/backOffice/create', {
        controller: 'CreateController',
        templateUrl: 'views/create.html'
      })
      .otherwise({ redirectTo: "/login" });
});