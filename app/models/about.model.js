'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var AboutSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var AboutSchema = new Schema({
    phone: {type: String, default: ''},
    email: { type: String, lowercase: true},
    address: {type: String, default: ''},
    text: {type: String, default: ''},
    is_deleted: {type: Boolean, default: false},
    dateAdded: { type: Date, default: Date.now }
}, AboutSchemaOptions);

AboutSchema.plugin(autopopulate);

module.exports = mongoose.model('About', AboutSchema);