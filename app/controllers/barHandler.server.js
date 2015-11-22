'use strict';

var Users = require('../models/users.js');

function BarHandler () {

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addBar = function (req, res) {
		var today = new Date();
		today = today.getDate();
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { 'barId': req.bar.Id, 'night': today} })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.goingToday);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

}

module.exports = BarHandler;