'use strict'; 

var main = function() {

	// animates search chevron in and out --------------------------------------------------------
	var search = $('#search');
	var btn = $('#search-button');

	search.keyup(function() {
		if (search.val().length > 0) {
			btn.removeClass('rollOut').addClass('animated rollIn');
		}
		if (search.val().length === 0 && btn.hasClass('rollIn')) {
			btn.removeClass('rollIn').addClass('rollOut');
		}
	});

	search.focusout(function() {
		if (search.val().length === 0) {
			btn.removeClass('rollIn').addClass('rollOut');
		}
	});

	// animates search chevron hover effect ------------------------------------------------------
	btn.mouseenter(function() {
		if (!$(this).hasClass('fa-spin')) {
  		$(this).addClass('fa-inverse');
		}
	}).mouseleave(function() {
		if (!$(this).hasClass('fa-spin')) {
			$(this).removeClass('fa-inverse');
		}
	});

	// animates navbar ---------------------------------------------------------------------------
	var nav = $('nav');
	var pulldown = $('#nav-pulldown');

	pulldown.mouseenter(function() {
		$(this).addClass('fa-inverse');
	}).mouseleave(function() {
		$(this).removeClass('fa-inverse');
	}).click(function() {
		$(this).removeClass('bounceInDown').addClass('bounceOutUp');
		setTimeout(function() {
			nav.removeClass('slideOutUp').addClass('slideInDown animated');
		}, 500);
	});

	$(document).mouseup(function(e) {
		if (!nav.is(e.target) && nav.has(e.target).length === 0 && nav.hasClass('slideInDown')) {
			nav.removeClass('slideInDown').addClass('slideOutUp');
			setTimeout(function() {
				pulldown.removeClass('bounceOutUp').addClass('bounceInDown');
			}, 300);
		}
	});

	// registers enter and chevron click to api request ------------------------------------------
	$(document).keypress(function(e) {
	   if (e.which == 13 && search.val().length > 0 && search.is(":focus")) {
	     searchYelp(search.val().replace(' ', '+'));
	   }
	});

	btn.click(function() {
		if (search.val().length > 0) {
			searchYelp(search.val());
		}
	});

	// search yelp function ------------------------------------------------------------------------

	function searchYelp(str) {

		// remove chevron and add spinner
		btn.removeClass('rollIn fa-chevron-right').addClass('fa-circle-o-notch fa-spin fa-inverse');

		var loc = str.replace(' ', '+');
		ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', '/api/yelp/' + loc, function(data) {
			var result = JSON.parse(data);
			console.log(result);
			btn.removeClass('fa-spin rollIn').addClass('fadeOutUp');
		}));
	  
	}

};

var oneStr = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(document).ready(main);