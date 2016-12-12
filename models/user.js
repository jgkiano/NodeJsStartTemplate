var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
  oauthID: Number,
  oauthProvider: String,
  name: String,
  created: Date
});

module.exports = User;
