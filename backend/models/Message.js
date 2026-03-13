const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Deterministic room ID: sorted([senderId, receiverId]).join('_')
    roomId: {
        type: String,
        required: true,
        index: true
    },
    text: {
        type: String,
        required: [true, 'Message cannot be empty'],
        maxlength: [1000, 'Message cannot exceed 1000 characters'],
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
