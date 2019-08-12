var mongoose = require('mongoose');
var Model = mongoose.model('Errorlog');

if (process.env.NODE_ENV !== 'development') {

    process.on('uncaughtException', function (err) {
        var log = {
            "msg":err.stack
        };
        console.log(log);
        Model.create(log, function (err, error_data) {
            if (err) {
                // res.send(send_response(null, true, err));
            } else {
                console.log(error_data);
                //res.send(send_response(error_data, false, res.message));
            }
        });    

    });

    exports.handle_error = function (err, data) {
        var log = {
            "msg":err.stack
        };
        console.log(log);
        Model.create(log, function (err, error_data) {
            if (err) {
                // res.send(send_response(null, true, err));
            } else {
                console.log(error_data);
                //res.send(send_response(error_data, false, res.message));
            }
        });    
    };
} else{
    exports.handle_error = function(err, data) {};
}