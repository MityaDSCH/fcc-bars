'use strict';

var main = function() {

	var apiUrl = window.location.origin + '/api/:id';
	$.get(apiUrl , function( user ) {
	    window.USER = user;
	    console.log(user);
	    $("#profile-name").html('@' + window.USER.github.username);

	    if (typeof callback === 'function') callback();

		    if (user.goingToday.length > 0) {
		    user.goingToday.forEach(function(business) {
				if (typeof business.img !== 'undefined') {
					$('#result-container').append("<div class='result hide-init' id='" + business.barId + "'>" + 
							"<div class='img-container'>" +
								"<img class='res-img' src='" + business.img.replace('/ms', '/l') + "'/>" +
								"<div class='img-modal'></div>" +
								"<span class='business-title'><a href='" + business.url+ "'><h3>" + business.name + "</h3></a></span>" +
								"<span class='business-info'><p>" + business.desc + "</p></span>" +
								"<span class='cover'></span>" +
								"<div class='going-btn'>Going?</div>" +
							"</div>" +
						"</div>");
				}
			});
			// fade in results
			$('.result').each(function(index, ele) {
				setTimeout(function() {
					$(ele).addClass('fadeInUp animated');
				}, index*60);
			});

		} else {
			$('#result-container').append('<h1>Nothing Planned Today!');
		}

	});



};

$(document).ready(main);