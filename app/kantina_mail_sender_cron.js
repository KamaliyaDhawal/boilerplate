"use strict"

var _ = require('lodash');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/environment');
var request = require('request');
console.log(config.port);
var url = "http://109.237.25.22:" + config.port + "/api/cron/send_mail";
console.log(url);

request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});
