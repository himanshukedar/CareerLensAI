const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

// POST /api/groq/chat
router.post('/chat', auth, async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GROQ_API_KEY not set on server' });
    }

    try {
        const response = await axios.post(
            GROQ_URL,
            {
                model: GROQ_MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1024,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const text = response.data.choices[0].message.content.trim();
        return res.json({ text });

    } catch (err) {
        const errMsg = err?.response?.data?.error?.message || err.message || 'Unknown error';
        console.error('Groq API error:', errMsg);
        return res.status(500).json({ error: errMsg });
    }
});

module.exports = router;
