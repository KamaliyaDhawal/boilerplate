var nodemailer = require('nodemailer');
var _ = require('lodash');
var mongoose = require("mongoose");

module.exports.transporter = function(company_id, callback){
	var transporter = nodemailer.createTransport('smtps://samcom.php%40gmail.com:samcom84@smtp.gmail.com');
	// var mailOptions = {
	//     from: '"Common NG-Pro" <support@example.com>', // sender address
	//     //to: data.send_to, // list of receivers
	//     //subject: data.subject, // Subject line
	//     //html: html // html body
	// };
	// transporter.sendMail(mailOptions, function (error, info) {
	//     console.log('5');
	//     if (error) {
	//         console.log('6');
	//         res({data: error, is_error: true, message: 'error while sending email'});
	//     }
	//     console.log('7');
	//     res({data: data, is_error: false, message: 'Email sent'});
	//     console.log('8');
	// });
}