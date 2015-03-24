EspadonApp.controller('CreateController', function CreateController($scope, userService, $location, $routeParams, Flickr, $q, Api)
{

	$scope.step = 1;
	$scope.espace = {
		'collections':[],
		'partners' :  [{},{}]
	};
	

	Flickr
	.getCollections( userService.id, userService.auth_token )
	.then(function(data) {
		$scope.collections = data.collections.collection;
	});

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
 		$scope.espace.partners.push({});
    };
	$scope.delete_people = function()
 	{
 		$scope.espace.partners.splice(-1,1);
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

    $scope.create_space = function(espace) {

		Api
		.postCreateSpace( userService.api_id, espace.name, espace.color, espace.description)
		.then(function(data) {

			$scope.space_id = data.data.id;
			var promises = [];

			angular.forEach(espace.partners, function(value, key) {
				if ( value.name != undefined && value.activity != undefined && value.photo != undefined && value.url_flickr != undefined && value.username != undefined )
				promises.push( Api.postPartners($scope.space_id, value.name, value.activity, value.photo, value.url_flickr,  value.username ) ); 
			});

			angular.forEach(espace.collections, function(value, key) {
				promises.push( Api.postCollections($scope.space_id, value.idflickr, value.color) ); 
			});

			$q.all(promises)
			.then(function (result) {

				var promises = [];

				angular.forEach(result, function(collection_api_return, key) {

					angular.forEach(espace.collections, function(collection, cle) {
						if (collection_api_return.data.id_flickr ==  collection.idflickr ) {

							angular.forEach(collection.albums, function(subvalue, key) {
								promises.push( Api.postAlbums( subvalue.idflickr, collection_api_return.data.id) ); 
							});
						}
					});
				});
				
				$q.all(promises)
				.then(function () {
					$location.url('/backOffice');
				});
			});
		});
    };

});