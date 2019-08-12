var _ = require('lodash');
var async = require('async');
var passport = require('passport');
var mongoose = require("mongoose");
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var pug = require('pug');
var smtpTransport = require('nodemailer-smtp-transport');
var EmailTemplates = require('swig-email-templates');
var auth = require('../../auth/auth.service');
var mail = require('../../mail');
var config = require('../../config/local.env');
var path = require('path')
         ,templatesDir = path.join(__dirname, '../../templates');
var request = require('request');
var fs = require('fs');


exports.register = function (req, res) {
    var Model = mongoose.model('User');
    var data = new Model(req.body);

    if(req.body.type == 1){
        data.type = 'admin';
    }else if(req.body.type == 0){
        data.type = 'user';
    }
    Model.findOne({phone: data.phone}, function (err, usr) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            if (usr) {
                res.send(send_response(null, true, 'מספר הטלפון כבר קיים'));
            } else {                
                if(!data.type || !data.phone || !data.password || !data.name){
                    return res.send(send_response(null, true, "All fields are mandatory")); // All fields are mandatory
                }
                else {
                    Model.create(data, function (err, user) {
                        if (err) {
                            res.send(send_response(null, true, err));
                        } else {
                            Model.findOne({_id: user._id}, '-salt -hashedPassword').exec(function (err, u) {
                                if (u && !err) {
                                    var token = auth.signToken(u._id, u.role);
                                    //res.json({token: token});
                                    var data = {user: u, access_token: token};
                                    res.send(send_response(data, false, 'successfully registered'));// successfully registered
                                } else {
                                    console.log(err);
                                    res.send(send_response(null, true, err.message));
                                }
                            });
                        }
                    });
                }
            }
        }
    });
};

/* Get Users by admin */
exports.getuserbyadmin = function (req, res) {
    var User = mongoose.model('User');
    User.findOne({"_id": req.body.user_id}, function (err, admin_data) {
        if (admin_data == null) {
            res.json({data: null, is_error: true, message: res.error});
        } else {
            if(admin_data.type == 'admin'){
                User.find({}, function (err, user_data) {
                    if (err) {
                        res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
                    } else {
                        res.json({data: user_data, is_error: false, message:''});
                    }
                });
            }else{
                res.send(send_response(null, true, "You are not admin"));
            }
        } 
    });    
};

exports.forgotpassword = function (req, res) {

    var User = mongoose.model('User');
    var data = req.body;

    User.findOne({email: data.email}, function (err, user) {
        if (user == null) {
            res.json({data: null, is_error: true, message: 'הודעת אימייל זו אינה רשומה'});
        } else {
            var today = new Date();
            //Generate Hash
            var secret = 'a3s5d46a5sd684asdaasdkn!@312';
            var new_password = randomstring.generate(10);
            user.password = new_password;
            var transporter = nodemailer.createTransport('smtps://develapptodate%40gmail.com:0503636776@smtp.gmail.com');
                var replace_var = {
                    username: user.name,
                    password: new_password,
                    link: config.CLIENT_URL + 'api/users/resetpassword/'+ user.id

                }
                var templates = new EmailTemplates();
                templates.render(templatesDir + '/forgopassword.html', replace_var, function (err, html, text) {
                    var mailOptions = {
                        from: 'develapptodate@gmail.com', // sender address
                        to: user.email, // list of receivers
                        subject: 'Request to reset password from CommonNG-Pro application', // Subject line
                        html: html // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.json({data: error, is_error: true, message: 'Error sending email'});
                        } else {
                            res.json({data: data, is_error: false, message: 'Email sent to reset password'});
                        }
                    });
                })

        }
    })
};


exports.passwordresetrequest = function (req, res) {
    var User = mongoose.model('User');
    var data = req.body;

    if(req.body.email == '' || req.body.email.length == 0){
        res.json({message: 'All fields are mandatory'});
    }
    User.findOne({email: data.email}, function (err, user) {
        if (user == null) {
            res.json({data: null, is_error: true, message: 'email not exit'});
        } else { 
            var transporter = nodemailer.createTransport('smtps://develapptodate%40gmail.com:0503636776@smtp.gmail.com');
                var replace_var = {
                    username: user.name,
                    password: new_password,
                    link: config.CLIENT_URL + 'api/users/resetpassword/'+ user.id
                }
                var templates = new EmailTemplates();
                templates.render(templatesDir + '/forgopassword.html', replace_var, function (err, html, text) {
                    var mailOptions = {
                        from: 'develapptodate@gmail.com', // sender address
                        to: user.email, // receiver
                        subject: 'Request to reset password from CommonNG-Pro application', // Subject line
                        html: html // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.json({data: error, is_error: true, message: 'Error sending email'});
                        } else {
                            res.json({data: data, is_error: false, message: 'Email sent to reset password'});
                        }
                    });
                })
        }
    })
};

