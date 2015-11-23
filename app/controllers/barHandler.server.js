'use strict';

var Users = require('../models/users.js');
var querystring = require('querystring');

function BarHandler () {

	this.addBar = function (req, res) {
		var today = Date.now();
		Users.findOne({ 'github.id': req.user.github.id }, function(err, user) { 
			var barId = querystring.parse(req.url).barId;
			var add = querystring.parse(req.url).add;
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

			// add new bar if it's not already in the array and the querystring says add is true
			if (add && curBarIds.indexOf(barId) === -1) newArr.push({'time': curTime, 'barId': barId});

			user.goingToday = newArr;
			user.save(function(err) {
				if (err) return res.status(500).send(err);
				return res.status(200).json(user);
			});

		});
	};

}

module.exports = BarHandler;