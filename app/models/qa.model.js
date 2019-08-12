'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var QASchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var QASchema = new Schema({
    question: {type: String, default: ''},
    answer: {type: String, default: ''},
    is_deleted: { type: Boolean, default: false },
    dateAdded: { type: Date, default: Date.now }
}, QASchemaOptions);

QASchema.plugin(autopopulate);

module.exports = mongoose.model('QA', QASchema);
