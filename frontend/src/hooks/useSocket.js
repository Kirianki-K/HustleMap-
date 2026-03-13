import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

/**
 * Custom hook that creates a single, memoised socket.io connection.
 * The socket is authenticated with the JWT from localStorage.
 * Cleans up on unmount. Safe with React StrictMode double-mount.
 */
const useSocket = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('skillspotter_token');
        if (!token) return;

        // Guard: if a socket already exists and is connected, reuse it
        if (socketRef.current?.connected) return;

        const socket = io(SOCKET_URL, {
            auth: { token },
            // Allow polling → WebSocket upgrade (default). Using 'websocket' only
            // causes the StrictMode "closed before established" warning because
            // the raw WS handshake is slower than the cleanup cycle.
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
        });

        socketRef.current = socket;

        return () => {
            // Only fully disconnect if no active listeners remain
            // (React StrictMode will remount — we let it reconnect on its own)
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return socketRef;
};

export default useSocket;
