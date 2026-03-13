import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { providersAPI } from '../services/api';

const BecomeHelper = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone: '',
        category: '',
        bio: '',
        price: '',
        locationName: '',
        days: [],
        contact_method: ''
    });
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [coords, setCoords] = useState(null); // { lng, lat }
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const categories = [
        'Laundry', 'Welding', 'Hair & Beauty', 'Delivery',
        'Cleaning', 'Electronics', 'Tutoring', 'Repairs'
    ];

    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                days: checked
                    ? [...prev.days, value]
                    : prev.days.filter(d => d !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { longitude, latitude } = pos.coords;
                setCoords({ lng: longitude, lat: latitude });
                setLocating(false);
            },
            () => {
                setError('Could not detect your location. Please enter it manually.');
                setLocating(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!/^\+2547\d{8}$/.test(formData.phone)) {
            setError('Please enter a valid Kenyan phone number (e.g. +2547XXXXXXXX).');
            return;
        }
        if (!formData.category) {
            setError('Please select a category.');
            return;
        }
        if (formData.bio.length < 10) {
            setError('Please provide a short bio (at least 10 characters).');
            return;
        }
        const numericPrice = Number(formData.price);
        if (isNaN(numericPrice) || numericPrice < 100 || numericPrice > 100000) {
            setError('Please enter a realistic rate between 100 and 100,000 Ksh.');
            return;
        }
        if (!formData.contact_method) {
            setError('Please select a preferred contact method.');
            return;
        }

        const payload = {
            phone: formData.phone,
            category: formData.category,
            bio: formData.bio,
            price: numericPrice,
            locationName: formData.locationName,
            availableDays: formData.days,
            preferredContactMethod: formData.contact_method
        };

        // Add GeoJSON coords if user clicked "Detect My Location"
        if (coords) {
            payload.locationCoords = {
                type: 'Point',
                coordinates: [coords.lng, coords.lat] // GeoJSON: [longitude, latitude]
            };
        }

        setLoading(true);
        try {
            await providersAPI.createProviderProfile(payload);
            setSuccess(true);
            setFormData({ phone: '', category: '', bio: '', price: '', locationName: '', days: [], contact_method: '' });
            setCoords(null);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="max-w-xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">🚀 Become a Helper</h2>

                <form
                    onSubmit={handleSubmit}
                    className="bg-[#fffbe7] rounded-[1.2em] shadow-[0_2px_16px_rgba(49,130,206,0.08)] p-6 md:p-10 flex flex-col gap-5 border border-yellow-100"
                    autoComplete="off"
                    noValidate
                >
                    {/* Phone */}
                    <label className="flex flex-col font-medium text-slate-700 gap-1.5 cursor-pointer">
                        <span>Phone Number</span>
                        <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="+2547XXXXXXXX"
                            maxLength="13"
                            className="border-[1.5px] border-slate-300 rounded-lg px-4 py-2.5 text-base bg-white focus:border-blue-600 focus:outline-none transition-colors"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </label>

                    {/* Category — single clean select */}
                    <label className="flex flex-col font-medium text-slate-700 gap-1.5 cursor-pointer">
                        <span>Category</span>
                        <select
                            name="category"
                            required
                            className="border-[1.5px] border-slate-300 rounded-lg px-4 py-2.5 text-base bg-white focus:border-blue-600 focus:outline-none transition-colors"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </label>

                    {/* Bio */}
                    <label className="flex flex-col font-medium text-slate-700 gap-1.5 cursor-pointer">
                        <span>Short Bio</span>
                        <textarea
                            name="bio"
                            required
                            maxLength="120"
                            placeholder="Describe your skills in 120 characters"
                            className="border-[1.5px] border-slate-300 rounded-lg px-4 py-2.5 text-base bg-white focus:border-blue-600 focus:outline-none transition-colors min-h-[80px] resize-y"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                        <span className="text-xs text-gray-400 text-right">{formData.bio.length}/120</span>
                    </label>

                    {/* Price */}
                    <label className="flex flex-col font-medium text-slate-700 gap-1.5 cursor-pointer">
                        <span>Your Rate (Ksh / hr)</span>
                        <input
                            type="number"
                            name="price"
                            required
                            min="100"
                            max="100000"
                            step="50"
                            placeholder="e.g. 800"
                            className="border-[1.5px] border-slate-300 rounded-lg px-4 py-2.5 text-base bg-white focus:border-blue-600 focus:outline-none transition-colors"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </label>

                    {/* Location */}
                    <div className="flex flex-col gap-1.5">
                        <label className="font-medium text-slate-700">Location (optional)</label>
                        <input
                            type="text"
                            name="locationName"
                            maxLength="60"
                            placeholder="e.g. Nairobi West"
                            className="border-[1.5px] border-slate-300 rounded-lg px-4 py-2.5 text-base bg-white focus:border-blue-600 focus:outline-none transition-colors"
                            value={formData.locationName}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={locating}
                            className="self-start text-sm font-semibold text-[#3182ce] hover:text-[#8338ec] transition-colors flex items-center gap-1 disabled:opacity-60"
                        >
                            {locating ? '⏳ Detecting...' : '📍 Detect My Location (for the Map)'}
                        </button>
                        {coords && (
                            <p className="text-xs text-green-600 font-medium">
                                ✅ Location pinned: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                            </p>
                        )}
                    </div>

                    {/* Available Days */}
                    <div className="flex flex-col gap-1.5">
                        <span className="font-medium text-slate-700">Available Days</span>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
                            {allDays.map(day => (
                                <label key={day} className="flex items-center gap-2 font-normal text-slate-600 text-sm cursor-pointer hover:text-blue-600">
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value={day}
                                        checked={formData.days.includes(day)}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Contact Method */}
                    <label className="flex flex-col font-medium text-slate-700 gap-1.5 cursor-pointer">
                        <span>Preferred Contact Method</span>
                        <select
                            name="contact_method"
                            required
                            className="border-[1.5px] border-slate-300 rounded-lg px-4 py-2.5 text-base bg-white focus:border-blue-600 focus:outline-none transition-colors"
                            value={formData.contact_method}
                            onChange={handleChange}
                        >
                            <option value="">Select method</option>
                            <option value="Phone">Phone Call</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="SMS">SMS</option>
                        </select>
                    </label>

                    {/* Feedback */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center font-medium" aria-live="polite">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg text-center font-medium" aria-live="polite">
                            ✅ Your Helper profile has been created! Redirecting to home...
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 text-white font-bold py-3.5 px-4 rounded-xl text-lg shadow-md transition-all sm:hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(90deg, #0094f0 60%, #1955c4 100%)' }}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>

                <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-3">Why Join Skillspotter?</h3>
                    <ol className="list-decimal pl-5 space-y-1.5 text-gray-600 text-[0.95rem]">
                        <li>Get discovered by clients near you</li>
                        <li>Showcase your skills and ratings</li>
                        <li>Receive bookings &amp; payments securely</li>
                    </ol>
                </div>
            </section>
        </div>
    );
};

export default BecomeHelper;
