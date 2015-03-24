EspadonApp.controller('BackOfficeController', function BackOfficeController($scope, userService, $location, $routeParams, Flickr, $q, Api)
{

	$scope.currentSpace;
	
	// if you just logged in
	if ($routeParams.frob && !userService.auth_token)
	{
		Flickr
		.getAuthToken( $routeParams.frob )
		.then(function(data) {

			userService.user = data.auth.user;
			userService.id = data.auth.user.nsid;
			userService.auth_token = data.auth.token._content;

			$scope.user = userService.user;

			return Api.getUser(userService.id);

		})
		.then(function(data) {
			// if user already have an account
			if (data.code == 200) {
				
				userService.api_id = data.data.id;

				Api
				.getSpaces( userService.api_id )
				.then(function(data) {
					// console.log(data);
					$scope.espaces = data.data;
				});
			}
			// Create user
			else
			{
				Api
				.postCreateUser( userService.id,  userService.user.username, 'email' )
				.then(function(data) {
					$scope.retour = data;
					userService.api_id = data.data.id;
					$location.url('/backOffice/create');
				});
			}
		});

	}
	// if you are already logged in
	else
	{
		$scope.user = userService.user;

		Api.getUser(userService.id)
		.then(function(data) {
			if (data.code == 200) {
				userService.api_id = data.data.id;

				Api
				.getSpaces( userService.api_id )
				.then(function(data) {

					$scope.espaces = data.data;

					$scope.espaces.partners = [];
					$scope.espaces.collections = [];

					angular.forEach($scope.espaces, function(espace, key) {
						$scope.espaces.partners.push( Api.getPartners( espace.id ) );
						$scope.espaces.collections.push( Api.getCollections( espace.id ) );
					});

					
					$q.all($scope.espaces.partners)
					.then(function (result) {

						console.log('partners');
						console.log(result);

						angular.forEach(result, function(partners, key) {

							$scope.espaces[key].partners = [];

							angular.forEach(partners.data, function(partner, cle) {
								$scope.espaces[key].partners.push(partner);
							});
						});
					});

					$q.all($scope.espaces.albums)
					.then(function (result) {

						console.log('albums');
						console.log(result);

						angular.forEach(result, function(albums, key) {

							$scope.espaces[key].albums = [];

							angular.forEach(albums.data, function(partner, cle) {
								$scope.espaces[key].albums.push(partner);
							});
						});
					});

					$q.all($scope.espaces.collections)
					.then(function (result) {

						console.log('collections');
						console.log(result);

						angular.forEach(result, function(collections, key) {

							$scope.espaces[key].collections = [];

							angular.forEach(collections.data, function(partner, cle) {
								$scope.espaces[key].collections.push(partner);
							});
						});
					});



				});
			}
		});
	}

	$scope.change = function(partner)
 	{
 		Flickr
		.findByUsername( partner.username , userService.auth_token )
		.then(function(data) {
			return Flickr.peopleGetInfo( data.user.nsid, userService.auth_token );
		})
		.then(function(data) {
			partner.url_flickr = data.person.profileurl._content;
			partner.photo = "http://farm"+data.person.iconfarm+".staticflickr.com/"+data.person.iconserver+"/buddyicons/"+data.person.nsid+"_l.jpg";
		});
    };


	$scope.add_people = function()
 	{
 		$scope.currentSpace.partners.push({});
    };
	$scope.delete_people = function()
 	{
 		$scope.currentSpace.partners.splice(-1,1);
    };

    $scope.changeCurrentSpace = function(espace, name ) {
    	$scope.currentSpace = espace;
    	$scope.currentSpaceName = name;

    };

    $scope.logOut = function() {
        userService.id = undefined;
        userService.albums = undefined;
        userService.auth_token = undefined;
        userService.user = undefined;
        $location.url('/login');
    };

    $scope.openedCollection = {};

	$scope.openCollection = function(idflickr, title) {
		$scope.openedCollection.idflickr = idflickr;
		$scope.openedCollection.title = title;
    };

    $scope.pushAlbum = function(idflickr, title, album, collection) {

    	var collectionAlreadyThere = false;
    	$scope.collectionKey;
    	$scope.albumKey;
    	var albumAlreadyThere = false;
    	
    	angular.forEach($scope.espace.collections, function(value, key) {
			if (value.idflickr == $scope.openedCollection.idflickr) {
				collectionAlreadyThere = true;
				$scope.collectionKey = key;
			};
		});

    	if (collectionAlreadyThere === false) {
    		$scope.espace.collections.push({'idflickr':$scope.openedCollection.idflickr, 'title':$scope.openedCollection.title, 'albums': []});
    		collection.active = true;

    		angular.forEach($scope.espace.collections, function(value, key) {
				if (value.idflickr == $scope.openedCollection.idflickr) {
					$scope.collectionKey = key;
				};
			});
    	};

		angular.forEach($scope.espace.collections[$scope.collectionKey].albums, function(value, key) {
			if (value.idflickr == idflickr) {
				albumAlreadyThere = true;
				$scope.espace.collections[$scope.collectionKey].albums.splice(key,1);
				album.active = false;
				$scope.albumKey = key;
			};
		});

		if (albumAlreadyThere === false) {
			$scope.espace.collections[$scope.collectionKey].albums.push({'idflickr':idflickr,'title':title});

			album.active = true;

			angular.forEach($scope.espace.collections[$scope.collectionKey].albums, function(value, key) {
				if (value.idflickr == idflickr) {
					$scope.albumKey = key;
				};
			});
		}
		else
		{
			if ($scope.espace.collections[$scope.collectionKey].albums.length == 0 ) {
				$scope.espace.collections.splice($scope.collectionKey,1);
				collection.active = false;
			};
		}
    };

    $scope.openColorBlock = function(collection) {
		$scope.currentCollection = collection;
		$scope.colorBlock = true;
    };

    $scope.changeColor = function(color) {
		$scope.currentCollection.color = color;
		$scope.colorBlock = false;

    };

});