const mongoose = require('mongoose')

// Create Schema
const CoordinatesSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

const Coordinates = mongoose.model('Coordinates', CoordinatesSchema);

module.exports = Coordinates;