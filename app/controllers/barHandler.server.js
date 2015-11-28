'use strict';

var User = require('../models/users.js');
var Bar = require('../models/bars.js');
var querystring = require('querystring');

function BarHandler () {

	this.addBar = function (req, res) {
		var today = Date.now();
		var body = req.body;
		var url = querystring.parse(req.url);
		var barId = body.barId;

		User.findOne({ 'github.id': req.user.github.id }, function(err, user) {
			var add = url.add === 'true';
			var curTime = Date.now();
			// get rid of entries more than 24hrs old or if the request deletes it
			var newArr = user.goingToday.filter(function(ele) {
				if (curTime - ele.time > 86400000) return false;
				if (ele.barId === barId && !add) return false;
				return true;
			});
			var curBarIds = newArr.map(function(ele) {
				return ele.barId;
			});

			body.time = curTime;

			// add new bar if it's not already in the array and the querystring says add is true
			if (add && curBarIds.indexOf(barId) === -1) newArr.push(body);

			user.goingToday = newArr;
			user.save(function(err) {
				if (err) return res.status(500).send(err);
				updateBar(req, res, user, add);
				//return res.status(200).json(user);
			});
		});

		function updateBar(req, res, user, add) {
			Bar.findOne({'yelpId': barId}, function(err, bar) {

				var name = user.github.username;
				if (bar && add) {
					bar.goingToday.push(name);
				} else if (bar && !add) {
					bar.goingToday.splice(bar.goingToday.indexOf(name), 1);
					if (bar.goingToday.length === 0) bar.remove();
				} else {
					bar = new Bar();
					bar.yelpId = barId;
					bar.goingToday = [];
					bar.goingToday.push(user.github.username);
				}
				bar.save(function(err) {
					if (err) {
						throw err;
					} else {
						res.status(200).json(bar);
						// return done(null, newBar);
					}
				});

			});
		}

	};

}

module.exports = BarHandler;
