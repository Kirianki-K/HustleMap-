const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProviderProfile',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        maxlength: 300
    }
}, {
    timestamps: true
});

// Static method to get average rating and save
reviewSchema.statics.getAverageRating = async function (providerId) {
    const obj = await this.aggregate([
        {
            $match: { provider: providerId }
        },
        {
            $group: {
                _id: '$provider',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        if (obj[0]) {
            await this.model('ProviderProfile').findByIdAndUpdate(providerId, {
                averageRating: Math.round(obj[0].averageRating * 10) / 10,
                numReviews: obj[0].numReviews
            });
        } else {
            await this.model('ProviderProfile').findByIdAndUpdate(providerId, {
                averageRating: 0,
                numReviews: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
    await this.constructor.getAverageRating(this.provider);
});

// Call getAverageRating after remove
reviewSchema.post('remove', async function () {
    await this.constructor.getAverageRating(this.provider);
});

module.exports = mongoose.model('Review', reviewSchema);
