// Import necessary modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session');

const User = require('./models/user');
const Batman = require('./models/batman');

const usersRouter = require('./routes/users');
const loginRouter = require('./routes/loginRouter');
var indexRouter = require('./routes/index');
var batmanRouter = require('./routes/batmanRouter');

var app = express();

// Start the server
app.listen(3006, () => {
  console.log("Server is Running");
});

// Set up view engine and middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));

// Connect to MongoDB
const url = 'mongodb://localhost:27017/batmanshop';
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
connect.then((db) => {
    console.log("Connected correctly to the server");
}, (err) => { console.log(err); });

// Set currentUser in locals for every request
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

// Route handlers
app.use('/', indexRouter);
app.use('/about', indexRouter);
app.use('/help', indexRouter);
app.use('/report', indexRouter);

app.use('/users', loginRouter);

app.use('/delete', batmanRouter);
app.use('/modify', batmanRouter);
app.use('/batmans', batmanRouter);

app.use('/users', usersRouter);
app.use('/register', usersRouter);

// Error handling middleware
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;