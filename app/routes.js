/**
 * Main application routes
 */

'use strict';

var path = require('path');
var auth = require('./auth/auth.service');

module.exports = function (app) {
app.use('/api/image', require('./api/upload'));
app.use('/api/query', require('./api/common'));
app.use('/api/login', require('./api/login'));
app.use('/api/users', require('./api/user'));
app.use('/api/cron', require('./api/cron'));
app.use('/api/notifications', require('./api/notification'));
app.use('/api/payments', require('./api/payment'));
app.use('/api/ContactUs', require('./api/contactus'));
app.use('/api/QA', require('./api/qa'));
app.use('/api/Terms', require('./api/terms'));
app.use('/auth', require('./auth'));
};
