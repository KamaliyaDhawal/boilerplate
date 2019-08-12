'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var TranzilaParametersSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var TranzilaParametersSchema = new Schema({
    Response: {type: String, default: '' },
    o_cred_type: {type: String, default: '' },
    o_tranmode: {type: String, default: '' },
    lang: {type: String, default: '' },
    expmonth: {type: String, default: '' },
    myid: {type: String, default: '' },
    amp: {type: String, default: '' },
    currency: {type: String, default: '' },
    ccno: {type: String, default: '' },
    o_npay: {type: String, default: '' },
    expyear: {type: String, default: '' },
    supplier: {type: String, default: '' },
    guid: {type: String, default: '' },
    sum: {type: String, default: '' },
    benid: {type: String, default: '' },
    ConfirmationCode: {type: String, default: '' },
    cardtype: {type: String, default: '' },
    cardissuer: {type: String, default: '' },
    index: {type: String, default: '' },
    Tempref: {type: String, default: '' },
    message: {type: String, default: '' },
    dateAdded: { type: Date, default: Date.now }
}, TranzilaParametersSchemaOptions);

TranzilaParametersSchema.plugin(autopopulate);

module.exports = mongoose.model('TranzilaParameters', TranzilaParametersSchema);
