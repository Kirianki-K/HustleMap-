const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find all messages where the user is sender or receiver
    const messages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
    })
        .sort({ createdAt: -1 })
        .populate('sender', 'name')
        .populate('receiver', 'name');

    // Deduplicate by roomId — keep only the latest message per room
    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
        if (!seen.has(msg.roomId)) {
            seen.add(msg.roomId);

            // Determine the "other" participant
            const isSender = msg.sender._id.toString() === userId.toString();
            const otherUser = isSender ? msg.receiver : msg.sender;

            // Count unread messages in this room directed at the current user
            const unreadCount = await Message.countDocuments({
                roomId: msg.roomId,
                receiver: userId,
                read: false
            });

            conversations.push({
                roomId: msg.roomId,
                otherUser: { _id: otherUser._id, name: otherUser.name },
                latestMessage: { text: msg.text, createdAt: msg.createdAt },
                unreadCount
            });
        }
    }

    res.status(200).json(conversations);
});

// @desc    Get messages for a specific room
// @route   GET /api/messages/:roomId
// @access  Private
const getRoomMessages = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user._id.toString();

    // Security: only allow access if the user is part of this room
    if (!roomId.includes(userId)) {
        res.status(403);
        throw new Error('Not authorised to view this conversation');
    }

    const messages = await Message.find({ roomId })
        .sort({ createdAt: 1 })
        .populate('sender', 'name');

    res.status(200).json(messages);
});

module.exports = { getConversations, getRoomMessages };
