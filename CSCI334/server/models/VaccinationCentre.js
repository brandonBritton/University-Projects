const mongoose = require('mongoose')
const {autoPopulateField} = require("../utils/db");

// Create Schema
const VaccinationCentreSchema = new mongoose.Schema({
    clinicName: {
        type : String,
        required: true
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    phone: {
        type : String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a phone!`
        }
    }
});

autoPopulateField(VaccinationCentreSchema, 'address');

const VaccinationCentre = mongoose.model('VaccinationCentre', VaccinationCentreSchema);

module.exports = VaccinationCentre;