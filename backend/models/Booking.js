const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProviderProfile',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide a booking date']
    },
    time: {
        type: String,
        required: [true, 'Please provide a booking time']
    },
    status: {
        type: String,
        enum: ['Pending', 'Pending Payment', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
