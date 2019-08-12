var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
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
        , templatesDir = path.join(__dirname, '../../templates');


exports.login = function (req, res) {
    var Model = mongoose.model('User');
    Model.findOne({"email":req.body.email}, function (err, usr) {        
        if (err) {
            res.send(send_response(err, true, err.message));
        } else {
            if (usr && usr.type == 'admin') {
                if (!usr.authenticate(req.body.password)) {
                    res.json({data: null, is_error: true, message:'This password is incorrect'});
                }else{
                    var token = auth.signToken(usr._id, usr.type);
                    var resdata = { user: usr, token: token };
                    res.json({data: resdata, is_error: false, message:''});
                }
            } else {
                res.send(send_response(err, true, 'user not found'));
            }
        }   
    })           
}


