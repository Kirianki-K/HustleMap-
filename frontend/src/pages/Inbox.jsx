import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messagesAPI, providersAPI } from '../services/api';
import useSocket from '../hooks/useSocket';

// ── Helpers ──────────────────────────────────────────────────────────────────
const makeRoomId = (idA, idB) => [idA, idB].sort().join('_');

const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// ── Component ─────────────────────────────────────────────────────────────────
const Inbox = () => {
    const { user } = useAuth();
    const socketRef = useSocket();
    const [searchParams] = useSearchParams();

    const [conversations, setConversations] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);      // { roomId, otherUser }
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loadingConvos, setLoadingConvos] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // ── Scroll to bottom on new message ──────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Load conversation list ────────────────────────────────────────────────
    const fetchConversations = useCallback(async () => {
        try {
            const data = await messagesAPI.getConversations();
            setConversations(data);
        } catch {
            // swallow — user may have no conversations yet
        } finally {
            setLoadingConvos(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // ── If navigated here with ?with=<providerId>, open that conversation ────
    useEffect(() => {
        const withId = searchParams.get('with');
        if (withId && user && withId !== user._id) {
            // Fetch the other user's name via provider profile
            providersAPI.getProviderById(withId)
                .then(profile => {
                    const otherUser = { _id: withId, name: profile.user?.name || 'Helper' };
                    const roomId = makeRoomId(user._id, withId);
                    openRoom({ roomId, otherUser });
                })
                .catch(() => {
                    // If not a provider, try opening room directly with just the ID
                    const roomId = makeRoomId(user._id, withId);
                    openRoom({ roomId, otherUser: { _id: withId, name: 'User' } });
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, user]);

    // ── Open a room: join socket room + fetch history ─────────────────────────
    const openRoom = useCallback(async (room) => {
        setActiveRoom(room);
        setMessages([]);
        setLoadingMessages(true);

        // Join socket room
        socketRef.current?.emit('join_room', room.roomId);
        socketRef.current?.emit('mark_read', room.roomId);

        // Fetch message history
        try {
            const history = await messagesAPI.getRoomMessages(room.roomId);
            setMessages(history);
        } catch {
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }

        // Update unread badge in convo list
        setConversations(prev =>
            prev.map(c => c.roomId === room.roomId ? { ...c, unreadCount: 0 } : c)
        );

        // Ensure no duplicate entry — add to list if first time messaging
        setConversations(prev => {
            const exists = prev.find(c => c.roomId === room.roomId);
            if (!exists) {
                return [{ roomId: room.roomId, otherUser: room.otherUser, latestMessage: null, unreadCount: 0 }, ...prev];
            }
            return prev;
        });

        inputRef.current?.focus();
    }, [socketRef]);

    // ── Listen for incoming messages ──────────────────────────────────────────
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const handler = (msg) => {
            // If message is for the active room, append it
            setMessages(prev => {
                if (prev.find(m => m._id === msg._id)) return prev; // deduplicate
                return [...prev, msg];
            });

            // Update the conversation list's latest message
            setConversations(prev =>
                prev.map(c =>
                    c.roomId === msg.roomId
                        ? { ...c, latestMessage: { text: msg.text, createdAt: msg.createdAt } }
                        : c
                )
            );
        };

        socket.on('receive_message', handler);
        return () => socket.off('receive_message', handler);
    }, [socketRef]);

    // ── Send a message ────────────────────────────────────────────────────────
    const handleSend = () => {
        const text = inputText.trim();
        if (!text || !activeRoom || !socketRef.current || sending) return;

        setSending(true);
        socketRef.current.emit('send_message', {
            roomId: activeRoom.roomId,
            receiverId: activeRoom.otherUser._id,
            text
        });
        setInputText('');
        setSending(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full flex h-[calc(100vh-10rem)] max-h-[700px] bg-white rounded-[20px] shadow-[0_4px_24px_rgba(131,56,236,0.12)] overflow-hidden">

            {/* ── Left Panel: Conversation List ── */}
            <aside className="w-[280px] shrink-0 border-r border-gray-100 flex flex-col bg-[linear-gradient(180deg,#f8f4ff_0%,#fff_100%)] max-[700px]:hidden">
                <div className="p-5 border-b border-gray-100">
                    <h1 className="text-xl font-black text-[#22223b] m-0">💬 Inbox</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Real-time messages</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConvos ? (
                        <p className="text-gray-400 text-sm p-5 animate-pulse">Loading conversations...</p>
                    ) : conversations.length === 0 ? (
                        <div className="p-5 text-center">
                            <div className="text-4xl mb-2">✉️</div>
                            <p className="text-gray-500 text-sm">No messages yet.</p>
                            <p className="text-gray-400 text-xs mt-1">Visit a provider's profile and tap "Message".</p>
                        </div>
                    ) : (
                        conversations.map(convo => {
                            const isActive = activeRoom?.roomId === convo.roomId;
                            return (
                                <button
                                    key={convo.roomId}
                                    onClick={() => openRoom(convo)}
                                    className={`w-full text-left p-4 border-b border-gray-50 transition-colors flex items-start gap-3 ${isActive ? 'bg-[#f0ebff]' : 'hover:bg-gray-50'}`}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#00b4d8,#8338ec)] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {convo.otherUser?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-[#22223b] text-sm truncate">{convo.otherUser?.name}</span>
                                            {convo.latestMessage && (
                                                <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                                                    {formatDate(convo.latestMessage.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">
                                            {convo.latestMessage?.text || 'Start a conversation'}
                                        </p>
                                    </div>
                                    {convo.unreadCount > 0 && (
                                        <span className="bg-[#8338ec] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                                            {convo.unreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </aside>

            {/* ── Right Panel: Message Thread ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {!activeRoom ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="text-6xl mb-4">💬</div>
                        <h2 className="text-xl font-bold text-gray-600 mb-2">Select a conversation</h2>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Choose a conversation from the left, or visit a provider's profile and tap "Message".
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white shrink-0">
                            <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#00b4d8,#8338ec)] flex items-center justify-center text-white font-bold text-sm">
                                {activeRoom.otherUser?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-[#22223b] text-sm m-0">{activeRoom.otherUser?.name}</p>
                                <p className="text-xs text-green-500 m-0">● Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-[#fafafa]">
                            {loadingMessages ? (
                                <p className="text-center text-gray-400 animate-pulse text-sm">Loading messages...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm mt-8">No messages yet. Say hello! 👋</p>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender?._id?.toString() === user?._id?.toString()
                                        || msg.sender?.toString() === user?._id?.toString();
                                    return (
                                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe
                                                ? 'bg-[linear-gradient(90deg,#00b4d8,#8338ec)] text-white rounded-br-sm'
                                                : 'bg-white text-[#22223b] shadow-sm border border-gray-100 rounded-bl-sm'
                                            }`}>
                                                <p className="m-0 leading-relaxed">{msg.text}</p>
                                                <p className={`text-[10px] mt-1 mb-0 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="flex items-center gap-3 p-4 border-t border-gray-100 bg-white shrink-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Message ${activeRoom.otherUser?.name}...`}
                                maxLength={1000}
                                className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#8338ec] focus:shadow-[0_0_0_3px_rgba(131,56,236,0.1)] transition-all bg-[#fafafa]"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim() || sending}
                                className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#00b4d8,#8338ec)] text-white flex items-center justify-center shrink-0 transition-all hover:scale-105 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                                aria-label="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 translate-x-0.5">
                                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Inbox;
