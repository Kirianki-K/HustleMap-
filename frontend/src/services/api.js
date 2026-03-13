import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('skillspotter_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Handle token expiration globally
            // localStorage.removeItem('skillspotter_token');
            // localStorage.removeItem('skillspotter_user');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
};

export const providersAPI = {
    getProviders: async (category = '', search = '') => {
        const params = {};
        if (category && category !== 'All') params.category = category;
        if (search) params.search = search;

        const response = await api.get('/providers', { params });
        return response.data;
    },
    getProviderById: async (id) => {
        const response = await api.get(`/providers/${id}`);
        return response.data;
    },
    getProvidersForMap: async () => {
        const response = await api.get('/providers/map');
        return response.data;
    },
    createProviderProfile: async (profileData) => {
        const response = await api.post('/providers', profileData);
        return response.data;
    },
};

export const bookingsAPI = {
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },
    getBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },
    updateBookingStatus: async (id, status) => {
        const response = await api.put(`/bookings/${id}/status`, { status });
        return response.data;
    },
    cancelBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    },
};

export const reviewsAPI = {
    createReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },
};

export const messagesAPI = {
    getConversations: async () => {
        const response = await api.get('/messages/conversations');
        return response.data;
    },
    getRoomMessages: async (roomId) => {
        const response = await api.get(`/messages/${roomId}`);
        return response.data;
    },
};

export default api;
