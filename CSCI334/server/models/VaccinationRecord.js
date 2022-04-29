const mongoose = require('mongoose')
const {autoPopulateField} = require("../utils/db");

// Create Schema
const VaccinationRecordSchema = new mongoose.Schema({
    vaccinationCode: {
        type : String,
        required: true,
        default: mongoose.Types.ObjectId
    },
    vaccinationType: {
        type : String,
        required: true,
        enum: ["Novavax", "AstraZeneca", "Pfizer"]
    },
    vaccinationStatus: {
        type : String,
        required: true,
        enum: ["Partial", "Complete"]
    },
    dateAdministered: {
        type : Date,
        required: true,
        validate: {
            validator: function(v) {
                return v <= Date.now();
            },
            message: props => `${props.value} must be in the past`
        }
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredGeneralPublic', required: true }
});

autoPopulateField(VaccinationRecordSchema, 'patient');

const VaccinationRecord = mongoose.model('VaccinationRecord', VaccinationRecordSchema);

module.exports = VaccinationRecord;