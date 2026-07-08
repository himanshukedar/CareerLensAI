const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    companyName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String], // Technical keywords for AI matching
    location: { type: String, default: 'Remote' },
    salaryRange: { type: String, default: 'N/A' },
    applicants: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' }
    }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
