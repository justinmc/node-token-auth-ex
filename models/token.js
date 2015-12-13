var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user');

var Token = new Schema({
  user: {
    type: ObjectId,
    ref: User,
    required: true,
  },

  // This allows us to expire the token after a certain amount of time
  created: {
    type: Date,
    default: Date.now(),
  },

  // This might allow us to let the user logout
  invalidated: {
    type: Date,
  },
});

module.exports = mongoose.model('Token', Token);
