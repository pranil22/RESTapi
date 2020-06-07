var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

var app = express();
const url = 'mongodb://localhost:27017/conFusion';

const connect = mongoose.connect(url);

connect
  .then(() => {
    console.log('Connected correctly to database server');
  })
  .catch((err) => {
    console.log(err);
  })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('1234-567890-123-1045'));
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  console.log(req.signedCookies);

  if(!req.signedCookies.user) {     //Checking if user exist in cookie
    var authHeader = req.headers.authorization;

    if(!authHeader) {
      var err = new Error('You are not authenticated');
      err.status = 401;
      res.setHeader('WWW-Authenticate', 'Basic');
      return next(err);
    }

    let interAuth = Buffer.from(authHeader.split(' ')[1], 'base64');
    let auth = interAuth.toString().split(':');

    let username = auth[0];
    let password = auth[1];

    if(username === "admin" && password === "password") {
      console.log('User is authentiacted');
      res.cookie('user', 'admin',{ signed: true }); //Setting cookie for next requests
      next();
    }
    else {
      var err = new Error('You are not authenticated');
      err.status = 401;
      res.setHeader('WWW-Authenticate', 'Basic');
      return next(err);
    }
  }
  else {
    if(req.signedCookies.user === 'admin') { // Double checking 
      next();
    } else {
      var err = new Error('You are not authenticated');
      err.status = 401;
      return next(err);
    }
  }  
}

app.use(auth);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
