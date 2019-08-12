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
var moment = require("moment");
var path = require('path')
        , templatesDir = path.join(__dirname, '../../templates');


exports.ContactUs = function(req, res){
    var Model = mongoose.model('ContactUs');
    Model.create(req.body, function (err, u) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            var transporter = nodemailer.createTransport('smtps://develapptodate%40gmail.com:0503636776@smtp.gmail.com');
            var new_date = moment(u.dateAdded).format('DD/MM/YYYY');
            var replace_var = {
                name: u.name,
                phone: u.phone,
                message: u.message,
                date: new_date
            }
            var templates = new EmailTemplates();
            templates.render(templatesDir + '/contactus.html', replace_var, function (err, html, text) {
                var mailOptions = {
                        from: '""', // sender address
                        to: 'develapptodate@gmail.com', // list of receivers
                        subject: 'פניה חדשה מאפליקציית קנטינה', // Subject line
                        html: html // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        console.log(info);
                        if (error) {
                            res.json({data: error, is_error: true, message: 'שגיאה בעת שליחת דוא"ל'});
                    } else {
                        console.log('success');
                        res.json({data: info, is_error: false, message: 'אומר שאנחנו מקבלים את המידע שלו ואנו ניצור אתו קשר בקרוב'});
                    }
                });
            })
        }
    });    
}