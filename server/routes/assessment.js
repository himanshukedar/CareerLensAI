const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const RoadmapProgress = require('../models/RoadmapProgress');
const Token = require('../models/Token');
const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8001';

// @route   POST api/assessment/submit
router.post('/submit', auth, async (req, res) => {
    const { type, category, score, metrics } = req.body;
    try {
        const user = await Student.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const assessmentData = {
            type,
            category,
            score,
            metrics,
            completedAt: Date.now()
        };

        let aiAnalysis = null;
        if (type === 'mock_interview' && metrics?.transcript) {
            try {
                const aiRes = await axios.post(`${AI_ENGINE_URL}/analyze-session`, {
                    user_id: user._id.toString(),
                    domain: category,
                    transcript: metrics.transcript
                }, {
                    headers: { 'X-Internal-Secret': process.env.INTERNAL_SECRET || 'careerlens_default_67890' }
                });
                aiAnalysis = aiRes.data;
                assessmentData.aiInsights = {
                    technicalScore: aiAnalysis.technical_score,
                    softSkillsScore: aiAnalysis.soft_skills_score,
                    strengths: aiAnalysis.strengths,
                    weaknesses: aiAnalysis.weaknesses,
                    emotionalFeedback: aiAnalysis.emotional_feedback,
                    nextRoadmapStep: aiAnalysis.next_roadmap_step
                };
                user.swot.strengths = Array.from(new Set([...user.swot.strengths, ...aiAnalysis.strengths]));
                user.swot.weaknesses = Array.from(new Set([...user.swot.weaknesses, ...aiAnalysis.weaknesses]));
            } catch (aiErr) {
                console.error('AI Engine Error:', aiErr.message);
            }
        }

        user.assessments.push(assessmentData);
        await user.save();

        let tokenAwarded = false;
        let tokenTitle = '';
        if (type === 'skill_evaluation' && score >= 85) {
            tokenAwarded = true;
            tokenTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} Skill Verified`;
        } else if (type === 'mock_interview' && (metrics?.confidence >= 85 || (assessmentData.aiInsights?.technicalScore >= 85))) {
            tokenAwarded = true;
            tokenTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} Interview Ace`;
        }

        if (tokenAwarded) {
            const isRoadmapFinished = await RoadmapProgress.findOne({ userId: user.id, roadmapId: category, isFinished: true });
            if (isRoadmapFinished && (metrics?.confidence >= 85 || assessmentData.aiInsights?.technicalScore >= 85)) {
                tokenTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} Completed`;
            }
            const existingToken = await Token.findOne({ userId: user.id, title: tokenTitle });
            if (!existingToken) {
                const newToken = new Token({ userId: user.id, roadmapId: category, title: tokenTitle });
                await newToken.save();
            }
        }

        res.json({ msg: 'Assessment saved successfully', tokenAwarded, tokenTitle, assessment: assessmentData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
