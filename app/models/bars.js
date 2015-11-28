'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
  yelpId: String,
  goingToday: Object
});

module.exports = mongoose.model('Bar', Bar);
