const {extendSchema} = require('../utils/db');
const userSchema = require('./User');
const bcrypt = require('bcryptjs');
const {encryptPassword} = require("../utils/general");
const faker = require("faker");
const moment = require('moment');
const {createAuthToken} = require("../utils/general");

// Create Schema
const RegisteredUserSchema = extendSchema(userSchema, {
    password: {
        type: String,
        required: true,
        select: false,
        set: (p) => { return encryptPassword(p)}
    },
    passwordReset: {
        temporaryPassword: {
            type: String,
            set: (p) => { return encryptPassword(p)}
        },
        expiry: {
            type: Date
        }
    },
    registrationDate: {
        required: true,
        type: Date,
        default: Date.now
    },
    accessToken: {
        type: String
    },
})
// this is not persisted and is just used for testing
RegisteredUserSchema.virtual('rawPassword').get(function() {
    return this.rawPassword;
}).set(function(rPassword) {
    this.rawPassword = rPassword;
});

RegisteredUserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

RegisteredUserSchema.methods.compareTemporaryPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordReset.temporaryPassword)
};

RegisteredUserSchema.methods.isTemporaryExpiryValid = function() {
    if(!this.passwordReset || !this.passwordReset.expiry) return false;
    return moment().isBefore(this.passwordReset.expiry);
};

RegisteredUserSchema.methods.setTemporaryPassword = function() {
    let rawTemporaryPassword = faker.internet.password();
    this.passwordReset.temporaryPassword = rawTemporaryPassword;
    this.passwordReset.expiry = moment().add(1, "hour");
    return rawTemporaryPassword;
};

RegisteredUserSchema.methods.setAccessToken = function() {
    this.accessToken = createAuthToken(this.id, this.type);
};

RegisteredUserSchema.methods.revokeAccessToken = function() {
    this.accessToken = undefined;
};

module.exports = RegisteredUserSchema;