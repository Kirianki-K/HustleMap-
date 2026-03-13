const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Laundry', 'Welding', 'Hair & Beauty', 'Delivery', 'Cleaning', 'Electronics', 'Tutoring', 'Repairs']
    },
    bio: {
        type: String,
        required: [true, 'Please add a short bio'],
        maxlength: [120, 'Bio cannot be more than 120 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add your minimum rate']
    },
    locationName: {
        type: String
    },
    locationCoords: {
        type: {
            type: String,
            enum: ['Point']
            // No default here — prevents Mongoose from writing
            // { type: 'Point', coordinates: [] } on every document,
            // which is invalid GeoJSON and breaks the 2dsphere index.
        },
        coordinates: {
            type: [Number] // [longitude, latitude]
        }
    },
    avatarUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    availableDays: {
        type: [String],
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        default: []
    },
    preferredContactMethod: {
        type: String,
        enum: ['Phone', 'WhatsApp', 'SMS'],
        required: [true, 'Please add a preferred contact method']
    },
    averageRating: {
        type: Number,
        min: [0, 'Rating cannot be negative'],  // 0 = unrated — was min:1 which failed on default
        max: [5, 'Rating cannot exceed 5'],
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Sparse 2dsphere index: only indexes documents that actually have coordinates.
// Without sparse:true, MongoDB tries to index the missing/empty locationCoords
// fields on providers who didn't set a location, which breaks the index.
providerProfileSchema.index({ locationCoords: '2dsphere' }, { sparse: true });

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
