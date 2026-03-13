import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderCard = ({ name, category, rating, image, id }) => {
    const navigate = useNavigate();
    
    return (
        <div
            onClick={() => navigate(`/providers/${id}`)}
            className="bg-[linear-gradient(90deg,#f1f5f9_60%,#e0aaff_100%)] rounded-[14px] p-[1.1rem] mb-[1.1rem] flex items-center gap-[1.2rem] shadow-[0_2px_8px_rgba(131,56,236,0.09)] transition-all duration-150 border-[2px] border-transparent hover:-translate-y-[3px] hover:scale-[1.025] hover:shadow-[0_6px_20px_#00b4d833] hover:border-[#00b4d8] focus-within:-translate-y-[3px] focus-within:scale-[1.025] focus-within:shadow-[0_6px_20px_#00b4d833] focus-within:border-[#00b4d8] max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-[0.7rem] cursor-pointer group"
        >
            <div className="w-[52px] h-[52px] rounded-full bg-[linear-gradient(135deg,#00b4d8_60%,#8338ec_100%)] flex items-center justify-center text-[1.7rem] text-white font-bold shadow-[0_2px_10px_#00b4d81a] border-2 border-white transition-shadow duration-200 group-hover:shadow-[0_4px_16px_#8338ec33] max-[600px]:w-[40px] max-[600px]:h-[40px] max-[600px]:text-[1.1rem] overflow-hidden shrink-0">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    name.charAt(0)
                )}
            </div>
            <div className="flex-1">
                <h3 className="font-extrabold text-[#22223b] text-[1.08rem] mb-[0.2rem] mt-0">{name}</h3>
                <p className="text-[1rem] text-[#8338ec] font-semibold m-0">{category}</p>
                <p className="text-[#ffd166] text-[1.05rem] tracking-[1px] mt-[0.2rem] mb-0">{rating}</p>
            </div>
            <button
                className="bg-[linear-gradient(90deg,#00b4d8_0%,#8338ec_100%)] text-white border-none rounded-[22px] px-[1.3rem] py-[0.6rem] cursor-pointer font-bold text-[1.05rem] transition-all duration-200 shadow-[0_2px_10px_#8338ec22] outline-none hover:shadow-[0_6px_20px_#00b4d833] hover:scale-[1.04] focus:shadow-[0_4px_16px_#00b4d822]"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/providers/${id}`);
                }}
            >
                View
            </button>
        </div>
    );
};

export default ProviderCard;
