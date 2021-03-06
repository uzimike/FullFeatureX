var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var sassMiddleware = require('node-sass-middleware');
var passport = require('passport');

require('dotenv').config();
require('./config/database/connection.js');

var helper = require('./config/helpers.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, '..', 'client', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(sassMiddleware({
  root: path.join(__dirname, '..', 'client', 'stylesheets'),
  src: 'sass',
  dest: 'css',
  prefix: '/stylesheets/css',
  outputStyle: 'compressed',
  indentedSyntax: true
}));
app.use(express.static(path.join(__dirname, '..', 'client')));

// front end modules
app.use('/vendor/jquery', express.static(path.join(__dirname, '..', '..', 'node_modules', 'jquery', 'dist')));
app.use('/vendor/popper.js', express.static(path.join(__dirname, '..', '..', 'node_modules', 'popper.js', 'dist', 'umd')));
app.use('/vendor/bootstrap', express.static(path.join(__dirname, '..', '..', 'node_modules', 'bootstrap', 'dist')));

// session
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: false
  }
}));

//  passport
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());
require('./config/passport')(passport);

//routes
require('./config/routes')(passport, app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  var renderObject = helper.renderObject(req, {
    title: err.status + ' Error',
    bodyClasses: ['error']
  });
  res.render('error', renderObject);
});

module.exports = app;
