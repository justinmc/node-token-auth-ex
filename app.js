var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var appConstants = require('./constants/app_constants');
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = require('./models/token');
var User = require('./models/user');
var jwt = require('jwt-simple');

var routes = require('./routes');

var app = express();

// mongoose
mongoose.connect('mongodb://localhost/node-token-auth-ex');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(function allowCORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(`${appConstants.versionPrefix}/`, routes);

// passport config
passport.use(User.createStrategy());
passport.use(new BearerStrategy(function(token, done) {
  var payload = jwt.decode(token, process.env.TOKEN_SECRET);

  Token.findById(payload, function(err, token) {
    if (err) {
      return done(err);
    }

    if (!token.isValid()) {
      return done(null, false);
    }

    User.findById(token.user, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user, {token});
    });
  });
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
