import api from './api';

/**
 * Calls the backend Groq proxy with a plain text prompt.
 * Returns the raw text response from the AI.
 */
const callGroq = async (prompt) => {
    const res = await api.post('/groq/chat', { prompt });
    return res.data.text;
};

/**
 * Generates a 5-6 line beginner-friendly explanation, one quiz question, and 5-6 essential keywords.
 * Returns: { explanation: string, question: string, keywords: string[] }
 */
export const generateTopicContent = async (topic, sectionTitle) => {
    const prompt = `You are a friendly teacher explaining tech concepts to a complete beginner.
Topic: "${topic}"
Context: "${sectionTitle}" in software development.

Write a 5-6 line explanation that:
- Uses very simple, everyday language (no heavy jargon)
- Uses a real-world analogy or example to make it relatable
- Explains WHY it matters (practical benefit)
- Is easy to understand for someone who just started learning

Provide an array of exactly 2-3 simple, practical questions to test if they understood the concept sequentially.
For each question, provide a list of 4-5 essential keywords or phrases that MUST be involved in a correct answer.
Finally, internally analyze resources like MDN, GeeksforGeeks, and TutorialsPoint for this topic. Determine which one is the most beginner-friendly and accurate, and provide ONLY that ONE best URL.

Respond ONLY in this exact JSON format (no extra text, no markdown):
{
  "explanation": "...",
  "questions": [
    {
      "question": "...",
      "keywords": ["...", "..."]
    },
    {
      "question": "...",
      "keywords": ["...", "..."]
    }
  ],
  "resourceLink": "..."
}`;

    const raw = await callGroq(prompt);

    // Extract JSON block in case model wraps with ```json ... ```
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON from Groq');
    return JSON.parse(jsonMatch[0]);
};

/**
 * Validates user's answer using Groq by comparing keywords.
 * Returns: { isCorrect: boolean, feedback: string }
 */
export const validateAnswer = async (question, answer, expectedKeywords = []) => {
    const keywordString = expectedKeywords.join(', ');
    const prompt = `Question: ${question}
User Answer: ${answer}
Expected Core Concepts (Keywords): ${keywordString}

Task:
1. Extract the core keywords from the User Answer.
2. Compare them against the Expected Core Concepts.
3. If the user's answer demonstrates a clear understanding of the concept (even if not using the exact words, but matching the intent of the keywords), mark it correct.
4. If it's too vague or misses the point, mark it incorrect and give a hint based on the missing keywords.

Reply ONLY in this exact format:
Correct ✅
or
Incorrect ❌: [brief reason and a short hint]`;

    const feedback = await callGroq(prompt);
    const isCorrect = feedback.toLowerCase().startsWith('correct');
    return { isCorrect, feedback };
};
