var _ = require('lodash');
var jsonxml = require('jsontoxml'); 

send_response = function (data, is_error, message, status_code) {
    var json = { data: data, is_error: is_error, message: message };
    if (is_error === undefined) {
        json.is_error = false;
    }
    if (message === undefined) {
        json.message = '';
    }

    return json;
};

send_response_xml = function (data, is_error, message, status_code) {

    var json = { data: data, is_error: is_error, message: message };
    if (is_error === undefined) {
        json.is_error = false;
    }
    if (message === undefined) {
        json.message = '';
    }
    var response = { response: json };

    return jsonxml(response);
};



/*
 * Check JSON object is empty or not
 * @param {type} obj
 * @returns {Boolean}
 */
isEmpty = function (obj) {
    // null and undefined are "empty"
    if (obj == null)
        return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }

    return true;
};


parse_error = function (err) {
    var keys = _.keys(err.errors);
    var messages = [];
    if (err.errors) {
        keys.forEach(function (key) {
            var obj = err.errors[key];
            messages.push(obj.message);
        });
    } else {
        messages.push(err.message);
    }

    if (messages.length > 0) {
        return messages[0];
    } else {
        return "";
    }

};


pad = function (num, size) {
    var s = num + "";
    while (s.length < size)
        s = "0" + s;
    return s;
};
