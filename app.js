const createError = require('http-errors');
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');

global.logger = pino({ level: process.env.LOG_LEVEL || 'debug' });
const expressLogger = expressPino({ logger });

const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
    require('dotenv').config();
    require('./loaders/firestore-local');
} else {
    require('./loaders/firestore');
}

// create connection to Discord
require('./loaders/discord');

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
    res.render('error');
});

module.exports = app;
