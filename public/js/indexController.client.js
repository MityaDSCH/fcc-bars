'use strict'; 

var main = function() {


	// animates search chevron in and out --------------------------------------------------------
	var search = $('#search');
	var btn = $('#search-button');

	search.keypress(function() {
		if (search.val().length > 0) {
			btn.removeClass('rollOut').addClass('animated rollIn');
		}
	});

	search.focusout(function() {
		if (search.val().length === 0) {
			btn.removeClass('rollIn').addClass('rollOut');
		}
	});

	// animates search chevron hover effect ------------------------------------------------------
	btn.mouseenter(function() {
		$(this).addClass('fa-inverse');
	}).mouseleave(function() {
		$(this).removeClass('fa-inverse');
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

};

var oneStr = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(document).ready(main);