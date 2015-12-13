var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user');
var appConstants = require('../constants/app_constants');

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

  // The could be used to help the user identify what device a specific
  // login came from
  useragent: {
    type: String,
    required: true,
  },

  // This could be used to help the user identify where they were when they
  // logged in with a specific device.
  ip: {
    type: String,
    required: true,
  },

  // Keep track of the last time the user authenticated with this token
  lastUsed: {
    type: Date,
  }
});

Token.methods.isValid = function isValid() {
  // Has the token been marked as invalid
  if (this.invalidated) {
    return false;
  }

  // Is the token expired
  if (Date.now() - this.created > appConstants.tokenLifespan) {
    return false;
  }

  return true;
};

module.exports = mongoose.model('Token', Token);
