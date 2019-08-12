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
var request = require("request");
var path = require('path'),
    templatesDir = path.join(__dirname, '../../templates');

function handleResults() {
    var response = [{
        "000" : "Transaction approved",
        "001" : "Blocked confiscate card.",
        "002" : "Stolen confiscate card.",
        "003" : "Contact credit company.",
        "004" : "Refusal.",
        "005" : "Forged. confiscate card.",
        "006" : "Identity Number of CVV incorrect.",
        "007" : "Must contact Credit Card Company",
        "008" : "Fault in building of access key to blocked cards file.",
        "009" : "Contact unsuccessful.",
        "010" : "Program ceased by user instruction (ESC).",
        "011" : "No confirmation for the ISO currency clearing.",
        "012" : "No confirmation for the ISO currency type.",
        "013" : "No confirmation for charge/discharge transaction.",
        "014" : "Unsupported card",
        "015" : "Number Entered and Magnetic Strip do not match",
        "017" : "Last 4 digets not entered",
        "019" : "Record in INT_IN shorter than 16 characters.",
        "020" : "Input file (INT_IN) does not exist.",
        "021" : "Blocked cards file (NEG) non-existent or has not been updated - execute transmission or request authorization for each transaction.",
        "022" : "One of the parameter files or vectors do not exist.",
        "023" : "Date file (DATA) does not exist.",
        "024" : "Format file (START) does not exist.",
        "025" : "Difference in days in input of blocked cards is too large - execute transmission or request authorization for each transaction.",
        "026" : "Difference in generations in input of blocked cards is too large - execute transmission or request authorization for each transaction.",
        "027" : "Where the magnetic strip is not completely entered",
        "028" : "Central terminal number not entered into terminal defined for work as main supplier.",
        "029" : "Beneficiary number not entered into terminal defined as main beneficiary.",
        "030" : "Terminal not updated as main supplier/beneficiary and supplier/beneficiary number entered.",
        "031" : "Terminal updated as main supplier and beneficiary number entered",
        "032" : "Old transactions - carry out transmission or request authorization for each transaction.",
        "033" : "Defective card",
        "034" : "Card not permitted for this terminal or no authorization for this type of transaction.",
        "035" : "Card not permitted for transaction or type of credit.",
        "036" : "Expired.",
        "037" : "Error in instalments - Amount of transaction needs to be equal to the first instalment + (fixed instalments times no. of instalments)",
        "038" : "Cannot execute transaction in excess of credit card ceiling for immediate debit.",
        "039" : "Control number incorrect.",
        "040" : "Terminal defined as main beneficiary and supplier number entered.",
        "041" : "Exceeds ceiling where input file contains J1 or J2 or J3 (contact prohibited).",
        "042" : "Card blocked for supplier where input file contains J1 or J2 or J3 (contact prohibited).",
        "043" : "Random where input file contains J1 (contact prohibited).",
        "044" : "Terminal prohibited from requesting authorization without transaction (J5)",
        "045" : "Terminal prohibited for supplier-initiated authorization request (J6)",
        "046" : "Terminal must request authorization where input file contains J1 or J2 or J3 (contact prohibited).",
        "047" : "Secret code must be entered where input file contains J1 or J2 or J3 (contact prohibited).",
        "051" : " Vehicle number defective.",
        "052" : "Distance meter not entered.",
        "053" : "Terminal not defined as gas station. (petrol card passed or incorrect transaction code).",
        "057" : "Identity Number Not Entered",
        "058" : "CVV2 Not Entered",
        "059" : "Identiy Number and CVV2 Not Entered",
        "060" : "ABS attachment not found at start of input data in memory.",
        "061" : "Card number not found or found twice",
        "062" : "Incorrect transaction type",
        "063" : "Incorrect transaction code.",
        "064" : "Type of credit incorrect.",
        "065" : "Incorrect currency.",
        "066" : "First instalment and/or fixed payment exists for non-instalments type of credit.",
        "067" : "Number of instalments exists for type of credit not requiring this.",
        "068" : "Linkage to dollar or index not possible for credit other than instalments.",
        "069" : "Length of magnetic strip too short.",
        "070" : "PIN terminal not defined",
        "071" : "PIN must be enetered",
        "072" : "Secret code not entered.",
        "073" : "Incorrect secret code.",
        "074" : "Incorrect secret code - last try.",
        "079" : "Currency is not listed in vector 59.",
        "080" : "'Club code' entered for unsuitable credit type",
        "090" : "Transaction cancelling is not allowed for this card.",
        "091" : "Transaction cancelling is not allowed for this card.",
        "092" : "Transaction cancelling is not allowed for this card.",
        "099" : "Cannot read/write/open TRAN file.",
        "100" : "No equipment for inputting secret code.",
        "101" : "No authorization from credit company for work.",
        "107" : "Transaction amount too large - split into a number of transactions.",
        "108" : "Terminal not authorized to execute forced actions.",
        "109" : "Terminal not authorized for card with service code 587.",
        "110" : "Terminal not authorized for immediate debit card.",
        "111" : "Terminal not authorized for instalments transaction.",
        "112" : "Terminal not authorized for telephone/signature only instalments transaction.",
        "113" : "Terminal not authorized for telephone transaction.",
        "114" : "Terminal not authorized for 'signature only' transaction.",
        "115" : "Terminal not authorized for dollar transaction.",
        "116" : "Terminal not authorized for club transaction.",
        "117" : "Terminal not authorized for stars/points/miles transaction.",
        "118" : "Terminal not authorized for Isracredit credit.",
        "119" : "Terminal not authorized for Amex Credit credit.",
        "120" : "Terminal not authorized for dollar linkage.",
        "121" : "Terminal not authorized for index linkage.",
        "122" : "Terminal not authorized for index linkage with foreign cards.",
        "123" : "Terminal not authorized for stars/points/miles transaction for this type of credit.",
        "124" : "Terminal not authorized for Isracredit payments.",
        "125" : "Terminal not authorized for Amex payments.",
        "126" : "Terminal not authorized for this club code.",
        "127" : "Terminal not authorized for immediate debit transaction except for immediate debit cards.",
        "128" : "Terminal not authorized to accept Visa card staring with 3.",
        "129" : "Terminal not authorized to execute credit transaction above the ceiling.",
        "130" : "Card not permitted for execution of club transaction.",
        "131" : "Card not permitted for execution stars/points/miles transaction.",
        "132" : "Card not permitted for execution of dollar transactions (regular or telephone).",
        "133" : "Card not valid according Isracard list of valid cards.",
        "134" : "Defective card according to system definitions (Isracard VECTOR1) - no. of figures on card - error.",
        "135" : "Card not permitted to execute dollar transactions according to system definition (Isracard VECTOR1).",
        "136" : "Card belongs to group not permitted to execute transactions according to system definition (Visa VECTOR 20).",
        "137" : "Card prefix (7 figures) invalid according to system definition (Diners VECTOR21)",
        "138" : "Card not permitted to carry out instalments transaction according to Isracard list of valid cards.",
        "139" : "Number of instalments too large according to Isracard list of valid cards.",
        "140" : "Visa and Diners cards not permitted for club instalments transactions.",
        "141" : "Series of cards not valid according to system definition (Isracard VECTOR5).",
        "142" : "Invalid service code according to system definition (Isracard VECTOR6).",
        "143" : "Card prefix (2 figures) invalid according to system definition (Isracard VECTOR7).",
        "144" : "Invalid service code according to system definition (Visa VECTOR12).",
        "145" : "Invalid service code according to system definition (Visa VECTOR13).",
        "146" : "Immediate debit card prohibited for execution of credit transaction.",
        "147" : "Card not permitted to execute instalments transaction according to Leumicard vector no. 31.",
        "148" : "Card not permitted for telephone and signature only transaction according to Leumicard vector no. 31",
        "149" : "Card not permitted for telephone transaction according to Leumicard vector no. 31",
        "150" : "Credit not approved for immediate debit cards.",
        "151" : "Credit not approved for foreign cards.",
        "152" : "Club code incorrect.",
        "153" : "Card not permitted to execute flexible credit transactions (Adif/30+) according to system definition (Diners VECTOR21).",
        "154" : "Card not perconsole.log(JSON.stringify(data))mitted to execute immediate debit transactions according to system definition (Diners VECTOR21).",
        "155" : "Amount of payment for credit transaction too small.",
        "156" : "Incorrect number of instalments for credit transaction",
        "157" : "0 ceiling for this type of card for regular credit or Credit transaction.",
        "158" : "0 ceiling for this type of card for immediate debit credit transaction",
        "159" : "0 ceiling for this type of card for immediate debit in dollars.",
        "160" : "0 ceiling for this type of card for telephone transaction.",
        "161" : "0 ceiling for this type of card for credit transaction.",
        "162" : "0 ceiling for this type of card for instalments transaction.",
        "163" : "American Express card issued abroad not permitted for instalments transaction.",
        "164" : "JCB cards permitted to carry out regular credit transactions.",
        "165" : "Amount in stars/points/miles larger than transaction amount.",
        "166" : "Club card not in terminal range.",
        "167" : "Stars/points/miles transaction cannot be executed.",
        "168" : "Dollar transaction cannot be executed for this type of card.",
        "169" : "Credit transaction cannot be executed with other than regular credit.",
        "170" : "Amount of discount on stars/points/miles greater than permitted.",
        "171" : "Forced transaction cannot be executed with credit/immediate debut card.",
        "172" : "Previous transaction cannot be cancelled (credit transaction or card number not identical).",
        "173" : "Double transaction.",
        "174" : "Terminal not permitted for index linkage for this type of credit.",
        "175" : "Terminal not permitted for dollar linkage for this type of credit.",
        "176" : "Card invalid according to system definition (Isracard VECTOR1)",
        "177" : "Cannot execute 'Self-Service' transaction at gas stations except at 'Self-Service at gas stations'.",
        "178" : "Credit transaction forbidden with stars/points/miles.",
        "179" : "Dollar credit transaction forbidden on tourist card.",
        "180" : "Club Card can not preform Telephone Transactions",
        "200" : "Application error.",
        "700" : "Approved TEST Masav transaction",
        "701" : "Invalid Bank Number",
        "702" : "Invalid Branch Number",
        "703" : "Invalid Account Number",
        "704" : "Incorrect Bank/Branch/Account Combination",
        "705" : "Application Error",
        "706" : "Supplier directory does not exist",
        "707" : "Supplier configuration does not exist",
        "708" : "Charge amount zero or negative",
        "709" : "Invalid configuration file",
        "710" : "Invalid dateconsole.log(JSON.stringify(data)) format",
        "711" : "DB Error",
        "712" : "Required parameter is missing",
        "800" : "Transaction Canceled",
        "900" : "3D Secure Failed",
        "903" : "Fraud suspected",
        "951" : "Protocol Error",
        "952" : "Payment not completed",
        "954" : "Payment Failed",
        "955" : "Payment status error",
        "959" : "Payment completed unsuccessfully",
    }];
    return response;   
}

