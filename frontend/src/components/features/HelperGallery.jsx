import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providersAPI } from '../../services/api';

const HustlerGallery = () => {
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        providersAPI.getProviders()
            .then(data => setProviders(data))
            .catch(err => console.error('Failed to load gallery:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="mt-[36px] mx-auto max-w-[1100px] px-5 w-full">
                <h2 className="font-['Pacifico',cursive] text-[#8338ec] text-[1.6em] mb-[18px]">🌟 Featured Hustlers</h2>
                <p className="text-gray-400 animate-pulse">Loading hustlers...</p>
            </section>
        );
    }

    if (providers.length === 0) {
        return (
            <section className="mt-[36px] mx-auto max-w-[1100px] px-5 w-full">
                <h2 className="font-['Pacifico',cursive] text-[#8338ec] text-[1.6em] mb-[18px]">🌟 Featured Hustlers</h2>
                <p className="text-gray-400">No hustlers registered yet. Be the first to <span className="text-[#8338ec] font-semibold cursor-pointer hover:underline" onClick={() => navigate('/become')}>join!</span></p>
            </section>
        );
    }

    return (
        <section className="mt-[36px] mx-auto max-w-[1100px] px-5 w-full overflow-hidden">
            <h2 className="font-['Pacifico',cursive] text-[#8338ec] text-[1.6em] mb-[18px] text-left mt-0">🌟 Featured Hustlers</h2>
            <div className="flex gap-[22px] overflow-x-auto pb-2.5 max-[700px]:gap-3 snap-x no-scrollbar">
                {providers.map((provider) => {
                    const name = provider.user?.name || 'Hustler';
                    const initial = name.charAt(0).toUpperCase();
                    return (
                        <div
                            key={provider._id}
                            onClick={() => navigate(`/providers/${provider._id}`)}
                            className="bg-white rounded-[18px] shadow-[0_4px_18px_rgba(49,130,206,0.1)] min-w-[180px] max-w-[200px] flex-[0_0_180px] flex flex-col items-center transition-all duration-200 cursor-pointer relative hover:scale-105 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(131,56,236,0.18)] max-[700px]:min-w-[140px] max-[700px]:max-w-[150px] max-[700px]:flex-[0_0_140px] snap-center"
                        >
                            {provider.avatarUrl && provider.avatarUrl !== 'no-photo.jpg' ? (
                                <img
                                    src={provider.avatarUrl}
                                    alt={name}
                                    className="w-full h-[160px] object-cover rounded-t-[18px] max-[700px]:h-[130px]"
                                />
                            ) : (
                                <div className="w-full h-[160px] rounded-t-[18px] max-[700px]:h-[130px] bg-[linear-gradient(135deg,#00b4d8,#8338ec)] flex items-center justify-center text-white text-4xl font-bold">
                                    {initial}
                                </div>
                            )}
                            <div className="p-[12px_10px_14px_10px] w-full text-center">
                                <span className="block font-bold text-[#3182ce] text-[1.08em] mb-1 truncate">{name}</span>
                                <span className="text-[0.98em] text-[#888]">{provider.category}</span>
                                {provider.averageRating > 0 && (
                                    <span className="block text-[#ffd166] text-sm mt-1">{'⭐'.repeat(Math.round(provider.averageRating))}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default HustlerGallery;
