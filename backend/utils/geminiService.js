const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

let genAI;
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

// Pre-init all models so we can cycle through them on failure
const modelInstances = {};

try {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'replace_with_gemini_api_key') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    for (const name of MODELS) {
      try { modelInstances[name] = genAI.getGenerativeModel({ model: name }); } catch { }
    }
  }
} catch (error) {
  console.error('[AI] Init error:', error.message);
}

function isRateLimitError(err) {
  return err?.status === 429 || err?.status === 503 ||
    err?.message?.includes('429') ||
    err?.message?.includes('503') ||
    err?.message?.includes('quota') ||
    err?.message?.includes('Too Many Requests') ||
    err?.message?.includes('Service Unavailable') ||
    err?.message?.includes('high demand');
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate with multi-model fallback + retry
async function generateWithGemini(parts, schema = null) {
  if (!genAI || Object.keys(modelInstances).length === 0) {
    throw new Error('Gemini AI not configured. Please set a valid GEMINI_API_KEY in your .env file.');
  }

  const contentParts = typeof parts === 'string' ? [{ text: parts }] : parts;
  const request = {
    contents: [{ role: 'user', parts: contentParts }],
    generationConfig: { maxOutputTokens: 16384, temperature: 0.1 },
  };
  if (schema) {
    request.generationConfig.responseMimeType = 'application/json';
    request.generationConfig.responseSchema = schema;
  }

  // Try each model, with 1 retry per model
  const availableModels = MODELS.filter(m => modelInstances[m]);
  let lastError;

  for (const modelName of availableModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[AI] Trying ${modelName} (attempt ${attempt + 1})...`);
        const result = await modelInstances[modelName].generateContent(request);
        const response = await result.response;
        const text = response.text();
        if (!text) throw new Error('Empty response');
        console.log(`[AI] ${modelName} succeeded`);
        return text;
      } catch (err) {
        lastError = err;
        console.error(`[AI] ${modelName} attempt ${attempt + 1} failed:`, err.status || '', err.message);

        if (isRateLimitError(err)) {
          const delay = Math.min(2000 * Math.pow(2, attempt), 8000); // 2s, 4s max
          console.log(`[AI] Rate limited. Waiting ${delay}ms...`);
          await wait(delay);
          continue; // retry same model
        }
        // Non-retryable error on this model, try next model
        break;
      }
    }
  }

  // All models exhausted
  if (lastError && isRateLimitError(lastError)) {
    throw new Error('AI service is temporarily unavailable due to high demand. Please try again in a few moments.');
  }
  throw lastError || new Error('All AI models failed.');
}

// ─── Parse JSON from AI response ───
function parseJSONSafely(text) {
  if (!text || typeof text !== 'string') return null;

  // 1. Try markdown code block extraction
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (markdownMatch) {
    try { return JSON.parse(markdownMatch[1].trim()); } catch { /* continue */ }
  }

  // 2. Try extracting JSON array directly
  const arrayMatch = text.match(/(\[[\s\S]*\])/);
  if (arrayMatch) {
    try { return JSON.parse(arrayMatch[1].trim()); } catch { /* continue */ }
  }

  // 3. Try the entire text as JSON
  try { return JSON.parse(text.trim()); } catch { /* continue */ }

  return null;
}

// ─── Retry wrapper for AI calls ───
async function withRetry(fn, maxRetries = 3, label = 'AI call') {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (err) {
      lastError = err;
      if (isRateLimitError(err) && i < maxRetries - 1) {
        const delay = Math.min(2000 * Math.pow(2, i), 10000);
        console.log(`[AI] ${label} rate limited. Retry ${i + 1}/${maxRetries} in ${delay}ms...`);
        await wait(delay);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// ─── Upload file to Gemini ───
async function uploadToGemini(filePath, mimeType) {
  return await genAI.fileManager.uploadFile(filePath, { mimeType, displayName: filePath });
}

// ─── Analyze PDF directly via Gemini ───
async function analyzePDFFile(filePath) {
  try {
    const uploadResult = await uploadToGemini(filePath, 'application/pdf');
    const file = uploadResult.file;

    const prompt = `Analyze this PDF and extract:
1. Key topics/concepts covered (list them)
2. A brief summary
3. Estimated number of potential quiz questions that could be generated

Return as JSON: {"topics": ["topic1", "topic2"], "summary": "...", "questionCount": 15}`;

    const result = await generateWithGemini([
      { text: prompt },
      { fileData: { mimeType: file.mimeType, fileUri: file.uri } },
    ]);

    return parseJSONSafely(result) || { topics: [], summary: '', questionCount: 0 };
  } catch (error) {
    console.error('PDF analysis error:', error.message);
    return { topics: [], summary: '', questionCount: 0 };
  }
}

// ─── Analyze text content ───
async function analyzePDFContent(text) {
  try {
    const prompt = `Analyze this text and extract:
1. Key topics/concepts covered (list them)
2. A brief summary
3. Estimated number of potential quiz questions

TEXT: ${text}

Return as JSON: {"topics": ["topic1", "topic2"], "summary": "...", "questionCount": 15}`;

    const result = await generateWithGemini(prompt);
    return parseJSONSafely(result) || { topics: [], summary: '', questionCount: 0 };
  } catch (error) {
    console.error('Content analysis error:', error.message);
    return { topics: [], summary: '', questionCount: 0 };
  }
}

// ─── Generate Quiz Questions ───
const QuizQuestionSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      question: { type: 'string' },
      options: { type: 'array', items: { type: 'string' } },
      correctAnswer: { type: 'integer' },
      topic: { type: 'string' },
    },
    required: ['question', 'options', 'correctAnswer', 'topic'],
  },
};

async function generateQuizQuestions({ pdfContent, difficulty = 'medium', count = 10, type = 'practice', selectedTopics = [] }) {
  const topicHint = selectedTopics.length > 0 ? ` focusing on these topics: ${selectedTopics.join(', ')}` : '';
  const typeDesc = type === 'exam_simulation' ? 'exam-style' : 'practice';

  const prompt = `Generate ${count} ${typeDesc} multiple-choice questions ${topicHint} at ${difficulty} difficulty level.

Source material: ${pdfContent}

Requirements:
- 4 options per question (A, B, C, D)
- Only ONE correct answer per question
- Correct answer index: 0=A, 1=B, 2=C, 3=D
- Each question must test understanding, not just memorization
- Include questions that require application of concepts
- Return ONLY a JSON array

Format:
[{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "topic": "topic name"}]`;

  const result = await generateWithGemini(prompt, QuizQuestionSchema);
  let questions = parseJSONSafely(result);

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    // Fallback retry without schema
    const fallback = await generateWithGemini(prompt);
    questions = parseJSONSafely(fallback);
  }

  if (!questions || !Array.isArray(questions)) {
    throw new Error('Could not generate valid questions. Please try again.');
  }

  // Validate and clean
  return questions.filter(q =>
    q.question && q.options && Array.isArray(q.options) && q.options.length === 4 &&
    typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3
  );
}

// ─── Generate Explanation ───
async function generateExplanation(question, options, correctAnswer, selectedAnswer, topic) {
  const prompt = `Explain this quiz answer:

Question: ${question}
Options: A) ${options[0]}, B) ${options[1]}, C) ${options[2]}, D) ${options[3]}
Correct: ${String.fromCharCode(65 + correctAnswer)}) ${options[correctAnswer]}
Student picked: ${String.fromCharCode(65 + selectedAnswer)}) ${options[selectedAnswer]}

