const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Token = require('../models/Token');

// Middleware to check for Recruiter role
const checkRecruiter = (req, res, next) => {
    // Check role field, or fallback: if companyName field exists it's a recruiter document
    const isRecruiter = req.user.role === 'recruiter' || req.user.role === 'admin';
    const isAdminDoc = req.user.role === 'admin';
    if (!isRecruiter && !isAdminDoc) {
        return res.status(403).json({ msg: 'Access denied: Recruiters only' });
    }
    next();
};

// @route   POST api/recruiter/jobs
// @desc    Post a new job vacancy
router.post('/jobs', auth, checkRecruiter, async (req, res) => {
    const { title, description, requirements, location, salaryRange } = req.body;
    try {
        const newJob = new Job({
            recruiterId: req.user.id,
            companyName: req.user.companyName || 'CareerLens Partner',
            title,
            description,
            requirements,
            location,
            salaryRange
        });
        await newJob.save();
        res.json(newJob);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/recruiter/scan
// @desc    AI Talent Scanner: Find real students matching job requirements
router.get('/scan', auth, checkRecruiter, async (req, res) => {
    const { skills, minScore } = req.query;
    try {
        const query = {};
        if (skills) {
            const skillList = skills.split(',').map(s => s.trim());
            if (skillList.length > 0) {
                // Case-insensitive match for skills in array
                query.skills = { $in: skillList.map(s => new RegExp(`^${s}$`, 'i')) };
            }
        }

        let graduates = await Student.find(query).select('-password');

        // Filter by assessment scores if minScore provided
        if (minScore) {
            const scoreNum = parseInt(minScore);
            graduates = graduates.filter(u => {
                const hasHighMetrics = u.assessments?.some(a => a.score >= scoreNum);
                return hasHighMetrics;
            });
        }

        res.json(graduates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/recruiter/jobs
// @desc    Get all jobs posted by this recruiter
router.get('/jobs', auth, checkRecruiter, async (req, res) => {
    try {
        const jobs = await Job.find({ recruiterId: req.user.id })
            .populate('applicants.userId', 'name email phone headline skills assessments')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/recruiter/dashboard-stats
// @desc    Get aggregate stats for recruiter dashboard
router.get('/dashboard-stats', auth, checkRecruiter, async (req, res) => {
    try {
        const jobs = await Job.find({ recruiterId: req.user.id });
        const totalOpenings = jobs.length;
        const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);

        // Find matches in the Student collection
        const topMatchesCount = await Student.countDocuments({
            'assessments.score': { $gte: 85 }
        });

        res.json({
            totalOpenings,
            totalApplicants,
            topMatchesCount,
            activeJobs: jobs.filter(j => j.isActive).length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/recruiter/applications/:jobId/:userId
// @desc    Update application status
router.patch('/applications/:jobId/:userId', auth, checkRecruiter, async (req, res) => {
    const { status } = req.body;
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        const applicant = job.applicants.find(a => a.userId.toString() === req.params.userId);
        if (!applicant) return res.status(404).json({ msg: 'Applicant not found' });

        applicant.status = status;
        await job.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/recruiter/jobs/:id
// @desc    Delete a job vacancy
router.delete('/jobs/:id', auth, checkRecruiter, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        // Compare both sides as strings to avoid ObjectId vs string mismatch
        const jobOwnerId = job.recruiterId?.toString();
        const requestUserId = req.user.id?.toString() || req.user._id?.toString();

        if (jobOwnerId !== requestUserId && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized to delete this job' });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
