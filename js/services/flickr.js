EspadonApp.service("Flickr",
  function( $http, $q, md5 )
  {

    var base = 'https://api.flickr.com/services/rest/',
    api_key = '555c20bc6b384be1e834326fccda8c55',
    secret = 'e12e3063147c75bc';

    // Return public API.
    return({
        getLoginUrl: getLoginUrl,
        getPhotoSetList: getPhotoSetList,
        getPhotos: getPhotos,
        getPhoto: getPhoto,
        getPhotoInfo: getPhotoInfo,
        getPhotoExif: getPhotoExif,
        getFavorites: getFavorites,
        getAuthToken: getAuthToken,
        getLocation: getLocation,
        getCollections: getCollections,
        findByUsername: findByUsername,
        peopleGetInfo: peopleGetInfo
    });

    function getLoginUrl(perms) {
      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'perms' + perms || '');
      var loginUrl = 'http://flickr.com/services/auth/?api_key='+api_key+'&perms='+perms+'&api_sig='+api_sig;
      return loginUrl;
    }

    function peopleGetInfo( user_id, auth_token) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.people.getInfo'+'nojsoncallback1' + 'user_id' + user_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.people.getInfo',
                                      'nojsoncallback':'1',
                                      'user_id':user_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function findByUsername( username, auth_token) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.people.findByUsername'+'nojsoncallback1' + 'username' + username  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.people.findByUsername',
                                      'nojsoncallback':'1',
                                      'username':username,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function getPhotoSetList( user_id, auth_token ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.photosets.getList'+'nojsoncallback1' + 'user_id' + user_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.photosets.getList',
                                      'nojsoncallback':'1',
                                      'user_id':user_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function getCollections( user_id, auth_token ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.collections.getTree'+'nojsoncallback1' + 'user_id' + user_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.collections.getTree',
                                      'nojsoncallback':'1',
                                      'user_id':user_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function getPhotos( photoset_id, auth_token ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.photosets.getPhotos'+'nojsoncallback1' + 'photoset_id' + photoset_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.photosets.getPhotos',
                                      'nojsoncallback':'1',
                                      'photoset_id':photoset_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function getPhoto( photo_id, auth_token ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.photos.getSizes'+'nojsoncallback1' + 'photo_id' + photo_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.photos.getSizes',
                                      'nojsoncallback':'1',
                                      'photo_id':photo_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function getPhotoInfo( photo_id, auth_token ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.photos.getInfo'+'nojsoncallback1' + 'photo_id' + photo_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.photos.getInfo',
                                      'nojsoncallback':'1',
                                      'photo_id':photo_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function getPhotoExif( photo_id, auth_token ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.photos.getExif'+'nojsoncallback1' + 'photo_id' + photo_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.photos.getExif',
                                      'nojsoncallback':'1',
                                      'photo_id':photo_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    function getFavorites( photo_id, auth_token ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key  + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.photos.getFavorites'+'nojsoncallback1' + 'photo_id' + photo_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.photos.getFavorites',
                                      'nojsoncallback':'1',
                                      'photo_id':photo_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }

    // https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=117335dc4d9dc56362336e672a322645&photo_id=16025706291&format=json&nojsoncallback=1&auth_token=72157650441076998-87a3eba964275326&api_sig=75b8b8fcd26eff67ec4f26413ddd8f6a

    // https://api.flickr.com/services/rest/?api_key=555c20bc6b384be1e834326fccda8c55&api_sig=77aa2c71a5194d4ac85687d06d4ab00a&format=json&method=flickr.photos.geo.getLocation&nojsoncallback=1&photo_id=16025706291

    function getLocation( photo_id, auth_token) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'auth_token' + auth_token + 'formatjson' + 'methodflickr.photos.geo.getLocation'+'nojsoncallback1' + 'photo_id' + photo_id  || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'auth_token':auth_token,
                                      'format':'json',
                                      'method': 'flickr.photos.geo.getLocation',
                                      'nojsoncallback':'1',
                                      'photo_id':photo_id,
                                      'api_sig':api_sig
                                    }});
        return( request.then( handleSuccess, handleError ) );
    }


    function getAuthToken( frob ) {

      var api_sig =  md5.createHash(secret + 'api_key' + api_key + 'formatjson' + 'frob' + frob + 'methodflickr.auth.getTokennojsoncallback1' || '');

        var request = $http.get(base, { params: {
                                      'api_key': api_key,
                                      'format':'json',
                                      'frob':frob,
                                      'method': 'flickr.auth.getToken',
                                      'nojsoncallback':'1',
                                      'api_sig':api_sig
                                    }});
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