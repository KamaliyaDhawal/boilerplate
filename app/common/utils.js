'use strict';

var _ = require('lodash');
var mongoose = require("mongoose");


function get_seller_by_hierarchy(user, callback) {

    var user_id = user._id;

    var User = mongoose.model('User');
    var Relation = mongoose.model('Relation');


    if (!user || !(user.role === "seller")) {
        callback(new Error("User can not be null and must be seller"), null);
        return;
    }

    var all_users = [];

    if (user.company_role.role_name === 'Admin') {
        User.find({ company: user.company }).exec(function (err, docs) {
            if (err) {
                callback(new Error(err.message), null);
                return;
            } else {
                callback(null, docs);
                return;
            }
        });
    } else {

        function getChild(user_ids) {
            Relation.find({ heads: { $in: user_ids } }).exec(function (err, relations) {
                if (!err && relations && relations.length > 0) {
                    var tempUsersIds = [];
                    _.each(relations, function (usr) {
                        tempUsersIds.push(usr.user);
                        all_users.push(usr.user);
                    });
                    getChild(tempUsersIds);
                } else {
                    all_users.push(user._id);
                    User.find({ _id: { $in: all_users } }).exec(function (err, users) {
                        if (err) {
                            callback(new Error(err.message), null);
                            return;
                        } else {
                            callback(null, users);
                            return;
                        }
                    });

                }
            });
        }

        getChild([user._id]);
    }
};

function get_av_contact_person(buyer_id, callback) {
    var EmpBuyerRelation = mongoose.model("EmpBuyerRelation");
    EmpBuyerRelation.find({ buyer: buyer_id }).populate("employee").exec(function (error, relations) {
        if (relations) {
            var temp = relations.map(function (item) {
                return item.employee;
            });
            callback(null, temp);
        } else {
            callback(error, null);
        }
    });
};

function get_buyers_from_territory(territory_id, type, callback) {
    var Company = mongoose.model("Company");
    var User = mongoose.model("User");
    var where = {};
    if (type == "CITY") {
        where.city = territory_id;
    } else {
        where.state = territory_id;
    }
    where.company_type = "buyer";
    where.is_deleted = false;
    Company.find(where).select("_id").exec(function (err, ids) {
        if (err) {
            callback(null, err);
        } else {
            var temp_companies = ids.map(function (o) {
                return o._id;
            });
            User.find({ company: { $in: temp_companies }, role: "buyer" }).populate("company").exec(function(er1, users){
                callback(er1, users);
            });
        }
    });
}

exports.get_children = get_seller_by_hierarchy;
exports.get_av_contact_person = get_av_contact_person;
exports.get_buyers_from_territory = get_buyers_from_territory;
