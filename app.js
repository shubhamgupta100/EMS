var createError = require('http-errors');
var express = require('express');
var path = require('path');
const port = process.env.PORT || 5000;
var logger = require('morgan');
const db  = require('./config/mongoose');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const cMware = require('./config/cmiddleware');
const passport = require('passport');
const passportLocal = require('./config/passport-local');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('secret'));
app.use(session({
  secret:'secret',
  maxAge:3600000,
  resave:true,
  saveUninitialized:false,
}))

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(cMware.flashMessage);

// Router
app.use('/', indexRouter);
app.use('/users', usersRouter);




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

app.listen(port , (err )=> {
  if(err) throw err;
  console.log("Server is running on port :" , port);
})

module.exports = app;
