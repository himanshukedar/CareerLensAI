const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'recruiter' },
    companyName: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },
    phone: { type: String, default: '' },
    isVerifiedEmail: { type: Boolean, default: false },
    isVerifiedPhone: { type: Boolean, default: false },
    otp: {
        code: String,
        expiry: Date,
        target: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recruiter', RecruiterSchema);
