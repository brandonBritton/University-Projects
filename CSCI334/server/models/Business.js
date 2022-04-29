const mongoose = require('mongoose')
const {autoPopulateField} = require("../utils/db");
const {generate5CharacterCode} = require("../utils/general");

// Create Schema
const BusinessSchema = new mongoose.Schema({
    abn: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{11,11}$/.test(v);
            },
            message: props => `${props.value} is not a valid abn!`
        }
    },
    name: {
        type: String,
        required: true
    },
    // may caused a Exception if it is the same as others, that needs to be handled
    code: {
        type: String,
        default: generate5CharacterCode,
        unique: true,
        required: true
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true},
});

BusinessSchema.pre('save', async function() {
    while (await Business.findOne({code: this.code})){
        this.code = generate5CharacterCode();
    }
});

autoPopulateField(BusinessSchema, 'address');

const Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;