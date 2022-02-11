const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
//const logger = require('morgan');
const mongoose = require('./olp2_api/models/db');

//const indexRouter = require('./olp2_cserver/routes/index');
const apiRouter = require('./olp2_api/routes/index');

const olp2 = express();

olp2.use(express.json());
olp2.use(express.urlencoded({ extended: false }));

//olp2.use('/', express.static(path.join(__dirname, 'public')));

olp2.use('/', express.static(path.join(__dirname, 'dist', 'olp2')));

olp2.use('/api', apiRouter);

// catch 404 and forward to error handler
olp2.use(function(req, res, next) {
    console.log('Check error handling request at line 37!', olp2.get('env'));
  next(createError(404));
});

// error handler
olp2.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = olp2.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = olp2;
