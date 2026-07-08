const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const RoadmapProgress = require('../models/RoadmapProgress');
const Student = require('../models/Student');
const Roadmap = require('../models/Roadmap');
const Token = require('../models/Token');
const Job = require('../models/Job');

// @route   GET api/roadmap
// @desc    Get All Roadmaps
router.get('/', auth, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find().select('-steps');
        res.json(roadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/generate
// @desc    Generate a new roadmap via AI if it doesn't exist
router.post('/generate', auth, async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ msg: 'Topic is required' });

    try {
        let roadmapId = topic.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        
        // Check if exists
        let existing = await Roadmap.findOne({ roadmapId });
        if (existing) {
            return res.json(existing);
        }

        // Call Groq to generate
        const prompt = `Generate a detailed learning roadmap for "${topic}".
Respond ONLY with a valid JSON object matching exactly this structure:
{
  "title": "Roadmap Title (e.g., ${topic})",
  "desc": "A short 1-2 sentence description of this roadmap.",
  "type": "role", // MUST be one of: "role", "skill", "best"
  "steps": [
    {
      "title": "Step 1: Fundamentals",
      "sub": ["Sub-topic 1", "Sub-topic 2", "Sub-topic 3"]
    }
  ]
}
Ensure there are 5-10 logical steps in the roadmap. Do not include markdown blocks or any text outside the JSON.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Groq error:", errText);
            return res.status(500).json({ msg: 'AI generation failed' });
        }

        const apiData = await response.json();
        const generatedData = JSON.parse(apiData.choices[0].message.content);

        // Save to DB
        const newRoadmap = new Roadmap({
            roadmapId,
            title: generatedData.title || topic,
            desc: generatedData.desc || `AI generated roadmap for ${topic}`,
            type: ['role', 'skill', 'best'].includes(generatedData.type) ? generatedData.type : 'skill',
            isFresh: true,
            isAiGenerated: true,
            steps: generatedData.steps || []
        });

        await newRoadmap.save();
        res.json(newRoadmap);

    } catch (err) {
        console.error("Roadmap generation error:", err);
        res.status(500).json({ msg: 'Server Error during roadmap generation' });
    }
});

// @route   GET api/roadmap/jobs
// @desc    Get all active jobs for students
router.get('/jobs', auth, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/jobs/:jobId/apply
// @desc    Apply to a specific job
router.post('/jobs/:jobId/apply', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        // Check if user already applied
        if (job.applicants.some(applicant => applicant.userId.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'You have already applied for this job' });
        }

        // Add user to applicants with pending status
        job.applicants.unshift({ userId: req.user.id, status: 'pending', appliedAt: Date.now() });
        await job.save();

        res.json({ msg: 'Application submitted successfully', job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/roadmap/:roadmapId
router.get('/:roadmapId', auth, async (req, res) => {
    try {
        const roadmapId = req.params.roadmapId;
        const content = await Roadmap.findOne({ roadmapId });
        if (!content) return res.status(404).json({ msg: 'Roadmap not found' });

        let progress = await RoadmapProgress.findOne({
            userId: req.user.id,
            roadmapId: roadmapId
        });

        if (!progress) {
            progress = {
                roadmapId,
                completedNodes: [],
                isFinished: false,
                tokenEarned: false
            };
        }

        res.json({ content, progress });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/roadmap/node
router.put('/node', auth, async (req, res) => {
    const { roadmapId, nodeTitle } = req.body;
    try {
        let progress = await RoadmapProgress.findOne({ userId: req.user.id, roadmapId });
        if (!progress) {
            progress = new RoadmapProgress({ userId: req.user.id, roadmapId, completedNodes: [] });
        }
        const index = progress.completedNodes.indexOf(nodeTitle);
        if (index === -1) progress.completedNodes.push(nodeTitle);
        else progress.completedNodes.splice(index, 1);

        progress.lastUpdated = Date.now();
        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/complete
router.post('/complete', auth, async (req, res) => {
    const { roadmapId, roadmapTitle } = req.body;
    try {
        let progress = await RoadmapProgress.findOne({ userId: req.user.id, roadmapId });
        if (!progress) return res.status(404).json({ msg: 'Progress not found' });

        progress.isFinished = true;
        let token = null;

        if (!progress.tokenEarned) {
            const user = await Student.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: 'Student record not found' });

            const highScoringInterview = user.assessments.some(a =>
                a.type === 'mock_interview' &&
                a.category === roadmapId &&
                a.score >= 85
            );

            const tokenTitle = highScoringInterview
                ? `${roadmapTitle} Completed`
                : `${roadmapTitle} Roadmap Master`;

            // Check if token already exists (resilience)
            const existingToken = await Token.findOne({ userId: req.user.id, title: tokenTitle });
            if (!existingToken) {
                token = new Token({
                    userId: req.user.id,
                    roadmapId,
                    title: tokenTitle,
                    imageUrl: 'https://via.placeholder.com/150/00f3ff/000000?text=Token'
                });
                await token.save();
            } else {
                token = existingToken;
            }
            progress.tokenEarned = true;
        }

        await progress.save();
        res.json({ progress, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/downgrade
router.post('/downgrade', auth, async (req, res) => {
    const { roadmapId, topicsToRemove } = req.body;
    try {
        let progress = await RoadmapProgress.findOne({ userId: req.user.id, roadmapId });
        if (!progress) return res.status(404).json({ msg: 'Progress not found' });

        progress.completedNodes = progress.completedNodes.filter(node => !topicsToRemove.includes(node));
        progress.isFinished = false;
        
        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
