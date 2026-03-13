import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MapWidget from '../components/features/MapWidget';
import HelperGallery from '../components/features/HelperGallery';
import ProviderCard from '../components/ui/ProviderCard';
import { providersAPI } from '../services/api';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || 'All';
    const [searchQuery, setSearchQuery] = useState('');
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const data = await providersAPI.getProviders(activeCategory, searchQuery);
                setProviders(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch providers:", err);
                setError("Failed to load providers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if they actually typed something or picked a category,
        // or always fetch all initially! Let's just fetch all.
        fetchProviders();
    }, [activeCategory, searchQuery]);

    const handleCategoryChange = (cat) => {
        setSearchParams(cat === 'All' ? {} : { category: cat });
    };

    const sectionTitle = searchQuery
        ? `Results for "${searchQuery}"`
        : activeCategory !== 'All'
        ? `Helpers: ${activeCategory}`
        : 'All Helpers';

    return (
        <>
            <Sidebar
                onSearch={setSearchQuery}
                onCategoryChange={handleCategoryChange}
                activeCategory={activeCategory}
            />

            <div className="flex flex-col flex-[3_1_520px] min-w-[370px] max-[900px]:max-w-full max-[900px]:min-w-0">
                <MapWidget />

                <div className="mt-8 px-4 md:px-0">
                    <h2 className="text-[#00b4d8] font-black mb-[1.2rem] tracking-[0.5px] mt-0 text-xl">
                        {sectionTitle}
                    </h2>

                    {loading ? (
                        <p className="text-gray-500 animate-pulse">Loading hustlers...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : providers.length === 0 ? (
                        <p className="text-gray-500">No hustlers found{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.</p>
                    ) : (
                        providers.map(provider => (
                            <ProviderCard
                                key={provider._id}
                                id={provider._id}
                                name={provider.user?.name || 'Helper'}
                                category={provider.category}
                                rating={'⭐'.repeat(Math.round(provider.averageRating || 0)) || ''}
                                image={provider.avatarUrl !== 'no-photo.jpg' ? provider.avatarUrl : null}
                            />
                        ))
                    )}
                </div>

                <HelperGallery />
            </div>
        </>
    );
};

export default Home;
