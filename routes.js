var express = require('express');
var passport = require('passport');
var Token = require('./models/token');
var User = require('./models/user');
var router = express.Router();
var jwt = require('jwt-simple');

router.post('/signup', function(req, res, next) {
  User.register(new User({email: req.body.email}), req.body.password, function(err, user) {
    if (err) {
      return next(err);
    } else {
      // Authenticate the new user with Passport's 'local' strategy
      // just like in a normal session based app
      passport.authenticate('local')(req, res, function() {
        // The only difference is that we also create a token referencing
        // the new user here
        Token.create({
          user,
          useragent: req.headers['user-agent'],
          ip: req.connection.remoteAddress,
        }, function(err, token) {
          if (err) {
            return next(err);
          } else {
            return res.send({
              user: user.getPublic(),
              // This is what is actually sent to the user as the token.
              // It's basically the encrypted token id.
              token: jwt.encode(token._id, process.env.TOKEN_SECRET),
            });
          }
        });
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
  // Logging in creates another new token as well.
  // Would you want to invalidate all other tokens for this user here too?
  // Not if you want to allow multiple devices per user at the same time.
  Token.create({
    user: req.user,
    useragent: req.headers['user-agent'],
    ip: req.connection.remoteAddress,
  }, function(err, token) {
    if (err) {
      return next(err);
    } else {
      return res.send({
        user: req.user.getPublic(),
        // Return the encrypted token id, just like in sign in
        token: jwt.encode(token._id, process.env.TOKEN_SECRET),
      });
    }
  });
});

router.get('/logout', passport.authenticate('bearer', {session: false}), function(req, res, next) {
  var token = req.authInfo.token;

  // Set invalidated on token
  token.update({
    invalidated: Date.now(),
  }, function(err, token) {
    if (err) {
      return next(err);
    }

    return res.send({
      message: 'Successfully logged out'
    });
  });
});

// Note that we're not using the 'local' strategy here, we're using 'bearer'.
// This requires a valid access_token to be passed with the request.
// See our implementation of the bearer strategy in app.js.
router.get('/protected', passport.authenticate('bearer', {session: false}), function(req, res, next) {
  Token.update({
  }, {
    lastUsed: Date.now(),
  }, function(err, token) {
    if (err) {
      return next(err);
    }

    return res.send({
      message: 'Successfully accessed protected endpoint'
    });
  });
});

module.exports = router;
