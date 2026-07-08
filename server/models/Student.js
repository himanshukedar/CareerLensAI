const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' },
    headline: { type: String, default: 'Aspiring Learner' },
    aspiration: { type: String, default: '' },
    phone: { type: String, default: '' },
    isVerifiedEmail: { type: Boolean, default: false },
    isVerifiedPhone: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    resume: { type: String, default: '' },
    education: [{
        level: String,
        institution: String,
        course: String,
        year: String,
        percentage: String,
        proofUrl: String
    }],
    certifications: [{
        title: String,
        organization: String,
        date: String,
        proofUrl: String
    }],
    swot: {
        strengths: [String],
        weaknesses: [String],
        opportunities: [String],
        threats: [String]
    },
    skills: [String],
    assessments: [{
        type: { type: String, enum: ['mock_interview', 'skill_evaluation'] },
        category: String,
        score: Number,
        metrics: mongoose.Schema.Types.Mixed,
        completedAt: { type: Date, default: Date.now }
    }],
    otp: {
        code: String,
        expiry: Date,
        target: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
