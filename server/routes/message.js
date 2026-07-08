const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');

// @route   POST api/message/send
// @desc    Send a message
router.post('/send', auth, async (req, res) => {
    const { receiverId, receiverRole, content } = req.body;
    try {
        const senderId = req.user.id;
        const senderRole = req.user.role;

        // Create a unique room ID for the conversation (e.g., sorted IDs)
        const room = [senderId, receiverId].sort().join('_');

        const newMessage = new Message({
            senderId,
            senderRole,
            receiverId,
            receiverRole,
            content,
            room
        });

        await newMessage.save();
        res.json(newMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/message/history/:receiverId
// @desc    Get conversation history with a specific user
router.get('/history/:otherId', auth, async (req, res) => {
    try {
        const myId = req.user.id;
        const otherId = req.params.otherId;
        const room = [myId, otherId].sort().join('_');

        const messages = await Message.find({ room }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/message/chats
// @desc    Get all active chats for the current user
router.get('/chats', auth, async (req, res) => {
    try {
        const myId = req.user.id;
        // Find distinct rooms where user is participant
        const messages = await Message.find({
            $or: [{ senderId: myId }, { receiverId: myId }]
        }).sort({ timestamp: -1 });

        const chatMap = new Map();
        for (const msg of messages) {
            const otherId = msg.senderId.toString() === myId.toString() ? msg.receiverId : msg.senderId;
            const otherRole = msg.senderId.toString() === myId.toString() ? msg.receiverRole : msg.senderRole;

            if (!chatMap.has(otherId.toString())) {
                // Fetch other user's name
                let otherUser;
                if (otherRole === 'student') otherUser = await Student.findById(otherId).select('name');
                else otherUser = await Recruiter.findById(otherId).select('name companyName');

                chatMap.set(otherId.toString(), {
                    id: otherId,
                    name: otherUser ? (otherUser.name || otherUser.companyName) : 'Unknown User',
                    lastMessage: msg.content,
                    timestamp: msg.timestamp,
                    role: otherRole
                });
            }
        }

        res.json(Array.from(chatMap.values()));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
