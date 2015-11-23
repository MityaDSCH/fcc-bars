'use strict';

var main = function() {

	var apiUrl = appUrl + '/api/:id';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      
	    var user = JSON.parse(data);
	    window.USER = user;
	    console.log(window.USER);
	   	$("#profile-name").html('@' + window.USER.github.username);

   }));

};

$(document).ready(main);