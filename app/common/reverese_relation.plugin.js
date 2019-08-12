var mongoose = require('mongoose');
var async = require("async");

module.exports = function (schema) {
    var pathsToPopulate = [];

    eachPathRecursive(schema, function (pathname, schemaType) {
        var option;
        if (schemaType.options && schemaType.options.reverse) {
            option = schemaType.options.reverse;
            pathsToPopulate.push({
                options: defaultOptions(pathname, schemaType.options),
                reverse: option
            });
        } else if (schemaType.options &&
            schemaType.options.type &&
            schemaType.options.type[0] &&
            schemaType.options.type[0].reverse) {
            option = schemaType.options.type[0].reverse;
            pathsToPopulate.push({
                options: defaultOptions(pathname, schemaType.options.type[0]),
                reverse: option
            });
        }
    });

    //console.log(pathsToPopulate);

    var preSaveHandler = function (next) {
        this.wasNew = this.isNew;
        return next();

    }

    var postSaveHandler = function (document, next) {
        var self = this;
        if (self.wasNew) {
            async.eachSeries(pathsToPopulate, function (pathToReverse, callback) {
                var value = pathToReverse.reverse;
                var options = pathToReverse.options
                var model = options.model;
                console.log("reverse---------------");
                console.log(self[options.path]);
                mongoose.model(model).findOne({ _id: self[options.path] }).exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                        callback(null);
                    } else {
                        if (doc) {
                            if (!doc[value]) {
                                doc[value] = [];
                            }
                            // console.log(doc);
                            // console.log(doc[value]);
                            // http://stackoverflow.com/questions/8834126/how-to-efficiently-check-if-variable-is-array-or-object-in-nodejs-v8
                            if (doc[value]) {
                                if (doc[value].constructor === Object) {
                                    doc[value] = document._id;
                                }
                                if (doc[value].constructor === Array) {
                                    doc[value].push(document._id);
                                }
                            } else {
                                doc[value] = document._id;
                            }
                            doc.save(function (ser) {
                                if (ser) { console.log(ser); }
                                callback(null);
                            });
                        } else{
                            console.log("Reverse Plugin - Record not found");
                            callback(null);
                        }
                    }
                });
            }, function done() {
                return next();
            });

        } else {
            return next();
        }

    }

    schema.
        pre('save', preSaveHandler).
        post("save", postSaveHandler);
};

function defaultOptions(pathname, v) {
    var ret = { path: pathname };
    if (v.ref) {
        ret.model = v.ref;
    }
    return ret;
}



function eachPathRecursive(schema, handler, path) {
    if (!path) {
        path = [];
    }
    schema.eachPath(function (pathname, schemaType) {
        path.push(pathname);
        if (schemaType.schema) {
            eachPathRecursive(schemaType.schema, handler, path);
        } else {
            handler(path.join('.'), schemaType);
        }
        path.pop();
    });
}