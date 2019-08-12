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
        , templatesDir = path.join(__dirname, '../../templates');


exports.send_mail = function(req, res){
    console.log('cron run successfully');
};