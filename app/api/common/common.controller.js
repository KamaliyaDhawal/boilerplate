var _ = require('lodash');
var mongoose = require("mongoose");
var async = require('async');

var unrestricted_to_company = ['Company', 'User', 'State', 'Country', 'City', 'SPNote', 'EmpReport', "Email"];

// Get list of things
exports.get = function (req, res) {
    var col = req.params.collection;
    var where = {};
    if (req.companyId) {
        var result = unrestricted_to_company.indexOf(col);
        if (result < 0 && req.companyId) {
            where = { company: req.companyId };
        }
    }
    var Model = mongoose.model(req.params.collection);
    Model.find({ $and: [{ $or: [{ is_deleted: false }, { is_deleted: null }] }, where] }, function (err, annos) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            res.send(send_response(annos));
        }
    }
    );
};

// Get a single thing
exports.getById = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    Model.findOne({ _id: req.params.id }, function (err, annos) {
        if (err) {
            res.send(send_response(null, true, err));
        } else {
            res.send(send_response(annos));
        }
    });
};

// Creates a new thing in the DB.
exports.createnew = function (req, res) {
    if (req.companyId) {
        if (unrestricted_to_company.indexOf(req.params.collection) < 0) {
            req.body.company = req.companyId;
        }
    }
    var Model = mongoose.model(req.params.collection);
    var data = new Model(req.body);

    Model.create(data, function (err, mod) {
        if (err) {
            console.log(err);
            res.send(send_response(null, true, err.message));
        } else {
            res.send(send_response(mod));
        }
    });
};

// Updates an existing thing in the DB.
exports.update = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    var id = req.params.id;
    if (!id) {
        id = req.body._id;
    }
    if (req.body._id) {
        delete req.body._id;
    }
    Model.findById(id, function (err, thing) {
        if (err) {
            res.send(send_response(null, true, parse_error(err)));
        }
        if (!thing) {
            res.send(send_response(null, true, "אין מידע זמין"));
            return;
        }
        //var updated = _.merge(thing, req.body);
        var updated = _.assign(thing, req.body);
        if (!updated) {
            res.send(send_response(null, true, "אין מידע זמין"));
            return;
        }
        updated.save(function (err) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    //console.log(1);
                    //res.send(send_response(null, true, "type sequence should be unique"));
                    res.send(send_response(null, true, "סוג רצף צריך להיות ייחודי"));

                } else {
                    //console.log(2);
                    res.send(send_response(null, true, parse_error(err)));
                }
                return;
            } else {

                res.send(send_response(thing,false,"העדכון בוצע בהצלחה"));
            }
        });
    });
};

