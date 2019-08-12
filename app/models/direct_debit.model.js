'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var DirectDebitSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var DirectDebitSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true},
    receiver_id : String,
    receiver_name: String,
    amount: {type: Number, default: 0 },
    date: {type: Number, default: '' },
    payment_type: {type: Number, default: '' },
    dateAdded: { type: Date, default: Date.now },
    is_deleted: {type: Boolean, default: false},
}, DirectDebitSchemaOptions);

DirectDebitSchema.plugin(autopopulate);

module.exports = mongoose.model('DirectDebit', DirectDebitSchema);
