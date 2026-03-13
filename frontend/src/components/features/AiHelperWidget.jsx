import React, { useState, useEffect } from 'react';

const AiHelperWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("👋 Hi! Need help finding a hustler or booking a service? Ask me anything!");

    useEffect(() => {
        const prompts = [
            "👋 Hi! Need help finding a hustler or booking a service? Ask me anything!",
            "💡 Tip: Use the map to find trusted hustlers near you.",
            "🤖 I can recommend top-rated providers for your task.",
            "🛡️ Safety first! Always confirm details before payment.",
            "📅 Want to set a booking reminder? Just ask me!"
        ];

        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % prompts.length;
            if (!isOpen) setMessage(prompts[idx]);
        }, 7000);
        return () => clearInterval(interval);
    }, [isOpen]);

    const handleClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setMessage("How can I assist you? (e.g. 'Find a welder nearby', 'How do I book?')");
        }
    };

    return (
        <div
            className={`fixed bottom-[32px] right-[32px] z-[9999] flex flex-col items-end cursor-pointer outline-none transition-shadow duration-200 group max-[700px]:right-3 max-[700px]:bottom-3 ${isOpen ? 'shadow-[0_0_0_3px_#8338ec55]' : ''}`}
            onClick={handleClick}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            tabIndex={0}
            aria-label="Open Hustle AI Helper"
        >
            <div
                className={`bg-white text-[#222] rounded-[18px] shadow-[0_2px_12px_rgba(131,56,236,0.13)] px-[18px] py-[12px] mb-2 mr-2 text-[1.05em] max-w-[320px] transition-opacity duration-300 relative pointer-events-none max-[700px]:max-w-[90vw] max-[700px]:text-[0.98em] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'} group-hover:opacity-100 group-focus:opacity-100`}
            >
                {message}
            </div>

            <div className="w-16 h-16 bg-white rounded-full shadow-[0_2px_12px_rgba(49,130,206,0.13)] flex items-center justify-center relative animate-[bounce_1.6s_infinite_alternate]">
                <img
                    src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f916.png"
                    alt="AI Helper"
                    className="w-11 h-11 block"
                />
                <span className="absolute right-1.5 top-1.5 w-[18px] h-[18px] bg-[#ffe066] rounded-full shadow-[0_0_0_0_#ffe06655] animate-[ping_1.2s_infinite_alternate]"></span>
            </div>
        </div>
    );
};

export default AiHelperWidget;
