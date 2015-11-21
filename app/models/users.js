'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
      	publicRepos: Number,
      	goingToday: {
      		type: Object,
      		default: []
      	}
	}
});

module.exports = mongoose.model('User', User);
