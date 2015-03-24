EspadonApp.controller('LoginController', function LoginController($scope, Flickr, $window)
{
	$scope.loginUrl = Flickr.getLoginUrl('write');
	$scope.screenHeight = $window.innerHeight;
});