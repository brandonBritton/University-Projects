const mongoose = require('mongoose')
const validator = require('validator');

// Create Schema
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});
module.exports = UserSchema;