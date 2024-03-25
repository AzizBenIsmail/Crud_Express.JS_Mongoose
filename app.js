var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const userModel= require('./Models/userModel')
require("dotenv").config(); //configuration dotenv
const mongoose = require('mongoose')
const db = require('./db.json') //configuration json
const cors = require('cors');
const session = require('express-session');


var contactsRouteurs = require('./routes/contacts');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var carRouter = require('./routes/car');
const { error } = require('console');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL_MONGO || db.mongo.uri, {
}).then(
  ()=>{console.log('connect to BD');}
).catch(
  (error)=>{console.log(error.message);}
);


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Credentials',
  credentials: true
}));

app.use(session({
  secret: 'net StudySphere secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // À définir sur true si vous utilisez HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Durée de validité du cookie de session (en millisecondes)
  },
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contacts', contactsRouteurs)
app.use('/car', carRouter)  


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

const server = http.createServer(app);
server.listen(5000, () => { console.log("app is runnig on port 5000") });
