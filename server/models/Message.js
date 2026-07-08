const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ['student', 'recruiter'], required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverRole: { type: String, enum: ['student', 'recruiter'], required: true },
    content: { type: String, required: true },
    room: { type: String, required: true }, // To group conversations
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
