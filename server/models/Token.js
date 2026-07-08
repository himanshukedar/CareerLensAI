const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    roadmapId: { type: String, required: true },
    title: { type: String, required: true }, // e.g., "Frontend Master"
    issuedAt: { type: Date, default: Date.now },
    imageUrl: { type: String, default: '' } // Generative AI image URL in future
});

// Prevent duplicate tokens for the same achievement
TokenSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Token', TokenSchema);
