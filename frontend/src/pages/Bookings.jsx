import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingsAPI.getBookings();
                setBookings(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
                setError("Failed to load your bookings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>
            
            {loading ? (
                <div className="text-center p-8"><p className="text-gray-500 animate-pulse">Loading bookings...</p></div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">{error}</div>
            ) : bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="text-5xl mb-4">📅</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Active Bookings</h2>
                    <p className="text-gray-500 max-w-md mx-auto">You don't have any upcoming or past bookings yet. Search for a helper and book a service to get started.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Find a Service
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Booking with {booking.provider?.user?.name || 'Provider'}</h3>
                                <p className="text-blue-600 font-medium mb-1">{booking.serviceDetails}</p>
                                <p className="text-gray-500 text-sm">📅 {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                    ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                      booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 
                                      booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                      'bg-gray-100 text-gray-700'}`}
                                >
                                    {booking.status}
                                </span>
                                <p className="font-bold text-gray-800">Ksh {booking.totalAmount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
