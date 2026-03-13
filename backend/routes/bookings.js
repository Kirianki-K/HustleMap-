const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, getBookings);
router.route('/:id/status').put(protect, updateBookingStatus);
router.route('/:id').delete(protect, cancelBooking);

module.exports = router;
