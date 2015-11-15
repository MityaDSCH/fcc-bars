'use strict';

var yelpHandler = function() {

	var yelp = require('yelp').createClient({
		consumer_key: process.env.CONSUMER_KEY,
		consumer_secret: process.env.CONSUMER_SECRET,
		token: process.env.TOKEN,
		token_secret: process.env.TOKEN_SECRET
	});

	this.searchYelp = function (req, res) {
		yelp.search({term: "bar", location: req.url.replace('/api/yelp/', '')}, function(err, data) {
			if (err) {console.log(err);}
			res.json(data);
		});
	};

}

module.exports = yelpHandler;