exports.AddPayment = function (req, res) {
    var PaymentModel = mongoose.model('Payments');
    var ReceiverModel = mongoose.model('Receivers');
    var payment_data;
    if (req.body.amount <= 0) {
        res.send(send_response(err, true, 'סכום העברה צריך להיות מעל אפס'));
    }
    var payment_details = req.body;
    async.waterfall([
        function (callback) {
            PaymentModel.create(payment_details, function (err, payment) {
                if (err) {
                    res.send(send_response(err, true, err.message));
                } else {
                   payment_data =  payment;
                   callback(null, payment);
                }
            });
        },
        function (payment_data, callback) {
            var json = {
                "user_id":payment_data.user_id,
                "receiver_id":payment_data.receiver_id,
                "receiver_name":payment_data.receiver_name
            };
            ReceiverModel.findOne({"receiver_id":payment_data.receiver_id}, function (err, receiver) {
                if (err) {
                    res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
                } else {
                    if(receiver){
                        callback();
                    }else{
                        ReceiverModel.create(json, function (err, receiver_user) {
                            if (err) {
                                res.send(send_response(err, true, err.message));
                            } else {
                                callback();
                            }
                        });
                   }
                }
            });
        },
    ], function (error, result) {
       res.json({ data: payment_data, is_error: false, message: 'האימייל נשלח בהצלחה' });
    });
};

