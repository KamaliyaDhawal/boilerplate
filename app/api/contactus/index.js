'use strict';

var express = require('express');
var controller = require('./contactus.controller');

var router = express.Router();

router.post('/', controller.ContactUs);

module.exports = router;