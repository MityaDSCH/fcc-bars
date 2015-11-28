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

				// add/remove hover classes for bar squares
				$('.cover').hover(function() {
					if (!modal(this).hasClass('show-info')) {
						wrap(this).addClass('highlight');
						title(this).addClass('highlight');
					}
				}, function() {
					if (!modal(this).hasClass('show-info')) {
						wrap(this).removeClass('highlight');
						title(this).removeClass('highlight');
					}
				}).click(function() { // trigger click animations

					// define ele because of this scope in setTimeout
					var cmodal = modal(this);
					var ctitle = title(this);
					var cinfo = info(this);
					var cgoingBtn = goingBtn(this);
					var cwrap = wrap(this);

					if(!cmodal.hasClass('show-info')) {
						cmodal.addClass('show-info');
						ctitle.addClass('show-info');
						setTimeout(function() {
							cinfo.removeClass('slideOutRight').addClass('animated slideInRight');
							cgoingBtn.removeClass('slideOutLeft').addClass('animated slideInLeft');
						}, 700);
					} else if (cinfo.hasClass('slideInRight')) {
						cinfo.removeClass('slideInRight').addClass('slideOutRight');
						cgoingBtn.removeClass('slideInLeft').addClass('slideOutLeft');
						setTimeout(function() {
							cmodal.removeClass('show-info');
							ctitle.removeClass('show-info highlight');
							cwrap.removeClass('highlight');
						}, 700);
					}
				});
			})();

			$('.going-btn').mouseenter(function() {
				$(this).removeClass('slideInLeft').addClass('flash');
				$(this).html('Leave? <i class="fa fa-times"></i>');
			}).mouseleave(function() {
				$(this).removeClass('flash');
				$(this).html('Going! <i class="fa fa-glass"></i>');
			}).click(function() {

				var barId = $(this).parents('.result').attr('id');
				$.ajax({
					url: '/api/bars/id=' + window.USER.github.id + '&barId=' + barId + '&add=false',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({'barId': barId})
				});

				var result = $(this).parents('.result');
				result.addClass('flipOutY');
				setTimeout(function() {
					result.remove();
					if ($('.result').length === 0) $('#result-container').append('<h1>Nothing Planned Today!');
				}, 1000);
			});

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

		} else {
			$('#result-container').append('<h1>Nothing Planned Today!');
		}

	});



};

$(document).ready(main);