/* Send payment */
exports.SendPayment = function (req, res) {
    var PaymentModel = mongoose.model('Payments');
    async.waterfall([
        function (callback) {
            PaymentModel.findOne({"_id": req.body.payment_id}, function (err, pay) {
                if (err) {
                    res.send(send_response(null, true, "לא נמצא משתמש"));
                } else {
                    var updated_payment = _.assign(pay, req.body);
                    updated_payment.save(function (err) {
                        if (err) {
                            res.send(send_response(null, true, parse_error(err)));
                        } else {
                            callback(null, pay);
                        }
                    });
                }
            });
        },
        function (pay, callback) {
            console.log(pay);
            request('https://direct.tranzila.com/apptodate/iframe.php?sum=' + pay.amount + '&currency=1&lang=il&hidesum=1&cy=1&tranmode=AK&TranzilaTK=1&guid=' + pay._id, function (error, response, body) {
                console.log('here');
                callback(null, response);
            });
            // else if(payment_details && payment_details.payment_type == 1){
            //     // Freephone transaction
            //     callback();
            // }  
        },
    ], function (error, result) {
        res.send(send_response(result, false, 'תשלום הועבר בהצלחה'));
    });
}

// Get User their Direct Debit list
exports.DirectDebitUserList = function (req, res) {
    var DirectDebitModel = mongoose.model('DirectDebit');
    DirectDebitModel.find({ $and: [{ "user_id": req.body.user_id }, { "is_deleted": false }] }, function (err, userlist) {
        if (err) {
            res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
        } else {
            res.json({ data: userlist, is_error: false, message: 'אין הוראות קבע' });
        }
    });
}

