/**
 * Run once to clean up any ProviderProfile documents that have a broken
 * locationCoords field (type set but coordinates empty/missing).
 * These were created before the schema fix and corrupt the 2dsphere index.
 *
 * Usage:  node backend/scripts/fix-location-coords.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function run() {
    await connectDB();
    console.log('Connected to MongoDB');

    // Remove the invalid locationCoords sub-doc from affected documents
    const result = await mongoose.connection.collection('providerprofiles').updateMany(
        {
            $or: [
                // Has the type field set but coordinates is empty array
                { 'locationCoords.coordinates': { $size: 0 } },
                // Has locationCoords but coordinates is missing entirely
                { locationCoords: { $exists: true }, 'locationCoords.coordinates': { $exists: false } }
            ]
        },
        {
            $unset: { locationCoords: '' }
        }
    );

    console.log(`Fixed ${result.modifiedCount} document(s) with broken locationCoords.`);

    // Drop and let Mongoose recreate the 2dsphere index correctly on next server start
    try {
        await mongoose.connection.collection('providerprofiles').dropIndex('locationCoords_2dsphere');
        console.log('Dropped old 2dsphere index — it will be recreated correctly on server restart.');
    } catch {
        console.log('No existing 2dsphere index to drop (that is fine).');
    }

    await mongoose.disconnect();
    console.log('Done. Restart the backend now.');
}

run().catch(err => { console.error(err); process.exit(1); });
