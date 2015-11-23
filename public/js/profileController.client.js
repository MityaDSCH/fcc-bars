'use strict';

var main = function() {

	var apiUrl = window.location.origin + '/api/:id';
	$.get(apiUrl , function( user ) {
	    window.USER = user;
	    $("#profile-name").html('@' + window.USER.github.username);
	    if (typeof callback === 'function') callback();
	});

};

$(document).ready(main);