const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        unique: true,
        required: true
    },
    designation: {
        type: String,
        default: '',
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

let Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;