'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');

var PaymentsSchemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

var PaymentsSchema = new Schema({
    paymentid: {type: Number, default: 1000 },
    user_id: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true},
    receiver_id: String,
    receiver_name: String,
    amount: {type: Number, default: 0 },
    status: {type: Number, default: 0 },
    message: String,
    payment_type: String,
    // pay_type: String,
    // tranzila_token: String,
    // freePhone_token:String,
    dateAdded: { type: Date, default: Date.now }
}, PaymentsSchemaOptions);

PaymentsSchema.plugin(autopopulate);

PaymentsSchema
    .pre('save', function (next) {
        this.wasNew = this.isNew;
        var self = this;
        if(this.wasNew){
            var PaymentsModel = mongoose.model("Payments");
            PaymentsModel.find().limit(1).sort({ dateAdded: -1 }).exec(function (err, docs) {
                if (err) {
                    return next();
                } else {
                    if (docs && docs.length > 0) {
                    var payid = docs[0].paymentid + 1;
                    self.paymentid = payid;
                    return next();
                    }else{
                        return next();
                    }
                }
            });
        }else{
            return next();
        }
    });

module.exports = mongoose.model('Payments', PaymentsSchema);
