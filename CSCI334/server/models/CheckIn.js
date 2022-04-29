const mongoose = require('mongoose')
const {autoPopulateField} = require("../utils/db");

// Create Schema
const CheckInSchema = new mongoose.Schema({
    date: {
        type : Date,
        default: Date.now
    },
    // linked to RegisteredGeneralPublic or GeneralPublicUser (https://mongoosejs.com/docs/populate.html)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        // will look at the `userModel` property to find the right model.
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        required: true,
        enum: ['RegisteredGeneralPublic', 'GeneralPublic']
    },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    userNotified: {
        type: Boolean,
        default: false
    }
});
autoPopulateField(CheckInSchema, 'user');
autoPopulateField(CheckInSchema, 'business');

const CheckIn = mongoose.model('CheckIn', CheckInSchema);

module.exports = CheckIn;