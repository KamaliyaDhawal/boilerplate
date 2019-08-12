"use strict"

var FCM = require('fcm-node');
var config = require('./environment');
var server_key = config.fcm_server_key;
//console.log(server_key);
var fcm = new FCM(server_key);


function send_notification(device_id,notification, data, callback) {
    
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: device_id,
        collapse_key: 'Perform Action',

        notification: notification,

        data: data
    };

    fcm.send(message, function (err, response) {
        callback(err, response);
    });
}

exports.send_notification = send_notification;