'use strict';

// a too-long js file

var main = function() {

	function getUser(callback) {
		var apiUrl = window.location.origin + '/api/:id';
		$.get(apiUrl , function( user ) {
	      window.USER = user;
	      $('#username-display').text('Hello ' + (typeof user.github.username === 'undefined' ? 'Stranger' : user.github.username));
	      if (typeof callback === 'function') callback();
	   });
	}

	getUser();

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
				ele.removeClass('fadeInUp').addClass('fadeOutDown');
			},index*60);
		});
		setTimeout(function() {
			$('#result-container').html('').removeClass('show');
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

		$.get( "/api/yelp/" + str.replace(' ', '+'), function( result ) {

			if (result.businesses !== undefined) {

				pushBars(result);

			} else {
				btn.removeClass('fa-circle-o-notch fa-spin fa-inverse').addClass('fa-chevron-right');
				search.val('Not Found, Try Again');
			}

		});

	}

	function pushBars(result) {
		search.attr('readOnly', true);
		$('#result-container').addClass('show');

		// set search bar
		btn.removeClass('fa-spin rollIn').addClass('fadeOutUp');
		setTimeout(function() {
			btn.removeClass('fa-circle-o-notch fa-inverse').addClass('rollIn fa-times');
		}, 1000);

		// send search bar to top of page
		$('#search-container').addClass('to-top');

		// append results after search container gots to top, then attach animation controllers
		setTimeout(function() {
			result.businesses.forEach(function(business) {

				if (typeof business.image_url !== 'undefined') {
					$('#result-container').append("<div class='result hide-init' id='" + business.id + "'>" +
							"<div class='going-flag'>0 Going</div>" +
							"<div class='img-container'>" +
								"<img class='res-img' src='" + business.image_url.replace('/ms.jpg', '/l.jpg') + "'/>" +
								"<div class='img-modal'></div>" +
								"<span class='business-title'><a href='" + business.url+ "'><h3>" + business.name + "</h3></a></span>" +
								"<span class='business-info'><p>" + business.snippet_text + "</p></span>" +
								"<span class='cover'></span>" +
								"<div class='going-btn'>Going?</div>" +
							"</div>" +
						"</div>");
				}
			});

			// extract required data for each business
			var businessesObj = {};
			result.businesses.forEach(function(business) {
				businessesObj[business.id] = {
					'barId': business.id,
					'name': business.name,
					'url': business.url,
					'img': business.image_url,
					'desc': business.snippet_text,
				};
			});

			updateGoing();

			// fade in results
			$('.result').each(function(index, ele) {
				setTimeout(function() {
					$(ele).addClass('fadeInUp animated');
				}, index*60);
			});

			// defines animations based on interaction with .cover, in its own function because then I can do some fucked up scope things
			(function() {
				// defines .result elements relative to elements you interact with
				var title = function(cover) {
					return $(cover).siblings('.business-title');
				};
				var wrap = function(cover) {
					return $(cover).parent();
				};
				var modal = function(cover) {
					return $(cover).siblings('.img-modal');
				};
				var info = function(cover) {
					return $(cover).siblings('.business-info');
				};
				var goingBtn = function(cover) {
					return $(cover).siblings('.going-btn');
				};
				var goingFlg = function(cover) {
					return $(cover).parent().siblings('.going-flag');
				};

				// add/remove hover classes for bar squares
				$('.cover').hover(function() {
					if (!modal(this).hasClass('show-info')) {
						wrap(this).addClass('highlight');
						title(this).addClass('highlight');
						goingFlg(this).removeClass('slideOutUp').addClass('animated slideInDown');
					}
				}, function() {
					if (!modal(this).hasClass('show-info')) {
						wrap(this).removeClass('highlight');
						title(this).removeClass('highlight');
						goingFlg(this).removeClass('slideInDown').addClass('slideOutUp');
					}
				}).click(function() { // trigger click animations

					// define ele because of this scope in setTimeout
					var cmodal = modal(this);
					var ctitle = title(this);
					var cinfo = info(this);
					var cgoingBtn = goingBtn(this);
					var cwrap = wrap(this);
					var cflag = goingFlg(this);

					if(!cmodal.hasClass('show-info')) {
						cmodal.addClass('show-info');
						ctitle.addClass('show-info');
						cflag.addClass('slideInDown').removeClass('slideOutUp');
						setTimeout(function() {
							cinfo.removeClass('slideOutRight').addClass('animated slideInRight');
							cgoingBtn.removeClass('slideOutLeft').addClass('animated slideInLeft');
						}, 700);
					} else if (cinfo.hasClass('slideInRight')) {
						cinfo.removeClass('slideInRight').addClass('slideOutRight');
						cgoingBtn.removeClass('slideInLeft').addClass('slideOutLeft');
						cflag.removeClass('slideInDown').addClass('slideOutUp');
						setTimeout(function() {
							cmodal.removeClass('show-info');
							ctitle.removeClass('show-info highlight');
							cwrap.removeClass('highlight');
						}, 700);
					}
				});
			})();

			//attach going-btn hover and click handlers
			$('.going-btn').mouseenter(function() {
				if (!$(this).hasClass('going')) $(this).removeClass('slideInLeft').addClass('swing');
			}).mouseleave(function() {
				$(this).removeClass('swing');
			}).click(function() {
				var barId = $(this).parents('.result').attr('id');
				var busObj = businessesObj[$(this).parents('.result').attr('id')];
				var addBoolString = $(this).hasClass('going') ? 'false' : 'true';
				$.ajax({
					url: '/api/bars/id=' + window.USER.github.id + '&barId=' + barId + '&add=' + addBoolString,
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(busObj)
				}).done(function(data) {
					getUser(updateGoing);
				});
			});

		}, 800);

	}

	function updateGoing() {
		var goingIds = window.USER.goingToday.map(function(ele) {
			return ele.barId;
		});
		$('.result').each(function() {
			var curBtn = $(this).find('.going-btn');
			var curTitle = $(this).find('.business-title');
			if (goingIds.indexOf($(this).attr('id')) !== -1) {
				curBtn.html('Going! <i class="fa fa-glass"></i>').removeClass('swing').addClass('going');
				curTitle.addClass('going');
			} else if (curBtn.hasClass('going')) {
				curBtn.text('Going?').removeClass('going');
				curTitle.removeClass('going');
			}
		});
	}

};

var oneStr = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(document).ready(main);