Provide a 2-3 sentence explanation of why the correct answer is right and why the student's choice was wrong (if different).`;

  const result = await generateWithGemini(prompt);
  return result?.trim() || 'Review the correct answer and your course materials.';
}

// ─── Generate Session Feedback ───
async function generateSessionFeedback(session) {
  const prompt = `Provide encouraging feedback for a student who scored ${session.score}% on a ${session.type} quiz with ${session.questions.length} questions. Keep it under 2 sentences. Be motivating and specific.`;
  const result = await generateWithGemini(prompt);
  return result?.trim() || 'Great effort! Keep practicing to improve your score.';
}

// ─── Generate Flashcards ───
const FlashcardSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      front: { type: 'string' },
      back: { type: 'string' },
      topic: { type: 'string' },
    },
    required: ['front', 'back', 'topic'],
  },
};

async function generateFlashcards({ topic, pdfContent, count = 10 }) {
  const prompt = `Generate ${count} study flashcards for the topic "${topic}" based on these course materials:

${pdfContent ? pdfContent.substring(0, 15000) : 'General knowledge about ' + topic}

Each flashcard: concise question/term on front (1 sentence), clear memorable explanation on back (2-3 sentences). Focus on core concepts.

Return ONLY a JSON array: [{"front":"...","back":"...","topic":"..."}]`;

  try {
    const result = await generateWithGemini(prompt, FlashcardSchema);
    let cards = parseJSONSafely(result);
    if (!cards || cards.length === 0) {
      const fallback = await generateWithGemini(prompt);
      cards = parseJSONSafely(fallback);
    }
    return (cards || []).map(f => ({
      front: f.front || f.question || 'Key Concept',
      back: f.back || f.answer || f.explanation || 'Review your materials.',
      topic: f.topic || topic,
    }));
  } catch {
    // Fallback without AI
    return [
      { front: `What is ${topic}?`, back: `${topic} is a key concept from your course materials.`, topic },
      { front: `Why is ${topic} important?`, back: `Understanding ${topic} is essential for exam success.`, topic },
      { front: `Define ${topic}`, back: `${topic} is a fundamental area in your study materials.`, topic },
      { front: `Key fact about ${topic}`, back: `This topic appears frequently in exams.`, topic },
      { front: `Application of ${topic}`, back: `${topic} has real-world applications in your field.`, topic },
    ];
  }
}

module.exports = {
  analyzePDFFile,
  analyzePDFContent,
  generateQuizQuestions: generateQuizQuestions,
  generateExplanation,
  generateSessionFeedback,
  generateFlashcards,
  withRetry,
};
