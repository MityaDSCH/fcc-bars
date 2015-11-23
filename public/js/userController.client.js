'use strict';

(function () {

   var apiUrl = appUrl + '/api/:id';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      
      var user = JSON.parse(data);
      window.USER = user;
      console.log(window.USER);
      $('#username-display').text('Hello ' + (typeof user.github.username === 'undefined' ? 'Stranger' : user.github.username));

   }));

})();
