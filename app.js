require('./config/config');
require('./config/passportConfig.js');
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let cors = require('cors');
let passport = require('passport');
mongoose.connect(process.env.MONGODB_URI);
let db = mongoose.connection;
db.on('error',(err)=> console.log('connection error'));
db.on('open',()=> console.log('mongodb connected'));


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let restaurantRouter = require('./routes/restaurant');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin:['http://localhost:4200'],
    credentials : true
}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname + '/../restaurantClient/dist/restaurantClient/')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', restaurantRouter);

// app.get('*', (req, res)=>{
//   res.sendFile(path.join(__dirname, '/../restaurantClient/dist/restaurantClient/index.html'));
// })

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
