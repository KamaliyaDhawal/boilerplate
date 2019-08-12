'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var ErrorLogSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var ErrorLogSchema = new Schema({
    msg: String,
    dateAdded: { type: Date, default: Date.now },
}, ErrorLogSchemaOptions);

module.exports = mongoose.model('Errorlog', ErrorLogSchema);