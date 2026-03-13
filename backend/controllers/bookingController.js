const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const ProviderProfile = require('../models/ProviderProfile');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const { providerId, date, time } = req.body;

    // Validate provider existing
    const provider = await ProviderProfile.findById(providerId);
    if (!provider) {
        res.status(404);
        throw new Error('Provider not found');
    }

    if (provider.user.toString() === req.user.id) {
        res.status(400);
        throw new Error('You cannot book yourself');
    }

    const booking = await Booking.create({
        client: req.user.id,
        provider: providerId,
        date,
        time
    });

    res.status(201).json(booking);
});

// @desc    Get logged in user's bookings (as client or provider)
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
    // Check if the user is a provider
    const providerProfile = await ProviderProfile.findOne({ user: req.user.id });

    let bookings;
    if (providerProfile) {
        // Return all bookings where the user is either the client or the provider
        bookings = await Booking.find({
            $or: [
                { client: req.user.id },
                { provider: providerProfile._id }
            ]
        }).populate('client', 'name email').populate({ path: 'provider', populate: { path: 'user', select: 'name' } });
    } else {
        bookings = await Booking.find({ client: req.user.id })
            .populate('provider')
            .populate({ path: 'provider', populate: { path: 'user', select: 'name' } });
    }

    res.status(200).json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Ensure only the provider or client can update status
    const profile = await ProviderProfile.findOne({ user: req.user.id });
    const isProvider = profile && booking.provider.toString() === profile._id.toString();
    const isClient = booking.client.toString() === req.user.id;

    if (!isProvider && !isClient) {
        res.status(401);
        throw new Error('Not authorized to update this booking');
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    const profile = await ProviderProfile.findOne({ user: req.user.id });
    const isProvider = profile && booking.provider.toString() === profile._id.toString();
    const isClient = booking.client.toString() === req.user.id;

    if (!isProvider && !isClient) {
        res.status(401);
        throw new Error('Not authorized to cancel this booking');
    }

    // Use await booking.deleteOne() in Mongoose 6+ instead of remove()
    await booking.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Booking cancelled successfully' });
});

module.exports = { createBooking, getBookings, updateBookingStatus, cancelBooking };
