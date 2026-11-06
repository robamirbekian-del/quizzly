import axios from 'axios'

// ─────────────────────────────────────────────
// API CLIENT
//
// Right now this calls the Anthropic API directly
// from the browser using your key in .env
//
// When you add a backend server, swap the baseURL
// to your own server and remove the Anthropic key
// from the frontend entirely:
//
// const client = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// })
// ─────────────────────────────────────────────

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

// ─────────────────────────────────────────────
// GENERATE QUESTIONS
//
// Takes the article text and quiz config,
// returns a structured list of questions.
// ─────────────────────────────────────────────
export async function generateQuestions(articleText, config) {
  const { level, qCount, qType, startDiff } = config

  const diffInstructions = {
    easy:   'Start with easy questions and gradually increase to medium, then hard.',
    medium: 'Start with medium difficulty questions and gradually increase to hard.',
    hard:   'All questions should be hard and challenging.',
    mixed:  'Mix easy, medium, and hard questions randomly throughout.',
  }

  const typeDescription = qType === 'multiple'
    ? 'multiple choice with 4 options (A, B, C, D) — there may be more than one correct answer'
    : 'single choice with exactly 2 options: True and False'

  const prompt = `
You are a quiz generator for students. Analyse the article below and create exactly ${qCount} questions for a ${level} school student.

Question type: ${typeDescription}
Difficulty progression: ${diffInstructions[startDiff]}

Return ONLY a valid JSON object — no markdown, no explanation, no code fences. Use this exact structure:
{
  "topic": "Short topic name (4 words max)",
  "questions": [
    {
      "question": "Question text here?",
      "difficulty": "easy",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": [0]
    }
  ]
}

Rules:
- "difficulty" must be one of: "easy", "medium", "hard"
- "correct" is an array of correct option indices (0-based)
- For True/False questions, options must be ["True", "False"]
- For multiple choice, there can be 1 or 2 correct answers
- Questions must be based strictly on the article content

ARTICLE:
${articleText.substring(0, 4000)}
  `.trim()

  const response = await axios.post(
    ANTHROPIC_URL,
    {
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    }
  )

  // Extract and parse the JSON from Claude's response
  const raw = response.data.content
    .map(block => block.text || '')
    .join('')
    .replace(/```json|```/g, '')
    .trim()

  const parsed = JSON.parse(raw)
  return parsed
}

// ─────────────────────────────────────────────
// FUTURE API CALLS GO HERE
//
// When you add a backend + Supabase, add functions
// like these (they'll call your server instead):
//
// export async function saveResult(result) {
//   const { data } = await client.post('/api/results', result)
//   return data
// }
//
// export async function getHistory(userId) {
//   const { data } = await client.get(`/api/results/${userId}`)
//   return data
// }
// ─────────────────────────────────────────────
