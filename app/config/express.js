/**
 * Express configuration
 */

'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

module.exports = function (app) {
    var env = app.get('env');

    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false, limit: '100mb', parameterLimit: 50000}));
    app.use(bodyParser.json({inflate: true, limit: '100mb'}));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());

    // Persist sessions with mongoStore
    // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
    app.use(session({
        secret: config.secrets.session,
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
            mongooseConnection: mongoose.connection,
            db: 'easy-buy'
        })
    }));

    if ('production' === env) {
        app.use(morgan('dev'));
    }

    if ('development' === env || 'test' === env) {
        app.use(require('connect-livereload')({port: 35730}));
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
};