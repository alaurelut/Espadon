EspadonApp.controller('GridController', function GridController($scope, userService, $location, $routeParams, Flickr, $q, preloader)
{

	$scope.isLoading = true;
    $scope.isSuccessful = false;
    $scope.percentLoaded = 0;

	if (!userService.albums) {

		Flickr
		.getPhotoSetList( userService.id, userService.auth_token )
		.then(function(data) {

			var promises = [];

			angular.forEach(data.photosets.photoset, function(value, key) {
				promises.push( Flickr.getPhotos( value.id, userService.auth_token ) ); 
			});

			$q.all(promises).then(function (result) {
				$scope.albums = result;
				userService.albums = result;

			    // Preload the images; then, update display when returned.
			    preloader.preloadImages( $scope.albums ).then(
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
			});
		});

	}
	else
	{
		$scope.albums = userService.albums;
		$scope.isLoading = false;
        $scope.isSuccessful = true;
	}

});