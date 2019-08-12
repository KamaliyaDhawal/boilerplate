var _ = require('lodash');
var async = require('async');
var mongoose = require("mongoose");
var config = require("../../config/environment");
var request = require('request');
var path = require('path')
        , templatesDir = path.join(__dirname, '../../templates');

exports.AddPayment = function (req, res) {
    var PaymentModel = mongoose.model('Payments');
    var UserModel = mongoose.model('User');
    if(req.body.sum <= 0){
        res.send(send_response(err, true, 'סכום העברה צריך להיות מעל אפס'));
    }

    // var payment_details = {
    //     "user_id":req.body.user_id,
    //     "amount":req.body.amount,
    //     "payment_type":req.body.payment_type,
    //     "pay_type": 0,
    //     //"status": 0,
    //     //"tranzila_token":""
    // }
    async.waterfall([
        function (callback) {
            PaymentModel.create(payment_details, function (err, payment) {
                if (err) {
                    res.send(send_response(err, true, err.message));
                } else {
                   callback(null, payment);
                }
            });
        },
        function (payment_data, callback) {
            UserModel.findOne({_id: payment_data.user_id}, function (err, user) {
                if (err) {
                    res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
                } else {
                    user.credit = parseFloat(user.credit) + parseFloat(payment_data.amount);
                    console.log('user amount',user.credit);
                    user.save(function (err, User) {
                        if (err) {
                            res.send(send_response(null, true, parse_error(err)));
                        } else {
                            console.log(User);
                            callback();
                        }   
                    });
                }
            });
        },
    ], function (error, result) {
        res.send(send_response(result, false, 'תשלום הועבר בהצלחה'));
        //res.send(send_response(payment_details, false, 'תשלום הועבר בהצלחה'));
    });    
};

exports.SendPayment = function (req, res) {
    var PaymentModel = mongoose.model('Payments');
    var UserModel = mongoose.model('User');

    if(req.body.amount <= 0){
        res.send(send_response(err, true, 'סכום העברה צריך להיות מעל אפס'));
    }

    var payment_details = {
        "user_id":req.body.user_id,
        "amount":req.body.amount,
        "recevier_id":req.body.receiver_id,
        "payment_type":req.body.payment_type,
        "pay_type": 1,
        //"payment_type":
        //"status": ,
        //"tranzila_token":""
    }
    var sender_userid = req.body.user_id;
    var receiver_userid = req.body.receiver_id;
    var amount = req.body.amount;
    var payment_data = {};

    async.waterfall([
        function (callback) {
            if(payment_details && payment_details.payment_type == 0){
                request('https://direct.tranzila.com/chickypic/iframe.php?sum=' + payment_details.amount + '&amp;current=1&amp;lang=il&amp;guid=' + payment_details.user_id, function (error, response, body) {
                    // console.log('error:', error); // Print the error if one occurred
                    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    // console.log('body:', body); // Print the HTML for the Google homepage.
                    callback();
                }); 
            } else if(payment_details && payment_details.payment_type == 1){
                // Freephone transaction
                callback();
            }  
        },
        function (callback) {
            PaymentModel.create(payment_details, function (err, payment) {
                if (err) {
                    res.send(send_response(err, true, err.message));
                } else {
                    payment_data = payment;
                    callback();
                }
            });
        },
        function (callback) {
            UserModel.findOne({_id: sender_userid}, function (err, send_user) {
                if (err) {
                    res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
                } else {
                    // if(parseFloat(send_user.credit) >= parseFloat(amount)){
                    //     send_user.credit = parseFloat(send_user.credit) - parseFloat(amount);
                    // }else{
                    //     res.send(send_response(null, true, "Credit not avelible in account"));
                    // }
                    send_user.credit = parseFloat(send_user.credit) - parseFloat(amount);
                    send_user.save(function (err, User) {
                        if (err) {
                            res.send(send_response(null, true, parse_error(err)));
                        } else {
                            callback();
                        }   
                    });
                }
            });
        },
        function (callback) {
            UserModel.findOne({_id: receiver_userid}, function (err, receive_user) {
                if (err) {
                    res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
                } else {
                    receive_user.credit = parseFloat(receive_user.credit) + parseFloat(amount);
                    receive_user.save(function (err, rec_user) {
                        if (err) {
                            res.send(send_response(null, true, parse_error(err)));
                        } else {
                            callback();
                        }   
                    });
                }
            });
        },
    ], function (error, result) {
      console.log('here',payment_data);
      res.send(send_response(payment_data, false, 'תשלום הועבר בהצלחה'));
    });    
}

exports.DirectDebitUser = function(req, res){
    console.log(req.body);
}

/* Payment success url*/
exports.payment_success = function(req, res){    
    var data = req.body;
    console.log(data);
    res.render(templatesDir+'/paymentsuccess.ejs',{
        title: 'Payment Successfull', 
        data : data
    });
}

/* Payment Fail url*/
exports.payment_fails = function(req,res){    
    var data = req.body;
    res.render(templatesDir+'/paymentfail.ejs',{
        title: 'Payment fail', 
        data : data
    });
}