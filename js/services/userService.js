'use strict';

EspadonApp.service('userService', function($rootScope, localStorage) {

  var LOCAL_STORAGE_ID = 'fmUser',
      userString = localStorage[LOCAL_STORAGE_ID];

  var user = userString ? JSON.parse(userString) : {
    id: undefined,
    auth_token: undefined,
    albums: undefined,
    user:undefined,
    api_id:undefined
  };

  $rootScope.$watch(function() { return user; }, function() {
    localStorage[LOCAL_STORAGE_ID] = JSON.stringify(user);
  }, true);

  return user;
});