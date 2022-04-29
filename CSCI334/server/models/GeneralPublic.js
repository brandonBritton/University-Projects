const mongoose = require('mongoose')
const {extendSchema} = require('../utils/db');
const userSchema = require('./User');

// Create Schema
const GeneralPublicSchema = extendSchema(userSchema, {

})

const GeneralPublic = mongoose.model('GeneralPublic', GeneralPublicSchema);

module.exports = GeneralPublic;