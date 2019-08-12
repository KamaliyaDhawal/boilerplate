/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.TZ = 'Asia/Jerusalem';

var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var config = require('./config/environment');
var cors = require('cors');
var fs = require('fs');
process.binding('http_parser').HTTPParser = require('./libs/http-parser.js').HTTPParser;


// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});



var folders = ["public","public/temp", "public/uploads", "statics"];
folders.forEach(function(f){
    if (!fs.existsSync(f)){
        fs.mkdirSync(f);
    }   
});

var options = {
    max: 50,
    maxAge: 1000 * 60 * 5,
    modelValues: true
};
var monc = require('monc');
monc.install(mongoose, options);


// Populate DB with sample data
if (config.seedDB) {
    require('./config/seed');
}

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
    serveClient: config.env !== 'production',
    path: '/socket.io-client'
});

app.use(express.static('statics'));

function logger(req, res, next) {
    //    console.log(new Date(), req.method, req.url);
    //    console.log(req.hostname);

    // attach companyid in req


    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, companyId, Authorization, Cache-Control, Pragma, Origin";//"Content-Type, Accept";//

    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        next();
    } else {
        next();
    }
}
app.use(cors());
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./models')(null, mongoose);
require('./routes')(app);
require('./common/common');

app.use(function (req, res, next) {
    //var cid = req.get('companyId');
    // console.log("+++++++++++++ Company Id : " + cid);
    // console.log("TOKEN : ----> " + req.get("Authorization"));
    // if (cid && cid !== null && cid !== undefined && cid !== "null") {
    //     req.companyId = cid;
    // }
    var langArry = ['en','ita'];
        var enMeaages = require('./languages/en.js');
        var hebMessages = require('./languages/he.js');
        req.enMessage = enMeaages ;
        req.heMessage = hebMessages ;

    //console.log("lang msg -->",req.message.ENTER_SEARCH_TEXT);
    next();
});

var error_handling = require('./common/exception_handling');

function checkAuth(err, req, res, next) {
    if (err.name.indexOf('Unauthorized') !== -1) {
        res.status(401);
        res.send({ data: null, is_error: true, message: "Unauthorized Request, Please sign in first." });
    } else {
        if (err) {
            console.log("************************** Error Occured ***********************************");
            var config = require('./config/environment');
            var jwt = require('jsonwebtoken');
            var expressJwt = require('express-jwt');
            var validateJwt = expressJwt({ secret: config.secrets.session });
            var headers = req.headers;
            console.log(headers);
            validateJwt(req, res, function () {
                var data = { headers: headers, user: req.user };
                error_handling.handle_error(err, data);
                return next(err);
            });
        } else {
            return next();
        }
    }
}
app.use(checkAuth);

app.get('/', function (req, res) {
    res.send("CommonNG-Pro running on port : " + config.port);
});
// Start server
server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
module.exports = app;



