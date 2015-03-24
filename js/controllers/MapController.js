EspadonApp.controller('MapController', function MapController($scope, userService, $routeParams, Flickr, $window, $q, $location)
{
	
	$scope.screenHeight = $window.innerHeight;

	angular.element($window).bind('resize', function() {
		console.log('resize');
            $scope.screenHeight = $window.innerHeight;
            console.log($scope.screenHeight);
    });

    $scope.dynMarkers = [];

    $scope.$on('mapInitialized', function(event, evtMap) {

		map = evtMap;

		Flickr
		.getPhotoSetList( userService.id , userService.auth_token )
		.then(function(data) {

			var promises = [];

			angular.forEach(data.photosets.photoset, function(value, key) {
				promises.push( Flickr.getPhotos( value.id, userService.auth_token ) ); 
			});

			$q.all(promises)
			.then(function (result) {
				$scope.albums = result;
				userService.albums = result;
			})
			.then(function (result) {

				var promises = [];

				angular.forEach($scope.albums, function(value, key) {
					angular.forEach(value.photoset.photo, function(value, key) {
						promises.push( Flickr.getLocation( value.id , userService.auth_token  ) ); 
					});
				});

				$scope.markers = [];

				$q.all(promises).then(function (result) {

					angular.forEach(result, function(value, key) {
						if (value.photo) {
							$scope.markers.push(value.photo);
						};
					});


					var promises2 = [];

					angular.forEach($scope.markers, function(value, key) {
						promises2.push( Flickr.getPhoto( value.id , userService.auth_token  ) ); 
					});

					$q.all(promises2)
					.then(function (result) {
						var i = 0;
						angular.forEach(result, function(value, key) {
							console.log($scope.markers[i]);
							console.log(value.sizes.size[0].source);
							var latLng = new google.maps.LatLng($scope.markers[i].location.latitude, $scope.markers[i].location.longitude );

							var currentMarker = new google.maps.Marker({
								position:latLng,
								icon:{
							       url: value.sizes.size[0].source,
							       size:new google.maps.Size(64,64)

		   						 //    fillColor: 'yellow',
								    // fillOpacity: 0.8,
								    // scale: 10,
								    // strokeColor: 'gold',
								    // strokeWeight: 5,
						      //   	path: google.maps.SymbolPath.CIRCLE
							   },
							   optimized	:false,
							   id: $scope.markers[i].id
							    
							});


							// Add Markers
							$scope.dynMarkers.push(currentMarker);

							// Marker Click Event
							google.maps.event.addListener(currentMarker, 'click', function( event ) {

								$location.url('/fullscreen/'+ this.id);
								$scope.$apply();

							});

							i++;
						});
					
					})
					.then(function () {
						// Add markerClusterer
						$scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});

						// markerClusterer Click Event
						google.maps.event.addListener($scope.markerClusterer, 'click', function() {
						    console.log('markerClusterer click');
						});

						// I create an OverlayView, and set it to add the "markerLayer" class to the markerLayer DIV
					     var myoverlay = new google.maps.OverlayView();
					     myoverlay.draw = function () {
					         this.getPanes().markerLayer.id='markerLayer';
					     };
					     myoverlay.setMap(map);
					});

				});
			});
		});

		

    });

    $scope.styles = [ { 
					  'featureType': 'water', 
					  'stylers': [ { 
					    'color': '#d1d1d1' } 
					    ] 
					  },{ 
					  'featureType': 'landscape', 
					  'elementType': 'geometry', 
					  'stylers': [ { 
					    'color': '#aeaeae' } 
					   ] 
					  },{ 
					  'featureType': 'administrative', 
					  'elementType': 'labels.text.fill', 
					  'stylers': [ { 
					    'color': '#000000' } 
					    ] 
					  },{ 
					  'featureType': 'administrative', 
					  'elementType': 'labels.text.stroke', 
					  'stylers': [ { 
					    'visibility': 'simplified' } 
					    ] 
					  },{ 
					  'featureType': 'road', 
					  'elementType': 'geometry', 
					  'stylers': [ { 
					    'color': '#c1c1c1' } 
					    ] 
					  },{ 
					  'featureType': 'poi', 
					  'elementType': 'geometry.fill', 
					  'stylers': [ { 
					    'color': '#aeaeae' }, { 
					    'visibility': 'simplified' } 
					    ] 
					  },{ 
					  'featureType': 'administrative.province', 
					  'stylers': [ { 
					    'color': '#000000' } 
					    ] 
					  },{ 
					  'featureType': 'road', 
					  'elementType': 'geometry.stroke', 
					  'stylers': [ { 
					    'color': '#d1d1d1' }, { 
					    'weight': 2 }, { 
					    'visibility': 'off' } 
					    ] 
					  },{ 
					  'featureType': 'administrative.locality', 
					  'stylers': [ { 
					    'color': '#000000' } 
					    ] 
					  },{ 
					  'featureType': 'road.highway', 
					  'elementType': 'labels', 
					  'stylers': [ { 
					    'visibility': 'off' } 
					    ] 
					  },{
					  'featureType': 'poi', 
					  'stylers': [ { 
					    'visibility': 'off' } 
					    ] 
					  },{ 
					  'featureType': 'transit', 
					  'stylers': [ { 
					    'visibility': 'off' } 
					    ] 
					  }
					];

});
