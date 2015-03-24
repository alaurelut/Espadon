EspadonApp.controller('FullScreenController', function FullScreenController($scope, userService, $routeParams, Flickr, $window, preloader)
{

	$scope.isLoading = true;
    $scope.isSuccessful = false;
    $scope.percentLoaded = 0;

    $scope.photo = [];



	$scope.screenHeight = $window.innerHeight;
	$scope.screenWidth = $window.innerWidth;
	$scope.showExif = false;
	$scope.showInfo = false;

	
	$scope.displayInfo = function () {
		$scope.showInfo = !$scope.showInfo;
		console.log($scope.showInfo);
	}

	Flickr
	.getPhoto( $routeParams.photoId, userService.auth_token )
	.then(function(data) {

		$scope.sizes = data.sizes.size;

		angular.forEach($scope.sizes, function(value, key) {
		  	if ($scope.screenWidth >= value.width ) {
		  		$scope.photo[0] = value.source;
			};
		});


    // Preload the images; then, update display when returned.
    preloader.preloadImages( $scope.photo ).then(
        function handleResolve( imageLocations ) {

            // Loading was successful.
            $scope.isLoading = false;
            $scope.isSuccessful = true;

            console.info( "Preload Successful" );

        },
        function handleReject( imageLocation ) {

            // Loading failed on at least one image.
            $scope.isLoading = false;
            $scope.isSuccessful = false;

            console.error( "Image Failed", imageLocation );
            console.info( "Preload Failure" );

        },
        function handleNotify( event ) {

            $scope.percentLoaded = event.percent;

            console.info( "Percent loaded:", event.percent );

        }
    );

	})
	.then(function() {
		return Flickr.getPhotoInfo( $routeParams.photoId, userService.auth_token );
	})
	.then(function(data) {
		
		$scope.infos = data.photo;
		$scope.infos.urls.url

		angular.forEach($scope.infos.urls.url, function(value, key) {
		  		$scope.url = value._content;
		});
		
		return Flickr.getPhotoExif( $routeParams.photoId, userService.auth_token );
	})
	.then(function(data) {
		$scope.exifs = data.photo;

		angular.forEach($scope.exifs.exif, function(value, key) {

			if (value.label == "Aperture") {
				$scope.Aperture = value.raw._content;
			}
			if (value.label == "Exposure") {
				$scope.Exposure = value.raw._content;
			}
			if (value.label == "Flash") {
				$scope.Flash = value.raw._content;
			}
			if (value.label == "Focal Length") {
				$scope.FocalLength = value.raw._content;
			}
			if (value.label == "ISO Speed") {
				$scope.ISO = value.raw._content;
			}
			
		});

		return Flickr.getFavorites( $routeParams.photoId, userService.auth_token );
	})
	.then(function(data) {
		$scope.faves = data.photo.total;
		return Flickr.getLocation( $routeParams.photoId, userService.auth_token );
	})
	.then(function(data) {

		$scope.mapLongitude = data.photo.location.longitude;
		$scope.mapLatitude = data.photo.location.latitude;
		$scope.mapZoom = data.photo.location.accuracy;
		$scope.locality = data.photo.location.locality._content;

	});

});