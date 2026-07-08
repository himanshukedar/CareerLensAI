const mongoose = require('mongoose');

const RoadmapProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    roadmapId: { type: String, required: true }, // e.g., 'frontend', 'backend'
    completedNodes: [String], // Array of step titles or IDs
    isFinished: { type: Boolean, default: false },
    tokenEarned: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
});

// Optimize progress lookups
RoadmapProgressSchema.index({ userId: 1, roadmapId: 1 });

module.exports = mongoose.model('RoadmapProgress', RoadmapProgressSchema);
