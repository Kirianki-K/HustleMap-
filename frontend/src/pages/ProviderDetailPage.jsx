import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { providersAPI } from '../services/api';

const DAY_LABELS = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const CONTACT_ICONS = { Phone: '📞', WhatsApp: '💬', SMS: '📱' };

const ProviderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        providersAPI.getProviderById(id)
            .then(data => setProvider(data))
            .catch(() => setError('This provider could not be found. They may have removed their profile.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400 animate-pulse text-lg">Loading profile...</p>
            </div>
        );
    }

    if (error || !provider) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-red-400 text-lg">{error || 'Provider not found.'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-[#3182ce] text-white px-6 py-2 rounded-lg hover:bg-[#8338ec] transition-colors"
                >
                    ← Go Back
                </button>
            </div>
        );
    }

    const name = provider.user?.name || 'Helper';
    const initial = name.charAt(0).toUpperCase();
    const stars = provider.averageRating > 0 ? '⭐'.repeat(Math.round(provider.averageRating)) : null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="text-[#3182ce] hover:text-[#8338ec] font-semibold mb-6 flex items-center gap-1 transition-colors"
            >
                ← Back
            </button>

            <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(131,56,236,0.12)] overflow-hidden">
                {/* Header banner */}
                <div className="h-28 bg-[linear-gradient(135deg,#00b4d8_0%,#8338ec_100%)]" />

                {/* Avatar */}
                <div className="flex flex-col items-center -mt-14 px-6 pb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[linear-gradient(135deg,#00b4d8,#8338ec)] flex items-center justify-center">
                        {provider.avatarUrl && provider.avatarUrl !== 'no-photo.jpg' ? (
                            <img src={provider.avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-4xl font-bold">{initial}</span>
                        )}
                    </div>

                    <h1 className="text-2xl font-black text-[#22223b] mt-4 mb-0">{name}</h1>
                    <p className="text-[#8338ec] font-semibold text-lg mt-1">{provider.category}</p>
                    {stars && <p className="text-[#ffd166] text-xl mt-1">{stars}</p>}
                    {!stars && <p className="text-gray-400 text-sm mt-1">No reviews yet</p>}
                </div>

                {/* Details */}
                <div className="px-6 pb-8 flex flex-col gap-5 border-t border-gray-100 pt-5">
                    {/* Bio */}
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">About</h2>
                        <p className="text-gray-700 text-base leading-relaxed">{provider.bio}</p>
                    </div>

                    {/* Rate */}
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💰</span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Rate</p>
                            <p className="text-[#22223b] font-bold text-lg">Ksh {provider.price?.toLocaleString()} / hr</p>
                        </div>
                    </div>

                    {/* Location */}
                    {provider.locationName && (
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Location</p>
                                <p className="text-[#22223b] font-semibold">{provider.locationName}</p>
                            </div>
                        </div>
                    )}

                    {/* Available Days */}
                    {provider.availableDays?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Available Days</p>
                            <div className="flex flex-wrap gap-2">
                                {provider.availableDays.map(day => (
                                    <span key={day} className="bg-[#e0f2fe] text-[#0369a1] text-sm font-semibold px-3 py-1 rounded-full">
                                        {DAY_LABELS[day] || day}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    <div className="mt-2 flex flex-col sm:flex-row gap-3">
                        <button
                            className="flex-1 bg-[linear-gradient(90deg,#00b4d8,#8338ec)] text-white font-bold py-3 rounded-xl text-base shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            onClick={() => navigate(`/inbox?with=${provider.user?._id}`)}
                        >
                            💬 Message
                        </button>
                        {provider.preferredContactMethod && (
                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-gray-700 font-semibold">
                                <span>{CONTACT_ICONS[provider.preferredContactMethod] || '📬'}</span>
                                Prefers {provider.preferredContactMethod}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetailPage;
