'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var ContactUsSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var ContactUsSchema = new Schema({
    name: {type: String, default: ''},
    phone: {type: String, default: ''},
    message: {type: String, default: ''},
    is_deleted: {type: Boolean, default: false},
    dateAdded: { type: Date, default: Date.now }
}, ContactUsSchemaOptions);

ContactUsSchema.plugin(autopopulate);

module.exports = mongoose.model('ContactUs', ContactUsSchema);