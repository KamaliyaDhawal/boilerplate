'use strict';

var express = require('express');
var controller = require('./cron.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

// calling from cronjob
router.get('/send_mail', controller.send_mail);

module.exports = router;