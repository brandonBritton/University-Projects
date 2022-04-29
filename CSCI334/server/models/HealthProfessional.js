const mongoose = require('mongoose')
const {extendSchema} = require('../utils/db');
const registeredUserSchema = require('./RegisteredUser');
const userTypes = require('../_constants/usertypes');

// Create Schema
const HealthProfessionalSchema = extendSchema(registeredUserSchema, {
    healthID: {
        type: String,
        required: true,
        unique: true,
            validate: {
                validator: function(v) {
                    return /^[0-9]{11,11}$/.test(v);
                },
                message: props => `${props.value} is not a valid health id!`
            }
        }
});

HealthProfessionalSchema.virtual('type').get(function () {
    return userTypes.HEALTH;
});
const HealthProfessional = mongoose.model('HealthProfessional', HealthProfessionalSchema);

module.exports = HealthProfessional;