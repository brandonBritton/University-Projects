const mongoose = require('mongoose')
const {extendSchema} = require('../utils/db');
const registeredUserSchema = require('./RegisteredUser');
const userTypes = require('../_constants/usertypes');

// Create Schema
const RegisteredGeneralPublicSchema = extendSchema(registeredUserSchema, {

});

RegisteredGeneralPublicSchema.virtual('type').get(function () {
    return userTypes.GENERAL;
});


const RegisteredGeneralPublic = mongoose.model('RegisteredGeneralPublic', RegisteredGeneralPublicSchema);

module.exports = RegisteredGeneralPublic;