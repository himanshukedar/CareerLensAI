const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
    roadmapId: { type: String, required: true, unique: true }, // 'frontend', 'backend'
    title: { type: String, required: true },
    desc: { type: String },
    type: { type: String, enum: ['role', 'skill', 'best'], default: 'role' },
    isFresh: { type: Boolean, default: false }, // Renamed from isNew
    isAiGenerated: { type: Boolean, default: false },
    steps: [{
        title: { type: String, required: true },
        sub: [String] // Array of sub-steps (nodes)
    }]
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
