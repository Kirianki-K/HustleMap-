const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ProviderProfile = require('../models/ProviderProfile');
const User = require('../models/User');

// @desc    Apply to become a Hustler (Create Profile)
// @route   POST /api/providers
// @access  Private
const createProviderProfile = asyncHandler(async (req, res) => {
    const { phone, category, bio, price, locationName, locationCoords, availableDays, preferredContactMethod } = req.body;

    // Check if profile already exists
    const existingProfile = await ProviderProfile.findOne({ user: req.user.id });
    if (existingProfile) {
        res.status(400);
        throw new Error('Provider profile already exists');
    }

    const profileData = {
        user: req.user.id,
        phone, category, bio, price, locationName, availableDays, preferredContactMethod
    };

    // Only include locationCoords if a valid GeoJSON point was provided
    if (locationCoords && locationCoords.coordinates && locationCoords.coordinates.length === 2) {
        profileData.locationCoords = {
            type: 'Point',
            coordinates: locationCoords.coordinates // [longitude, latitude]
        };
    }

    const profile = await ProviderProfile.create(profileData);

    // Update user role to provider
    await User.findByIdAndUpdate(req.user.id, { role: 'provider' });

    res.status(201).json(profile);
});

// @desc    Get all providers (supports filtering)
// @route   GET /api/providers
// @access  Public
const getProviders = asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
        query.category = category;
    }
    
    if (search) {
        const matchingUsers = await User.find({
            name: { $regex: search, $options: 'i' }
        }).select('_id');
        
        const userIds = matchingUsers.map(user => user._id);

        query.$or = [
            { bio: { $regex: search, $options: 'i' } },
            { locationName: { $regex: search, $options: 'i' } },
            { user: { $in: userIds } }
        ];
    }

    const providers = await ProviderProfile.find(query).populate('user', 'name email');
    res.status(200).json(providers);
});

// @desc    Get all providers that have coordinates (for the map)
// @route   GET /api/providers/map
// @access  Public
const getProvidersForMap = asyncHandler(async (req, res) => {
    const providers = await ProviderProfile.find({
        locationCoords: { $exists: true },
        'locationCoords.coordinates': { $exists: true, $ne: [] }
    }).populate('user', 'name email').select('locationCoords category locationName user averageRating');

    res.status(200).json(providers);
});

// @desc    Get specific provider profile
// @route   GET /api/providers/:id
// @access  Public
const getProviderById = asyncHandler(async (req, res) => {
    const provider = await ProviderProfile.findById(req.params.id).populate('user', 'name email');
    if (!provider) {
        res.status(404);
        throw new Error('Provider not found');
    }
    res.status(200).json(provider);
});

// @desc    Update provider profile
// @route   PUT /api/providers/me
// @access  Private
const updateProviderProfile = asyncHandler(async (req, res) => {
    let profile = await ProviderProfile.findOne({ user: req.user.id });
    if (!profile) {
        res.status(404);
        throw new Error('Provider profile not found');
    }

    profile = await ProviderProfile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(profile);
});

module.exports = { createProviderProfile, getProviders, getProvidersForMap, getProviderById, updateProviderProfile };
