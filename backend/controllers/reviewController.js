const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Submit a review for a completed booking
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Ensure booking matches the logged in client
    if (booking.client.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to review this booking');
    }

    // Ensure booking is completed
    if (booking.status !== 'Completed') {
        res.status(400);
        throw new Error('You can only review completed bookings');
    }

    // Ensure no existing review for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this booking');
    }

    const review = await Review.create({
        booking: bookingId,
        provider: booking.provider,
        client: req.user.id,
        rating,
        comment
    });

    res.status(201).json(review);
});

module.exports = { createReview };
