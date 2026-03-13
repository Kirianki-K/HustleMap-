import React from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (cat) => {
        navigate(`/?category=${encodeURIComponent(cat)}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories</h1>
            <p className="text-gray-600 mb-8">Browse available services and find the perfect helper for your needs.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Laundry', 'Welding', 'Hair & Beauty', 'Delivery', 'Cleaning', 'Electronics', 'Tutoring', 'Repairs'].map((cat) => (
                    <div 
                        key={cat} 
                        onClick={() => handleCategoryClick(cat)}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCategoryClick(cat); }}
                    >
                        <h2 className="text-xl font-semibold text-blue-600 mb-2">{cat}</h2>
                        <p className="text-gray-500 text-sm">Find top-rated {cat.toLowerCase()} professionals.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
