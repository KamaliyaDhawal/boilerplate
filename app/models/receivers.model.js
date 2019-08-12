'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var ReceiversSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var ReceiversSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true},
    receiver_id: String,
    receiver_name: String,
    is_deleted: {type: Boolean, default: false},
    dateAdded: { type: Date, default: Date.now }
}, ReceiversSchemaOptions);

ReceiversSchema.plugin(autopopulate);

module.exports = mongoose.model('Receivers', ReceiversSchema);