/* Add cron jobs */
exports.addcronjob = function (req, res) {
    var data;
    var transporter = nodemailer.createTransport('smtps://develapptodate%40gmail.com:0503636776@smtp.gmail.com');
    var replace_var = {
        data: "response_data"
    }
    var templates = new EmailTemplates();
    templates.render(templatesDir + '/cronjobs.html', replace_var, function (err, html, text) {
        var mailOptions = {
            from: 'develapptodate@gmail.com', // sender address
            to: 'sedhal@samcomtechnobrains.com', // list of receivers
            subject: 'בקשה לאיפוס סיסמא מאפליקצית קנטינה', // Subject line
            html: html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.json({ data: error, is_error: true, message: 'שגיאה בעת שליחת דוא"ל' });
            } else {
                res.json({ data: data, is_error: false, message: 'האימייל נשלח בהצלחה' });
            }
        });
    })
}

/* Payment success url*/
exports.payment_success = function (req, res) {
    var TranzilaParModel = mongoose.model('TranzilaParameters');
    var PaymentModel = mongoose.model('Payments');
    var data = req.body;
    var obj = JSON.stringify(handleResults()); 
    var response_obj = JSON.parse(obj);
    var result = response_obj.map(function(o) {
        console.log(o);
       var a = o[data.Response];
       return a;
    });
    data.message = result[0];
    if(data){
        TranzilaParModel.create(data, function (err, par) {
            if (err) {
                res.send(send_response(null, true, err));
            } else {
                if(par){
                    var id = mongoose.Types.ObjectId(par.guid);
                    var obj = {
                        "status":1
                    }
                    PaymentModel.findOne({"_id": id}, function (err, pay) {
                        if (err) {
                            res.send(send_response(null, true, "לא נמצא משתמש"));
                        } else {
                            var updated_payment = _.assign(pay, obj);
                            updated_payment.save(function (err) {
                                if (err) {
                                    res.send(send_response(null, true, parse_error(err)));
                                } else {
                                    console.log(pay);
                                }
                            });
                        }
                    });
                }
            }
        });    
    }
    res.render(templatesDir + '/paymentsuccess.ejs', {
        title: 'Payment Successfull',
        data: data
    });
}


