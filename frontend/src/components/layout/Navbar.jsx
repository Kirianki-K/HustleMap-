
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, isAuthenticated, logoutContext } = useAuth();

    const coreLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories' },
    ];

    const loggedInLinks = [
        { name: 'My Bookings', path: '/bookings' },
        { name: 'Inbox', path: '/inbox' },
    ];

    if (user && user.role !== 'provider') {
        loggedInLinks.push({ name: 'Become a Helper', path: '/become' });
    }

    const loginLinks = [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
    ];

    const navLinks = isAuthenticated ? [...coreLinks, ...loggedInLinks] : [...coreLinks, ...loginLinks];

    const handleLogout = (e) => {
        e.preventDefault();
        logoutContext();
        setMobileMenuOpen(false);
        navigate('/login');
    }

    return (
        <header className="flex items-center justify-between px-6 h-16 shadow-[0_2px_8px_rgba(49,130,206,0.06)] relative z-[200] bg-white w-full">
            <div className="flex items-center gap-3">
                <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="14" fill="#8338ec" />
                    <path d="M8 18L14 8L20 18H8Z" fill="#3182ce" />
                </svg>
                <div>
                    <h1 className="font-['Pacifico',cursive] text-[1.5em] m-0 text-[#3182ce]">Skillspotter</h1>
                    <p className="text-[0.9em] text-[#888] m-0">Mapping Skills, Empowering Helpers</p>
                </div>
            </div>

            <nav className="hidden min-[901px]:flex gap-[18px] items-center">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className="text-[#222] decoration-transparent font-medium px-2.5 py-1.5 rounded-md transition-colors duration-150 hover:bg-[#8338ec] hover:text-[#222]"
                    >
                        {link.name}
                    </Link>
                ))}
                {isAuthenticated && (
                    <a
                        href="#"
                        onClick={handleLogout}
                        className="text-[#222] decoration-transparent font-medium px-2.5 py-1.5 rounded-md transition-colors duration-150 hover:bg-[#8338ec] hover:text-[#222]"
                    >
                        Logout ({user?.name?.split(' ')[0]})
                    </a>
                )}
            </nav>

            <button
                className="min-[901px]:hidden flex flex-col justify-center items-center w-11 h-11 bg-transparent border-none cursor-pointer ml-4"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
            >
                <span className={`block w-[26px] h-[3px] bg-[#3182ce] my-1 rounded-[2px] transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''} `}></span>
                <span className={`block w-[26px] h-[3px] bg-[#3182ce] my-1 rounded-[2px] transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : ''} `}></span>
                <span className={`block w-[26px] h-[3px] bg-[#3182ce] my-1 rounded-[2px] transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''} `}></span>
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <nav className="absolute top-16 left-0 right-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-[100] flex flex-col py-3 min-[901px]:hidden">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-[#222] decoration-transparent text-[1.1em] px-6 py-3 border-[#f0f0f0] ${index !== navLinks.length - 1 || isAuthenticated ? 'border-b' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <a
                            href="#"
                            onClick={handleLogout}
                            className="text-[#222] decoration-transparent text-[1.1em] px-6 py-3"
                        >
                            Logout ({user?.name?.split(' ')[0]})
                        </a>
                    )}
                </nav>
            )}
        </header>
    );
};

export default Navbar;
