'use strict'; 

var main = function() {

	var nav = $('nav');
	var pulldown = $('#nav-pulldown');

	// animates navbar
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