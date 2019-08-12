'use strict';

var express = require('express');
var controller = require('./common.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/:collection',auth.isAuthenticated(), controller.get);
router.get('/:collection', controller.get);
router.get('/:collection/:id', controller.getById);
router.post('/:collection/:id', controller.update);
router.post('/:collection', controller.update);
router.put('/:collection', controller.createnew);
router.patch('/:collection/:id', controller.update);
router.delete('/:collection/:id', controller.destroy);
router.delete('/soft/:collection/:id', controller.softdestroy);
router.post('/execute/conditions/:collection', controller.executeQuery);
router.get('/metadata/info/:collection/:type', controller.metadata);




module.exports = router;