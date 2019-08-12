'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autopopulate = require('mongoose-autopopulate');
var authTypes = ['github', 'twitter', 'facebook', 'google', 'local'];

var schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
   // timestamps: {date_add: 'date_add', last_mod: 'last_mod'}
};

var UserSchema = new Schema({
    first_name: {type: String ,default : ""},
    last_name: {type: String ,default : ""},
    user_name: {type: String ,default : ""},
    phone_number: { type: String, required: true},
    email: { type: String, lowercase: true},
    type: { type: String, default:'User'},
    hashedPassword: {type: String, required: true},
    fcmRegId: String,
    status: { type: Boolean, default: false },
    // licence_num : String,
    pin: String,
    avatar: {type: String, default: ''},
    active: { type: Boolean, default: 1 },
    provider: { type: String, default: 'local' },
    salt: String,
    is_deleted: { type: Boolean, default: false },
    date_of_birth: { type: Date, default: Date.now },
    last_mod: { type: Date, default: Date.now },
    facebook: {},
    twitter: {},
    google: {},
    github: {}
}, schemaOptions);

UserSchema.plugin(autopopulate);

UserSchema
    .pre('save', function (next) {
        this.last_mod = new Date();
        return next();
    });    

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });


/**
 * Validations
 */

// Validate empty phone
UserSchema
    .path('phone_number')
    .validate(function (phone_number) {
        if (authTypes.indexOf(this.provider) !== -1)
            return true;
        return phone_number.length;
    }, 'phone_number number cannot be blank');

// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function (hashedPassword) {
        if (authTypes.indexOf(this.provider) !== -1)
            return true;
        return hashedPassword.length;
    }, 'Password cannot be blank');

// Validate Phone is not taken
UserSchema
    .path('phone_number')
    .validate(function (value, respond) {
        var self = this;
        this.constructor.findOne({ phone_number: value }, function (err, user) {
            if (err)
                throw err;
            if (user) {
                if (self.id === user.id)
                    return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified phone_number number is already in use.');

var validatePresenceOf = function (value) {
    return value && value.length;
};
/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
    this.last_updated = new Date();
    if (!this.isNew) {
        return next();
    }
    if (this.first_name === null) {
        this.first_name = "";
        return next();
    }
    var self = this;
    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
        next(new Error('Invalid password'));
    }
    else {
            next();
        }
});
/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {

        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },
    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password || !this.salt)
            return '';
        var salt = new Buffer(this.salt, 'base64');
        var pwd = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');

        return pwd;
    }
};

module.exports = mongoose.model('User', UserSchema);
