const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bookings = new Schema({
    packageName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    dateOfTrip: {
        type: Date,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Bookings', Bookings);
