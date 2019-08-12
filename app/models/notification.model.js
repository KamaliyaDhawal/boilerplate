'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var NotificationSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var NotificationSchema = new Schema({
    title: String,
    msg: String,
    fcmRegIdArray: [],
    dateAdded: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
}, NotificationSchemaOptions);

NotificationSchema.plugin(autopopulate);

module.exports = mongoose.model('Notification', NotificationSchema);