exports.last_payment = function(req, res){
    var TranModel = mongoose.model('TranzilaParameters');
    var PaymentModel = mongoose.model('Payments');
    TranModel.find().limit(1).sort({ dateAdded: -1 }).exec(function (err, trans) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            if(trans && trans.length > 0){
                var pay_id = mongoose.Types.ObjectId(trans[0].guid);
                PaymentModel.find({"_id":pay_id}).limit(1).exec(function (err, docs) {
                    if (err) {
                        res.send(send_response(null, true, err));
                    } else {
                        res.json({ data: docs, is_error: false, message: '' });
                    }
                });    
            }
        }
    });
}

/* Payment Fail url*/
exports.payment_fails = function (req, res) {
    var TranzilaParModel = mongoose.model('TranzilaParameters');
    var data = req.body;
    var obj = JSON.stringify(handleResults()); 
    var response_obj = JSON.parse(obj);
    var result = response_obj.map(function(o) {
        console.log(o);
       var a = o[data.Response];
       return a;
    });
    data.message = result[0];
    if(data){
        TranzilaParModel.create(data, function (err, par_fail) {
            if (err) {
                res.send(send_response(null, true, err));
            } else {
                if(par_fail){
                    console.log(par_fail);
                }
            }
        });
    }            
    console.log('fail');
    res.render(templatesDir + '/paymentfail.ejs', {
        title: 'Payment fail',
        data: data
    });
}

// Updates Payment Status
exports.UpdatePaymentStatus = function (req, res) {
    var PaymentsModel = mongoose.model('Payments');
    var id = req.body.payment_id;

    PaymentsModel.findOne({ _id: id }, function (err, payment) {
        if (err) {
            res.send(send_response(null, true, "Not Found"));
        } else {
            payment.payment_type = req.body.payment_type;
            payment.save(function (err) {
                if (err) {
                    res.send(send_response(null, true, parse_error(err)));
                } else {
                    res.send(send_response(null, false, "המידע עודכן בהצלחה"));
                }
            });
        }
    });
};

// Get total payments by date range
exports.GetTotalPayments = function (req, res) {
    var PaymentsModel = mongoose.model('Payments');
    PaymentsModel.find({ "dateAdded": { $gte: req.body.dateStart, $lte: req.body.dateEnd } }, function (err, paymentlist) {
        if (err) {
            res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
        } else {
            res.json({ paymentsArr: paymentlist, is_error: false, message: '' });
        }
    });
};

//Get Payment Status Report
exports.GetPaymentStatusReport = function (req, res) {
    var PaymentsModel = mongoose.model('Payments');
    var UserModel = mongoose.model('User');

    async.waterfall([
        function (callback) {
            UserModel.findOne({ "_id": req.body.user_id }, function (err, getuser) {
                if (err) {
                    res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
                } else {
                    var user_type = getuser.type;
                    callback(null, user_type);
                }
            });
        },
        function (user_type, callback) {
            console.log(user_type, 'data here');
            if (user_type == 'admin') {
                PaymentsModel.find({ "user_id": req.body.user_id }, function (err, paymentreportlist) {
                    if (err) {
                        res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
                    } else {
                        callback(null, paymentreportlist);
                    }
                });
            } else {
                res.send(send_response(null, true, "you are not admin"));
                //callback(null);
            }

        },
    ], function (err, result) {
        console.log(result);
        if (err) {
            res.send(send_response(null, true, "ERROR_USER_NOT_FOUNT"));
        } else {
            res.json({ paymentsArr: result, is_error: false, message: '' });
        }
    });
};