/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var User = require('../models/user.model');

console.log("Running Seed....");
// Create Default Admin


// User.find({}, function (err, docs) {
//    docs.forEach(function (item) {
//         // var slug = item.fullname.toLowerCase();
//         item.status = false;
//         item.save(function (err, saved) {
//            if (err) {
//                console.log(err);
//            } else {
//                console.log("success");
//            }
//        })
//    })
// });
