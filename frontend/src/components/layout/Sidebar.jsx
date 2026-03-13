import React from 'react';
import { Link } from 'react-router-dom';
import AiAssistantPanel from '../features/AiAssistantPanel';

const Sidebar = ({ onSearch, onCategoryChange, activeCategory = 'All' }) => {
    const categories = [
        { name: 'All',          icon: '🔎' },
        { name: 'Cleaning',     icon: '🧹' },
        { name: 'Welding',      icon: '🔧' },
        { name: 'Hair & Beauty',icon: '💇' },
        { name: 'Repairs',      icon: '🛠' },
        { name: 'Laundry',      icon: '🧺' },
        { name: 'Delivery',     icon: '📦' },
        { name: 'Electronics',  icon: '💻' },
        { name: 'Tutoring',     icon: '🧠' },
    ];

    return (
        <aside className="flex-1 basis-[260px] bg-[linear-gradient(135deg,#fff_60%,#caf0f8_100%)] rounded-[18px] p-8 shadow-[0_4px_18px_rgba(0,180,216,0.09)] min-w-[260px] max-w-[320px] sticky top-[6.5rem] self-start transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(0,180,216,0.13)] max-[1100px]:p-[1.2rem_0.7rem] max-[900px]:max-w-full max-[900px]:min-w-0 max-[900px]:rounded-xl max-[900px]:p-[0.7rem_0.3rem] max-[900px]:relative max-[900px]:top-0 max-[900px]:self-auto bg-white">

            {/* Search Bar */}
            <div className="mb-[2.2rem]">
                <input
                    type="text"
                    placeholder="🔍 Find a service or fundi..."
                    aria-label="Search providers"
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="w-full px-[1.1rem] py-[0.8rem] rounded-[22px] border-[1.7px] border-solid border-[#bdb2ff] text-[1.05rem] outline-none transition-all duration-200 bg-[#f8fafc] shadow-[0_1px_4px_rgba(189,178,255,0.13)] focus:border-[#8338ec] focus:shadow-[0_2px_8px_rgba(131,56,236,0.13)]"
                />
            </div>

            {/* Categories */}
            <div className="mb-[2.2rem]">
                <h2 className="text-[1.22rem] mb-[1.1rem] text-[#8338ec] font-extrabold tracking-[0.5px]">📂 Categories</h2>
                <ul className="flex flex-wrap gap-[0.7rem] p-0 m-0 list-none">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.name;
                        return (
                            <li
                                key={cat.name}
                                onClick={() => onCategoryChange?.(cat.name)}
                                className={`py-[0.55rem] px-[1.2rem] rounded-[22px] cursor-pointer text-[1rem] font-semibold transition-all duration-200 border-[2px] border-solid outline-none shadow-[0_1px_6px_rgba(0,180,216,0.1)] focus:border-[#00b4d8] focus:shadow-[0_2px_12px_rgba(0,180,216,0.13)] ${isActive
                                    ? 'bg-[linear-gradient(90deg,#00b4d8_0%,#8338ec_100%)] text-white border-[#ffd166] shadow-[0_2px_12px_rgba(131,56,236,0.2)]'
                                    : 'bg-[linear-gradient(90deg,#caf0f8_0%,#ffd6e0_100%)] text-[#22223b] border-transparent hover:bg-[linear-gradient(90deg,#00b4d8_0%,#8338ec_100%)] hover:text-white hover:border-[#ffd166] hover:shadow-[0_2px_12px_rgba(131,56,236,0.2)]'
                                    }`}
                            >
                                {cat.icon} {cat.name}
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-3">
                    <Link to="/categories" className="text-[#3182ce] font-medium hover:underline text-[0.98em]">Show more &rarr;</Link>
                </div>
            </div>

            {/* Provider List container for search results if applicable */}
            {/* Handled by parent view typically, but this was a div in original HTML */}

            {/* Hustle AI Feature Suggestions */}
            <div className="bg-[#f8f7ff] border border-[#eee] rounded-[10px] mt-[18px] pt-[14px] px-[16px] pb-[10px] text-[0.98em]">
                <h3 className="mt-0 text-[1.08em] text-[#8338ec] font-bold">✨ Skillspotter AI Can Help You:</h3>
                <ul className="mt-[8px] pl-[20px] mb-0 list-disc">
                    <li className="mb-[6px] leading-[1.5]">🔍 Find the best-rated helpers for your task</li>
                    <li className="mb-[6px] leading-[1.5]">📍 Suggest providers closest to your location</li>
                    <li className="mb-[6px] leading-[1.5]">💬 Answer questions about services & pricing</li>
                    <li className="mb-[6px] leading-[1.5]">📝 Give DIY instructions for common tasks</li>
                    <li className="mb-[6px] leading-[1.5]">🛡️ Share safety & payment tips</li>
                    <li className="mb-[6px] leading-[1.5]">📅 Remind you of upcoming bookings</li>
                    <li className="mb-[6px] leading-[1.5]">⭐ Recommend trending categories</li>
                </ul>
            </div>

            <AiAssistantPanel />
        </aside>
    );
};

export default Sidebar;
