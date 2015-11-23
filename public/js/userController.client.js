'use strict';

(function () {

   var apiUrl = appUrl + '/api/:id';

   $.get(apiUrl , function( user ) {
      window.USER = user;
      console.log(window.USER);
      $('#username-display').text('Hello ' + (typeof user.github.username === 'undefined' ? 'Stranger' : user.github.username));
   });

})();
