var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var validator = require('validator');

var PRIVATE_FIELDS = [
  '_id',
  'salt',
  'hash',
  '__v',
];

var User = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    validate: [validator.isEmail, 'invalid email']
  },
  created: {
    type: Date,
    default: Date.now(),
  }
});

User.plugin(passportLocalMongoose, {
  usernameField: 'email',
  passwordValidator: function(password, callback) {
    if (password.length < 8) {
      return callback(new Error('Password must be at least 8 characters'));
    } else {
      return callback();
    }
  },
});

User.methods.getPublic = function getPublic() {
  var doc = this.toObject();

  PRIVATE_FIELDS.forEach(function(field) {
    delete doc[field];
  });
  
  return doc;
};

module.exports = mongoose.model('User', User);
