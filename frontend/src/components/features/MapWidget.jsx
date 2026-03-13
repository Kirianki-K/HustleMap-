import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AiHelperWidget from './AiHelperWidget';
import { providersAPI } from '../../services/api';

// Fix Leaflet's default icon path issues with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWidget = () => {
    const mapRef = useRef(null);
    const navigate = useNavigate();
    const defaultCenter = [-1.286389, 36.817223]; // Nairobi
    const defaultZoom = 12;

    const [mapProviders, setMapProviders] = useState([]);

    useEffect(() => {
        providersAPI.getProvidersForMap()
            .then(data => setMapProviders(data))
            .catch(err => console.error('Failed to load map providers:', err));
    }, []);

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude: lat, longitude: lng } = pos.coords;
                    mapRef.current?.flyTo([lat, lng], 15);
                },
                () => alert("Unable to access your location.")
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleResetMap = () => {
        mapRef.current?.flyTo(defaultCenter, defaultZoom);
    };

    return (
        <section className="flex-[3_1_520px] min-w-[370px] bg-[linear-gradient(135deg,#fff_60%,#e0aaff_100%)] rounded-[18px] p-8 shadow-[0_4px_18px_rgba(131,56,236,0.09)] flex flex-col transition-shadow duration-200 hover:shadow-[0_8px_32px_#8338ec22] max-[1100px]:p-[1.2rem_0.7rem] max-[900px]:max-w-full max-[900px]:min-w-0 max-[900px]:rounded-xl max-[600px]:p-[0.7rem_0.3rem] relative">
            <h2 className="text-[#00b4d8] font-black mb-[1.2rem] tracking-[0.5px] mt-0 text-2xl">📍 Nearby Helpers</h2>

            <div className="h-[420px] rounded-[14px] mb-[1.2rem] shadow-[0_2px_12px_rgba(0,180,216,0.1)] border-2 border-[#bdb2ff33] transition-all duration-200 hover:shadow-[0_6px_24px_#00b4d822] hover:border-[#8338ec55] focus-within:shadow-[0_6px_24px_#00b4d822] focus-within:border-[#8338ec55] overflow-hidden z-10">
                <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    ref={mapRef}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mapProviders.map((provider) => {
                        // MongoDB stores as [lng, lat]; Leaflet needs [lat, lng]
                        const [lng, lat] = provider.locationCoords.coordinates;
                        return (
                            <Marker key={provider._id} position={[lat, lng]}>
                                <Popup>
                                    <div className="text-center">
                                        <p className="font-bold text-[#3182ce] mb-1">{provider.user?.name || 'Helper'}</p>
                                        <p className="text-sm text-gray-600 mb-1">{provider.category}</p>
                                        {provider.locationName && (
                                            <p className="text-xs text-gray-400 mb-2">📍 {provider.locationName}</p>
                                        )}
                                        <button
                                            onClick={() => navigate(`/providers/${provider._id}`)}
                                            className="bg-[#3182ce] text-white text-xs px-3 py-1 rounded-full hover:bg-[#8338ec] transition-colors"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            <AiHelperWidget />

            <div className="flex gap-3 my-3">
                <button
                    onClick={handleLocateMe}
                    className="bg-[#3182ce] text-white border-none rounded-lg px-4 py-1.5 text-[1em] cursor-pointer font-medium transition-colors duration-150 hover:bg-[#8338ec]"
                    aria-label="Show my location"
                >
                    📍 My Location
                </button>
                <button
                    onClick={handleResetMap}
                    className="bg-[#3182ce] text-white border-none rounded-lg px-4 py-1.5 text-[1em] cursor-pointer font-medium transition-colors duration-150 hover:bg-[#8338ec]"
                    aria-label="Reset map view"
                >
                    🔄 Reset Map
                </button>
            </div>

            <div className="flex gap-[18px] mb-2 text-[0.98em] items-center flex-wrap">
                <span className="flex items-center"><span className="inline-block w-3.5 h-3.5 rounded-full mr-1.5 align-middle bg-[#8338ec]"></span> Cleaning</span>
                <span className="flex items-center"><span className="inline-block w-3.5 h-3.5 rounded-full mr-1.5 align-middle bg-[#38b2ac]"></span> Welding</span>
                <span className="flex items-center"><span className="inline-block w-3.5 h-3.5 rounded-full mr-1.5 align-middle bg-[#a259f7]"></span> Hair & Beauty</span>
                <span className="flex items-center"><span className="inline-block w-3.5 h-3.5 rounded-full mr-1.5 align-middle bg-[#3182ce]"></span> Repairs</span>
            </div>
        </section>
    );
};

export default MapWidget;
