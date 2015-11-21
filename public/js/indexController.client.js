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
		// seatr search
		if (search.val().length > 0 && btn.hasClass('fa-chevron-right')) {
			searchYelp(search.val());
		}
		// clear search results
		if (btn.hasClass('fa-times')) {
			resetResults();
		}
	});

	// clear yelp search results -------------------------------------------------------------------
	function resetResults() {

		search.attr('readOnly', false).val('');
		btn.removeClass('rollIn').addClass('rollOut');
		$('.result').each(function(index) {
			var ele = $(this);
			setTimeout(function() {
				ele.addClass('fadeOutLeft');
			},index*60);
		});
		setTimeout(function() {
			$('#result-container').html('').css('display', 'none');
			$('#search-container').removeClass('to-top');
			$('body').css('align-items', 'center');
			btn.removeClass('fa-times').addClass('fa-chevron-right');
		}, 1500);
	}

	// search yelp function ------------------------------------------------------------------------

	function searchYelp(str) {

		var result = {};

		// remove chevron and add spinner
		btn.removeClass('rollIn fa-chevron-right').addClass('fa-circle-o-notch fa-spin fa-inverse');

		var loc = str.replace(' ', '+');
		ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', '/api/yelp/' + loc, function(data) {

			var result = JSON.parse(data);
			console.log(result);

			if (result.businesses !== undefined) {

				search.attr('readOnly', true);
				$('#result-container').css('display', 'flex');

				// set search bar
				btn.removeClass('fa-spin rollIn').addClass('fadeOutUp');
				setTimeout(function() {
					btn.removeClass('fa-circle-o-notch fa-inverse').addClass('rollIn fa-times');
				}, 1000);

				// send search bar to top of page
				$('#search-container').addClass('to-top');

				// append results
				setTimeout(function() {
					result.businesses.forEach(function(business) {
						$('#result-container').append("<div class='result hide-init'>" + 
								"<div class='img-container'>" +
									"<img class='res-img' src='" + business.image_url.replace('/ms.jpg', '/l.jpg') + "'/>" +
									"<div class='img-modal'></div>" +
									"<span class='business-title'><h3>" + business.name + "</h3>" + "</span>" +
									"<span class='business-info'><p>" + business.snippet_text + "</p></span>" +
									"<span class='cover'></span>" +
								"</div>" +
							"</div>");

						$('.result').each(function(index) {
							var ele = $(this);
							setTimeout(function() {

								//animate in
								ele.addClass('fadeInUp animated');

								//attach animation handlers
								var title = ele.find('.business-title');
								var img = ele.find('img');
								var modal = ele.find('.img-modal');
								var cover = ele.find('.cover');
								var info = ele.find('.business-info');
								cover.hover(function() {
									if (!modal.hasClass('show-info')) {
										img.addClass('highlight');
										title.addClass('highlight');
									}
								}, function() {
									if (!modal.hasClass('show-info')) {
										img.removeClass('highlight');
										title.removeClass('highlight');
									}
								});

								cover.click(function() {
									if (!modal.hasClass('show-info')) {
										modal.addClass('show-info');
										title.addClass('show-info');
										setTimeout(function() {
											info.removeClass('zoomOut').addClass('animated zoomIn')
										}, 700);
									} else if (info.hasClass('zoomIn')) {
										info.removeClass('zoomIn').addClass('zoomOut');
										setTimeout(function() {
											modal.removeClass('show-info');
											title.removeClass('show-info');
										}, 700);
									}
									
								});

							}, index*60);
						})
					});
				}, 800);
				
			} else {
				btn.removeClass('fa-circle-o-notch fa-spin fa-inverse').addClass('fa-chevron-right');
				search.val('Not Found, Try Again');
			}

		}));
	  
	}

};

var oneStr = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(document).ready(main);