exports.softdestroy = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    var id = req.params.id;

    Model.findById(id, function (err, thing) {
        if (err) {
            res.send(send_response(null, true, err));
        }
        if (!thing) {
            res.send(send_response(null, true, "Not Found"));
        }
        thing.is_deleted = true;
        thing.save(function (err) {
            if (err) {
                res.send(send_response(null, true, err));
            } else {

                res.send(send_response(thing));
            }
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    Model.findById(req.params.id, function (err, thing) {
        if (err) {
            return res.send(send_response(null, true, err));
        }
        if (!thing) {
            return res.send(send_response(null, true, "Not Found"));
        }
        thing.remove(function (err) {
            if (err) {
                return res.send(send_response(null, true, err));
            }

            return res.status(204).send(send_response({}));
        });
    });
};

/**
 * limit = {skip:0, limit:10}
 * sort = {"fild_name" : -1/1}
 * 
 * "with" : {
		"model" : "SallerBuyer",
		"source" : "buyer",
		"destination" : "buyer",
		"json_key" : "saller_buyer",
		"fields" : "",
		"count" : false
	}
 * 
 * */
exports.executeQuery = function (req, res) {
    var Model = mongoose.model(req.params.collection);
    var where = req.body.where;
    var populate = req.body.populate;
    var fields = req.body.fields;
    var sort = req.body.sort;
    var limit = req.body.limit;
    var in_cls = req.body.in;
    var count = req.body.count;
    var with_arr = req.body.with;

    if (!isEmpty(where) && !isEmpty(in_cls)) {
        res.send(send_response(null, true, "You can not send both WHERE and IN condition togather."));
        return;
    }
    if (!fields) {
        fields = '';
    }
    if (req.params.collection === 'User') {
        fields = fields + " -hashedPassword -salt";
    }
    var query = Model.find({}, fields);
    if (!isEmpty(where)) {
        query = Model.find(where, fields);
    }
    if (!isEmpty(in_cls)) {
        var temp = {};
        temp[in_cls.key] = {
            $in: in_cls.val
        };
        query = Model.find(temp, fields);
    }

    if (populate) {
        query = query.populate(populate);
    }
    if (sort) {
        query = query.sort(sort);
    }
    if (!isEmpty(limit)) {
        query = query.skip(limit.skip).limit(limit.limit);
    }
    if (count === true) {
        query.count().exec(function (err, annos) {
            if (err) {
                res.send(send_response(null, true, err));
            } else {
                res.send(send_response(annos));
            }
        });
    } else {
        var all_data = [];
        async.waterfall([
            function (callback_wf) {
                query.exec(function (err, annos) {
                    if (err) {
                        callback_wf(err);
                    } else {
                        all_data = JSON.parse(JSON.stringify(annos));
                        callback_wf(null);
                    }
                });
            },
            function (callback_wf) {
                if (!isEmpty(with_arr)) {
                    if (!(with_arr.constructor === Array)) {
                        res.send(send_response(null, true, "Please pass array in with"));
                        return;
                    }
                    async.eachSeries(with_arr, function (with_data, callback_outer) {
                        if (!isEmpty(with_data) || with_data.model) {

                            async.eachSeries(all_data, function (item, callback) {
                                var InnerModel = mongoose.model(with_data.model);
                                var temp_source_arr = with_data.source.split('.');
                                var temp = item;
                                temp_source_arr.forEach(function (x) {
                                    temp = temp[x.toString()];
                                });
                                if (temp.constructor === Array) {
                                    res.send(send_response(null, true, "You can not add with block for array."));
                                    return;
                                }
                                if (temp.constructor === Object) {
                                    temp = temp._id;
                                }
                                if (with_data.destination === "_id") {
                                    //console.log(temp);
                                    temp = mongoose.Types.ObjectId(temp);
                                }
                                var inner_where = "{\"" + with_data.destination + "\":\"" + temp + "\"}";
                                var inner_query = InnerModel.find(JSON.parse(inner_where), with_data.fields);
                                if (with_data.populate) {
                                    inner_query = inner_query.populate(with_data.populate);
                                }
                                //console.log(inner_where);
                                if (with_data.count && with_data.count === true) {
                                    inner_query.count().exec(function (inner_err, docs) {
                                        if (inner_err) {
                                            item[with_data.json_key + "_error"] = inner_err.message;
                                        } else {
                                            item[with_data.json_key] = docs;
                                        }
                                        callback(null);
                                    });
                                } else {
                                    inner_query.exec(function (inner_err, docs) {
                                        if (inner_err) {
                                            item[with_data.json_key + "_error"] = inner_err.message;
                                        } else {
                                            item[with_data.json_key] = docs;
                                        }
                                        callback(null);
                                    });
                                }

                            }, function done() {
                                callback_outer(null);
                            });

                        } else {
                            async.setImmediate(function () {
                                callback_outer(null);
                            });
                        }


                    }, function () {
                        callback_wf(null);
                    })


                } else {
                    async.setImmediate(function () {
                        callback_wf(null);
                    });
                }
            }
        ], function (error, result) {
            if (error) {
                res.send(send_response(null, true, error));
            } else {
                res.send(send_response(all_data));
            }
        });
    }
};

exports.metadata = function (req, res) {
    //console.log(req);
    var Model = mongoose.model(req.params.collection);
    var paths = Model.schema.paths;

    var keys = Object.keys(Model.schema.paths);
    var retval = [];
    var type = req.params.type;
    if (type === 'plist') {
        keys.forEach(function (key) {
            if (key !== "__v") {
                var obj = paths[key];
                if (key === '_id') {
                    var str = "<key>entity_id</key><string>_id</string>";
                    retval.push(str);
                } else {
                    var str = "<key>" + key + "</key><string>" + key + "</string>";
                    retval.push(str);
                }
            }
        });
        res.setHeader('content-type', 'application/xml');
        res.send(retval.join("\n"));
    } else if (type === 'json') {
        var temp_json = [];
        keys.forEach(function (key) {
            if (key !== "__v") {
                var temp_obj = Model.schema.paths[key];


                var add_obj = {};
                add_obj[key] = temp_obj.instance;

                temp_json.push(add_obj)
            }
        });

        res.send(temp_json);
    }
};
