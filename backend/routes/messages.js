const express = require('express');
const router = express.Router();
const { getConversations, getRoomMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/:roomId', protect, getRoomMessages);

module.exports = router;
