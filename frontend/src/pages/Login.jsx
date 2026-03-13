import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { loginContext } = useAuth();

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // using the axios instance
            const data = await authAPI.login(credentials);
            loginContext(data, data.token); // Store in context/localStorage
            navigate('/'); // Redirect to home
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center mt-12 px-5">
            <div className="bg-white rounded-[18px] shadow-[0_4px_18px_rgba(49,130,206,0.1)] p-8 max-w-[420px] w-full border border-gray-100">
                <div className="text-center mb-6">
                    <h2 className="font-['Pacifico',cursive] text-[#8338ec] text-3xl m-0 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Sign in to your Skillspotter account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            value={credentials.email}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[1em] outline-none transition-all duration-200 focus:bg-white focus:border-[#8338ec] focus:shadow-[0_0_0_3px_rgba(131,56,236,0.1)]"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-semibold text-gray-700" htmlFor="password">Password</label>
                            <a href="#" className="text-sm text-[#3182ce] hover:underline">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[1em] outline-none transition-all duration-200 focus:bg-white focus:border-[#8338ec] focus:shadow-[0_0_0_3px_rgba(131,56,236,0.1)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[linear-gradient(90deg,#00b4d8_0%,#8338ec_100%)] text-white font-bold py-3 px-4 rounded-xl mt-2 transition-all duration-200 shadow-[0_4px_12px_rgba(131,56,236,0.2)] hover:shadow-[0_6px_16px_rgba(131,56,236,0.3)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-[#8338ec] font-semibold hover:underline">Register now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