exports.passwordreset = function (req, res) {
    var User = mongoose.model('User');
    User.findOne({phone: req.body.phone}, function (err, usr) {
        if (err) {
            res.send(send_response(null, true, "No user found"));
        } else {
            if(usr){
                usr.password = req.body.password;
                usr.save(function (err, saved) {
                    if (err) {
                        res.send(send_response(null, true, parse_error(err)));
                    } else {
                        res.send(send_response(saved));
                    }
                });
            }else{
                res.send(send_response(null, true, "No user found"));
            }
        }
    });
};

exports.resetpassword = function(req,res){    
    var user_id = req.params.uid;
    res.render(templatesDir+'/first.ejs',{
        title: 'Verification Successfull', 
        message: 'Hello '+user_id+' !!!', 
        ptags:'Password and confirm password does not match',
        user_id:user_id,
        client_url: config.CLIENT_URL,
    });
}

exports.password_success = function(req,res){    
    var user_id = req.params.uid;
    res.render(templatesDir+'/success.ejs',{
        title: 'Verification Successfull', 
        message: 'Hello '+user_id+' !!!', 
        ptags:'Password and confirm password does not match',
        user_id:user_id
    });
}

exports.resetpasswordsubmit = function(req,res){
    var user_id = req.body.user_id;
    var Model = mongoose.model('User');
    
    Model.findOne({_id: user_id}, function (err, usr) {
        if (err) {
            res.send(send_response(null, true, "לא נמצא משתמש"));
        } else {
            usr.password = req.body.password;
            usr.save(function (err, saved) {
                if (err) {
                    res.send(send_response(null, true, parse_error(err)));
                } else {
                    // res.send(send_response(saved));
                    res.render(templatesDir+'/success.ejs',{
                        title: 'Password updated successfully',
                        message: 'Password updated successfully',
                        ptag: 'Now you can use your new password for login'
                    });
                }
            });
        }
    });
}

exports.GetUserReceviers = function(req, res){
    var ReceiverModel = mongoose.model('Receivers');
    ReceiverModel.find({ $and: [{"user_id":req.body.user_id }, { "is_deleted": false }] }, function (err, user) {
        if (err) {
            res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
        } else {
            res.json({receiversArr: user, is_error: false, message:''});
        }
    });
    // PaymentModel.find({ $and: [{ user_id: req.body.user_id },{ recevier_id: { $ne: null } }] }, function (err, user) {
    //     if (err) {
    //         res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
    //     } else {
    //        if(user){
    //             var user_data = user;
    //             var receiver_ids = _.map(user_data, 'recevier_id');
    //             UserModel.find({_id: { $in: receiver_ids }}, function (err, user) {
    //                 if (err) {
    //                     res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
    //                 } else {
    //                     res.json({receiversArr: user, is_error: false, message:''});
    //                 }
    //             });
    //        }
    //     }
    // });
};

/* Add user receivers */
exports.AddUserReceviers = function(req, res){
    var ReceiverModel = mongoose.model('Receivers');
    ReceiverModel.findOne({$and: [{"receiver_id":req.body.receiver_id},{ "is_deleted": false }]}, function (err, user) {
        if (err) {
            res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
        } else {
            console.log(user);
           if(user){
                res.send(send_response(null, true, "receiver already exit."));
           }else{
                ReceiverModel.create(req.body, function (err, receiver) {
                    if (err) {
                        res.send(send_response(err, true, err.message));
                    } else {
                        res.json({receiversArr: receiver, is_error: false, message:''});
                    }
                });
           }
        }
    });
};

/* Update user receivers */
exports.UpdateUserReceviers = function(req, res){
    var ReceiverModel = mongoose.model('Receivers');
    ReceiverModel.findOne({"_id":req.body._id}, function (err, receiver) {
        if (err) {
            res.send(send_response(null, true, "ERROR_USER_NOT_FOUND"));
        } else {
            var updated_receiver = _.assign(receiver, req.body);
            updated_receiver.save(function (err) {
                if (err) {
                    res.send(send_response(null, true, parse_error(err)));
                } else {
                    res.json({data: receiver, is_error: false, message: 'מקלט המשתמש עודכן בהצלחה'});
                }
            });
        }
    });
};

exports.GetUserPayments = function(req, res){
    var PaymentModel = mongoose.model('Payments');
    PaymentModel.find({ user_id: req.body.user_id }, function (err, payment_data) {
        if (err) {
            res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
        } else {
            res.json({paymentArr: payment_data, is_error: false, message:''});
        }
    });
};

exports.geterrorlog = function(req, res){
    var Model = mongoose.model('Errorlog');
    Model.find({}, function (err, annos) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            res.send(send_response(annos));
        }
    });
};

