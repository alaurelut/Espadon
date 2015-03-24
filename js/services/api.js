EspadonApp.service("Api",
  function( $http, $q )
  {

    // Return public API.
    return({
        postCreateSpace: postCreateSpace,
        postCreateUser: postCreateUser,
        getUser: getUser,
        postPartners: postPartners,
        postCollections: postCollections,
        postAlbums: postAlbums,
        getSpaces: getSpaces,
        getPartners: getPartners,
        getCollections: getCollections,
        getAlbums: getAlbums
    });

    function postCreateSpace( id_user, name, color, description ) {

        var request = $http.post("api/1/space", {
                                      'id_user': id_user,
                                      'name':name,
                                      'color':color,
                                      'description': description
                                    });
        return( request.then( handleSuccess, handleError ) );
    }

    function getSpaces( id_user ) {

        var request = $http.get("api/1/spaces", {
                                      'id_user': id_user
                                    });
        return( request.then( handleSuccess, handleError ) );
    }

    function postPartners( id_space, name, activity, photo, url_flickr, username ) {

        var request = $http.post("api/1/partner", {
                                      'id_space': id_space,
                                      'name':name,
                                      'function':activity,
                                      'photo': photo,
                                      'url_flickr':url_flickr,
                                      'username': username
                                    });
        return( request.then( handleSuccess, handleError ) );
    }

    function getPartners( id_space ) {

        var request = $http.get("api/1/partners/"+id_space);
        return( request.then( handleSuccess, handleError ) );
    }

    function getCollections( id_space ) {

        var request = $http.get("api/1/collections/"+id_space);
        return( request.then( handleSuccess, handleError ) );
    }

    function getAlbums( id_space ) {

        var request = $http.get("api/1/albums/"+id_space);
        return( request.then( handleSuccess, handleError ) );
    }


    function postCollections( id_space, id_flickr, color ) {

        var request = $http.post("api/1/collection", {
                                      'id_space': id_space,
                                      'id_flickr':id_flickr,
                                      'color':color
                                    });
        return( request.then( handleSuccess, handleError ) );
    }

    function postAlbums( id_flickr, id_collection ) {

        var request = $http.post("api/1/album", {
                                      'id_flickr':id_flickr,
                                      'id_parent':id_collection
                                    });
        return( request.then( handleSuccess, handleError ) );
    }

    function postCreateUser( id_flickr, username, email ) {

        var request = $http.post("api/1/user", { 
                                      'id_flickr': id_flickr,
                                      'username':username,
                                      'email':email
                                    });
        return( request.then( handleSuccess, handleError ) );
    }

    function getUser( id_flickr ) {

        var request = $http.get("api/1/user/"+id_flickr);

        return( request.then( handleSuccess, handleError ) );
    }

    function handleSuccess( response ) {
          return( response.data );
    }

    function handleError( response ) {

        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
            ) {

            return( $q.reject( "An unknown error occurred." ) );

        }

        // Otherwise, use expected error message.
        return( $q.reject( "An known error occurred." ) );

    }

  }
);