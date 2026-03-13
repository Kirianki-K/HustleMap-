const express = require('express');
const router = express.Router();
const { createProviderProfile, getProviders, getProvidersForMap, getProviderById, updateProviderProfile } = require('../controllers/providerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getProviders).post(protect, createProviderProfile);
router.route('/me').put(protect, updateProviderProfile);
// /map must be before /:id so Express doesn't treat "map" as an id param
router.route('/map').get(getProvidersForMap);
router.route('/:id').get(getProviderById);

module.exports = router;
