var _ = require('lodash');
var async = require('async');
var mongoose = require("mongoose");
var config = require("../../config/environment");
var FCM = require('fcm-node');
var serverKey = 'AAAAelJjKkg:APA91bE6vCU59VZzBKt-tW0ES77at5I0RHIKEOL8h9GLd17fCCobZObrQM7NBcrAmI4Pq7o2m1XTQPV5MmCTehnCHZZNeG8Fx4SyoulSfrjIHDDgBpireJWOA8RVGSbNkCstzmHPTfCU'; //put your server key here
var fcm = new FCM(serverKey);

exports.AddNotification = function (req, res) {
        var Model = mongoose.model('User');
        var NotificationModel = mongoose.model('Notification');
        var data = req.body;
        console.log(data); 
        if(!data.title || !data.msg || data.fcmRegIdArray.length == 0){
                res.send(send_response(null, true, 'כל השדות חובה'));
        }else{
                NotificationModel.create(data, function (err, data) {
                        if (err) {
                                res.send(send_response(null, true, 'not added notification'));
                        } else {
                                var DeviceIds= _.map(data.fcmRegIdArray);
                                console.log(DeviceIds);
                                res.send(send_response(data, false, 'הודעה נשלחה בהצלחה'));
                                // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                        
                                //         // send same notification to multiple users then use "registration_ids" parameter instead of "to". 
                                //         registration_ids: 'registration_token', 
                                //         collapse_key: 'your_collapse_key',
                                        
                                //         notification: {
                                //             title: 'Title of your push notification', 
                                //             body: 'Body of your push notification' 
                                //         },
                                        
                                //         data: {  //you can send only notification or only data(or include both)
                                //             my_key: 'my value',
                                //             my_another_key: 'my another value'
                                //         },
                                //         priority: 'high',
                                //         content_available: true // for ios
                                //     };
                                    
                                //     fcm.send(message, function(err, response){
                                //         if (err) {
                                //             console.log("Something has gone wrong!");
                                //         } else {
                                //             console.log("Successfully sent with response: ", response);
                                //         }
                                //     })
                        }
                });

        }
};