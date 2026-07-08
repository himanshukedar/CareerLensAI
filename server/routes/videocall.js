const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

// Generate a unique room ID for a video interview
// @route  POST /api/videocall/generate-room
router.post('/generate-room', auth, (req, res) => {
    const roomId = uuidv4();
    res.json({ roomId, callLink: `/video-call/${roomId}` });
});

module.exports = router;
