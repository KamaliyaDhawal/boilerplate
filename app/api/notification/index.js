'use strict';

var express = require('express');
var controller = require('./notification.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.post('/add_notifications',auth.isAuthenticated(), controller.AddNotification);

module.exports = router;