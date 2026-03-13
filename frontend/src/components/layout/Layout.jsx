import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#e9deff_0%,#d1fbdf_50%,#cfecfb_100%)] text-[#23223b] font-roboto selection:bg-[#00b4d8] selection:text-white pb-10">
            <Navbar />
            <main className="flex flex-wrap mx-auto mt-10 max-w-[1240px] gap-10 px-5 max-[1100px]:max-w-[98vw] max-[1100px]:gap-6 max-[900px]:flex-col max-[900px]:gap-5 max-[900px]:px-2">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
