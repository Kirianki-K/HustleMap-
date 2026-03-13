const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

/**
 * Initialise Socket.io on the given HTTP server instance.
 * @param {import('http').Server} server
 */
const initSocket = (server) => {
    const { Server } = require('socket.io');

    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // ── JWT Authentication Middleware ───────────────────────────────────────
    io.use(async (socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication error: no token'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) return next(new Error('Authentication error: user not found'));
            socket.user = user; // attach user to socket for later use
            next();
        } catch {
            next(new Error('Authentication error: invalid token'));
        }
    });

    // ── Connection Handler ──────────────────────────────────────────────────
    io.on('connection', (socket) => {
        const userId = socket.user._id.toString();
        console.log(`[Socket] User connected: ${socket.user.name} (${userId})`);

        // ── Join a conversation room ────────────────────────────────────────
        socket.on('join_room', (roomId) => {
            // Validate the roomId contains this user's ID (security check)
            if (!roomId.includes(userId)) {
                socket.emit('error', { message: 'Not authorised to join this room' });
                return;
            }
            socket.join(roomId);
            console.log(`[Socket] ${socket.user.name} joined room: ${roomId}`);
        });

        // ── Send a message ──────────────────────────────────────────────────
        socket.on('send_message', async ({ roomId, receiverId, text }) => {
            if (!roomId || !receiverId || !text?.trim()) return;

            // Security: ensure the roomId is actually derived from these two users
            const expectedRoom = [userId, receiverId].sort().join('_');
            if (roomId !== expectedRoom) {
                socket.emit('error', { message: 'Invalid room' });
                return;
            }

            try {
                // Save to MongoDB
                const message = await Message.create({
                    sender: userId,
                    receiver: receiverId,
                    roomId,
                    text: text.trim()
                });

                const populated = await message.populate('sender', 'name');

                // Broadcast to everyone in the room (including sender)
                io.to(roomId).emit('receive_message', {
                    _id: populated._id,
                    text: populated.text,
                    sender: { _id: populated.sender._id, name: populated.sender.name },
                    roomId: populated.roomId,
                    createdAt: populated.createdAt
                });
            } catch (err) {
                console.error('[Socket] send_message error:', err.message);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // ── Mark messages as read ───────────────────────────────────────────
        socket.on('mark_read', async (roomId) => {
            try {
                await Message.updateMany(
                    { roomId, receiver: userId, read: false },
                    { read: true }
                );
            } catch (err) {
                console.error('[Socket] mark_read error:', err.message);
            }
        });

        // ── Disconnect ──────────────────────────────────────────────────────
        socket.on('disconnect', () => {
            console.log(`[Socket] User disconnected: ${socket.user.name}`);
        });
    });

    return io;
};

module.exports = { initSocket };
