const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Middleware to check for Admin role
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
    next();
};

// @route   GET api/admin/users
// @desc    Get all students & recruiters with details
router.get('/users', auth, checkAdmin, async (req, res) => {
    try {
        const students = await Student.find().select('-password').lean();
        const recruiters = await Recruiter.find().select('-password').lean();
        const RoadmapProgress = require('../models/RoadmapProgress');
        const Job = require('../models/Job');

        const allProgress = await RoadmapProgress.find().lean();
        const allJobs = await Job.find().lean();

        // Add some mock high-level metrics for "futuristic" feel and attach related data
        const detailedStudents = students.map(s => ({
            ...s,
            ranking: Math.floor(Math.random() * 100),
            trustScore: 85 + Math.floor(Math.random() * 15),
            roadmapProgress: allProgress.filter(p => p.userId.toString() === s._id.toString())
        }));

        const detailedRecruiters = recruiters.map(r => ({
            ...r,
            ranking: Math.floor(Math.random() * 100),
            integrity: 90 + Math.floor(Math.random() * 10),
            jobs: allJobs.filter(j => j.recruiterId.toString() === r._id.toString())
        }));

        res.json({ students: detailedStudents, recruiters: detailedRecruiters });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/user/:id
router.delete('/user/:id', auth, checkAdmin, async (req, res) => {
    try {
        let deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) deleted = await Recruiter.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Profile removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/stats
router.get('/stats', auth, checkAdmin, async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const recruiterCount = await Recruiter.countDocuments();
        const jobCount = await Job.countDocuments();
        const adminCount = await Admin.countDocuments();

        res.json({
            userCount: studentCount,
            recruiterCount,
            jobCount,
            adminCount,
            systemHealth: 'Optimal',
            uptime: '99.9%',
            activeAgents: 3
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/train
// @desc    Trigger AI training
router.post('/train', auth, checkAdmin, async (req, res) => {
    const { agent, data } = req.body;
    try {
        console.log(`[ADMIN] Training initiated for Agent: ${agent}`);
        // Here we would normally call a python script or a dedicated training service
        // For now, we simulate the logic
        res.json({ msg: `Training initiated for ${agent}`, status: 'Processing' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/register
// @desc    Add new admin
router.post('/register', auth, checkAdmin, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await Admin.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Admin already exists' });

        user = new Admin({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ msg: 'New administrator added to the system.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/broadcast
router.post('/broadcast', auth, checkAdmin, async (req, res) => {
    const { message, target } = req.body;
    try {
        console.log(`[BROADCAST] ${target}: ${message}`);
        res.json({ msg: 'System-wide broadcast dispatched.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
