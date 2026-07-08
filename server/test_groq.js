// Quick test script - run with: node test_groq.js
require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GROQ_API_KEY;
console.log('API Key loaded:', !!apiKey);
console.log('Key preview:', apiKey ? apiKey.substring(0, 20) + '...' : 'MISSING');

axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: 'llama-3.1-8b-instant',
    messages: [{
        role: 'user',
        content: 'Explain HTML in 5 simple lines. Reply only in JSON: {"explanation":"...","question":"..."}'
    }],
    temperature: 0.7,
    max_tokens: 1024
}, {
    headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
    }
}).then(r => {
    const text = r.data.choices[0].message.content.trim();
    console.log('\n✅ SUCCESS! Response:');
    console.log(text);
}).catch(e => {
    console.error('\n❌ FAILED:');
    console.error(e?.response?.data || e.message);
});
