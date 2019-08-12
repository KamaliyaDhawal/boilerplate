'use strict';

var express = require('express');

var multer = require('multer');
var upload = multer({dest: 'public/upload/'})

var controller = require('./upload.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

//var upload = require('../../config/multer');


var router = express.Router();

router.post('/upload/:collection/:id', upload.single('file'), controller.uploadimage);
router.post('/upload/multiimg/:collection/:id', upload.any(), controller.uploadMultiFile);
router.post('/', upload.single('file'), controller.uploadimage);
router.post('/upload', upload.single('file'), controller.uploadFile);
router.post('/remove/:filename', controller.removeFile);
router.get('/get/:filename', controller.image)

module.exports = router;