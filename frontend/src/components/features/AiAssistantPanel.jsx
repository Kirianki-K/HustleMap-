import React, { useState, useRef, useEffect } from 'react';

const AiAssistantPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I can help you find hustlers, navigate the app, or give you step-by-step instructions if no hustler is available. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const getAiResponse = (msg) => {
        const m = msg.toLowerCase();
        if (m.includes('find') && (m.includes('hustler') || m.includes('fundi') || m.includes('provider'))) {
            return "Sure! Use the search bar above or select a category to find available hustlers. What service do you need?";
        }
        if (m.includes('navigate') || m.includes('how to use')) {
            return "To navigate: use the sidebar to search or pick a category, click on a provider to see details, or use the map to find hustlers nearby.";
        }
        if (m.includes('instructions') || m.includes('how do i') || m.includes('do it myself')) {
            return "If no hustler is available, I can guide you! Tell me what you want to do (e.g., 'fix a leaking tap'), and I'll give you step-by-step instructions.";
        }
        if (m.includes('book')) {
            return "To book a hustler, click the 'Book' button on their card. You'll get their contact and payment details.";
        }
        if (m.includes('m-pesa')) {
            return "You can pay hustlers securely with M-Pesa after booking. Always confirm the provider's details before sending payment.";
        }
        if (m.includes('hello') || m.includes('hi')) {
            return "Hello! How can I assist you today?";
        }
        return "I'm here to help you find hustlers, navigate the app, or give you instructions for common tasks. Please ask me anything!";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { text: input, sender: 'user' }]);
        const currentInput = input;
        setInput('');

        setTimeout(() => {
            setMessages(prev => [...prev, { text: getAiResponse(currentInput), sender: 'bot' }]);
        }, 600);
    };

    return (
        <div className="mt-[18px] text-center">
            <button
                className="bg-[#8338ec] text-[#222] border-none rounded-[20px] px-5 py-2 text-[1em] cursor-pointer font-semibold shadow-[0_1px_4px_rgba(246,224,94,0.08)] transition-colors duration-200 hover:bg-[#ffe066]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open AI Assistant"
            >
                🤖 Ask Hustle AI
            </button>

            {isOpen && (
                <div className="bg-white border border-[#eee] rounded-[10px] shadow-[0_2px_12px_rgba(49,130,206,0.08)] mt-2.5 p-0 flex flex-col max-w-[320px] mx-auto text-left">
                    <div className="flex justify-between items-center bg-[#3182ce] text-white px-3.5 py-2 rounded-t-[10px]">
                        <strong>Hustle AI Assistant</strong>
                        <button
                            className="bg-transparent border-none text-white text-[1.2em] cursor-pointer hover:text-gray-200"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close AI Assistant"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="max-h-[180px] overflow-y-auto p-2.5 text-[0.98em] flex flex-col gap-2">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`py-[7px] px-3 rounded-lg leading-[1.5] ${msg.sender === 'user'
                                    ? 'bg-[#3182ce] text-white text-right self-end ml-10'
                                    : 'bg-[#8338ec] text-[#222] text-left self-start mr-10'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="flex border-t border-[#eee] p-2 bg-[#fafbfc] rounded-b-[10px]">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            required
                            className="flex-1 border border-[#ddd] rounded-md px-2.5 py-1.5 text-[1em] outline-none focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce]"
                        />
                        <button type="submit" className="bg-[#3182ce] text-white border-none rounded-md ml-1.5 px-3.5 py-1.5 text-[1em] cursor-pointer font-medium hover:bg-blue-600 transition-colors">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AiAssistantPanel;
