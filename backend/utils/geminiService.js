const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'replace_with_gemini_api_key') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
} catch (error) {
  // Silent init failure
}

function isRateLimitError(err) {
  return err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('Too Many Requests');
}

function getRetryDelay(err) {
  const details = err?.errorDetails || [];
  for (const d of details) {
    if (d['@type']?.includes('RetryInfo') && d.retryDelay) {
      const seconds = parseInt(d.retryDelay);
      if (!isNaN(seconds)) return seconds;
    }
  }
  return 60;
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate content with optional JSON schema enforcement
async function generateWithGemini(parts, schema = null) {
  if (!model) {
    throw new Error('Gemini AI not configured. Please set a valid GEMINI_API_KEY in your .env file.');
  }

  const contentParts = typeof parts === 'string' ? [{ text: parts }] : parts;

  const request = {
    contents: [{ role: 'user', parts: contentParts }],
    generationConfig: {
      maxOutputTokens: 16384,
      temperature: 0.1,
    }
  };

  // Force JSON output when a schema is provided
  if (schema) {
    request.generationConfig.responseMimeType = 'application/json';
    request.generationConfig.responseSchema = schema;
  }

  const result = await model.generateContent(request);
  const response = await result.response;
  return response.text();
}

// ─── Parse JSON from AI response ───
// Handles: markdown code blocks, raw JSON, truncated responses
function parseJSONSafely(text) {
  if (!text || typeof text !== 'string') return null;

  // 1. Try markdown code block extraction
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (markdownMatch) {
    try {
      const parsed = JSON.parse(markdownMatch[1].trim());
      return parsed;
    } catch {}
  }

  // 2. Try the whole text as JSON
  try {
    const parsed = JSON.parse(text.trim());
    return parsed;
  } catch {}

  // 3. Try to fix truncated JSON by adding missing closing brackets
  let fixed = text.trim();
  // Count opening/closing brackets for arrays and objects
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/\]/g) || []).length;
  const openBraces = (fixed.match(/\{/g) || []).length;
  const closeBraces = (fixed.match(/\}/g) || []).length;
  
  // Add missing closers
  if (fixed.startsWith('[')) {
    for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += ']';
    for (let i = 0; i < openBraces - closeBraces; i++) fixed += '}';
  } else if (fixed.startsWith('{')) {
    for (let i = 0; i < openBraces - closeBraces; i++) fixed += '}';
    for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += ']';
  }
  
  try {
    const parsed = JSON.parse(fixed);
    return parsed;
  } catch {}

  // 4. Extract largest valid JSON structure
  const jsonRegex = /\{[\s\S]*?\}|\[[\s\S]*?\]/g;
  let bestMatch = null;
  let bestLength = 0;
  let match;

  while ((match = jsonRegex.exec(text)) !== null) {
    try {
      const candidate = match[0];
      const parsed = JSON.parse(candidate);
      if (candidate.length > bestLength) {
        bestLength = candidate.length;
        bestMatch = parsed;
      }
    } catch {
      // Continue to next match
    }
  }

  return bestMatch;
}

// ─── Read PDF as base64 inline data for Gemini ───
function pdfAsGeminiPart(filePath) {
  const buffer = fs.readFileSync(filePath);
  return {
    inlineData: {
      mimeType: 'application/pdf',
      data: buffer.toString('base64'),
    },
  };
}

// JSON schema for PDF analysis response
const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          confidence: { type: 'number' }
        },
        required: ['name', 'confidence']
      }
    },
    summary: { type: 'string' },
    questionCount: { type: 'integer' }
  },
  required: ['topics', 'summary', 'questionCount']
};

// JSON schema for quiz questions response
const QUIZ_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      type: { type: 'string' },
      question: { type: 'string' },
      options: {
        type: 'array',
        items: { type: 'string' }
      },
      correctAnswer: { type: 'integer' },
      explanation: { type: 'string' },
      topic: { type: 'string' },
      difficulty: { type: 'string' }
    },
    required: ['id', 'type', 'question', 'options', 'correctAnswer', 'explanation', 'topic', 'difficulty']
  }
};

// ─── Analyze a PDF file by sending it directly to Gemini ───
exports.analyzePDFFile = async (filePath) => {
  if (!model) throw new Error('Gemini AI not configured.');

  const pdfPart = pdfAsGeminiPart(filePath);
  const prompt = `Analyze the uploaded educational document. Identify the main topics covered, provide a brief summary, and estimate how many quiz questions could be generated from this material.

Respond ONLY with a JSON object matching this exact structure:
{
  "topics": [{"name": "Topic Name", "confidence": 0.9}],
  "summary": "brief 2-sentence summary",
  "questionCount": 15
}`;

  try {
    const response = await generateWithGemini([pdfPart, { text: prompt }], ANALYSIS_SCHEMA);
    const parsed = parseJSONSafely(response);
    if (parsed && parsed.topics && Array.isArray(parsed.topics)) return parsed;
    throw new Error(`AI returned invalid format. Raw: ${response?.substring(0, 300)}`);
  } catch (error) {
    if (isRateLimitError(error)) throw new Error(`AI rate limit hit. Wait ${getRetryDelay(error)}s and retry.`);
    throw error;
  }
};

// ─── Analyze extracted text (used for PPTX) ───
exports.analyzePDFContent = async (text) => {
  if (!model) throw new Error('Gemini AI not configured.');
  if (text.length < 50) throw new Error('Extracted text is too short to analyze.');

  const prompt = `Analyze the following educational content and respond with ONLY a valid JSON object.

Required format:
{
  "topics": [{"name": "Topic Name", "confidence": 0.9}],
  "summary": "brief 2-sentence summary",
  "questionCount": 15
}

Content to analyze:
${text.substring(0, 8000)}`;

  try {
    const response = await generateWithGemini(prompt, ANALYSIS_SCHEMA);
    const parsed = parseJSONSafely(response);
    if (parsed && parsed.topics && Array.isArray(parsed.topics)) return parsed;
    throw new Error(`AI returned invalid format. Raw: ${response?.substring(0, 300)}`);
  } catch (error) {
    if (isRateLimitError(error)) throw new Error(`AI rate limit hit. Wait ${getRetryDelay(error)}s and retry.`);
    throw error;
  }
};

// ─── Quiz Question Generation ───
// Accepts EITHER pdfFilePath (for direct PDF upload) OR pdfContent (for extracted text from PPTX)
// Pass seenQuestions array to prevent generating duplicate questions
exports.generateQuizQuestions = async ({ topic, difficulty, count, userLevel, pdfContent, pdfFilePath, selectedTopics, seenQuestions }) => {
  if (!model) throw new Error('Gemini AI not configured.');

  const topicStr = Array.isArray(selectedTopics) ? selectedTopics.join(', ') : topic;

  // Build the "avoid these questions" section
  const seenSection = (seenQuestions && seenQuestions.length > 0)
    ? `\n\nCRITICAL: Do NOT repeat any of these previously asked questions. Generate completely different questions:\n${seenQuestions.slice(-20).map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  const prompt = `You are an expert exam question writer. Generate exactly ${count} ${difficulty} difficulty multiple-choice quiz questions.

INSTRUCTIONS:
1. Base ALL questions ONLY on the provided study material. Do NOT use outside knowledge.
2. Each question must test understanding of specific content from the material.
3. Focus on these topic areas: ${topicStr}
4. Make questions that require comprehension, not just memorization.
5. Each question must be UNIQUE and different from any previously asked questions.${seenSection}

Each question must have these exact fields: id, type, question, options, correctAnswer, explanation, topic, difficulty.

Rules:
- correctAnswer must be 0, 1, 2, or 3 (index of correct option)
- type: "multiple_choice" (4 options) or "true_false" (2 options)
- Explanations must reference specific content from the material
- Generate EXACTLY ${count} questions, no more, no less`;

  let attempts = 0;
  let lastError = null;

  while (attempts < 2) {
    attempts++;
    try {
      let response;

      if (pdfFilePath && fs.existsSync(pdfFilePath)) {
        // Send PDF directly to Gemini with schema enforcement
        const pdfPart = pdfAsGeminiPart(pdfFilePath);
        response = await generateWithGemini([pdfPart, { text: prompt }], QUIZ_SCHEMA);
      } else {
        // Fall back to extracted text in prompt
        const pdfSnippet = pdfContent ? pdfContent.substring(0, 12000) : '';
        const fullPrompt = prompt + `\n\nSTUDY MATERIAL:\n${pdfSnippet}`;
        response = await generateWithGemini(fullPrompt, QUIZ_SCHEMA);
      }

      const questions = parseJSONSafely(response);
      if (Array.isArray(questions) && questions.length > 0) {
        const valid = questions.every(q =>
          typeof q.question === 'string' &&
          Array.isArray(q.options) &&
          typeof q.correctAnswer === 'number' &&
          typeof q.explanation === 'string'
        );
        if (valid) return questions;
      }
      lastError = new Error(`Attempt ${attempts}: AI returned ${Array.isArray(questions) ? 'empty' : 'invalid'} JSON. Raw: ${response?.substring(0, 300)}`);
    } catch (error) {
      if (isRateLimitError(error)) throw error;
      lastError = error;
    }

    if (attempts < 2) await wait(1000);
  }

  throw lastError || new Error('AI failed to generate valid questions after 2 attempts. Please try again.');
};

// ─── Explanation Generation ───
exports.generateExplanation = async (question, options, correctIndex) => {
  if (!model) return `The correct answer is ${options[correctIndex] || 'the marked option'}.`;

  try {
    const prompt = `Explain this question concisely:

Question: ${question}
Options: ${options.join(', ')}
Correct Answer: ${options[correctIndex]}

Explain why this is correct and why the others are wrong. Keep it under 100 words.`;

    const response = await generateWithGemini(prompt);
    return response?.trim() || `The correct answer is ${options[correctIndex]}.`;
  } catch {
    return `The correct answer is ${options[correctIndex]}.`;
  }
};

// ─── Session Feedback ───
exports.generateSessionFeedback = async (session) => {
  const score = session.score || 0;
  const baseFeedback = score >= 80
    ? 'Excellent work! Your mastery is strong. Keep practicing to maintain this level.'
    : score >= 60
    ? 'Good effort! Focus on missed topics and review. You are on the right track.'
    : 'Keep pushing! Review the material thoroughly. Consistent practice leads to mastery.';

  if (!model) return baseFeedback;

  try {
    const weakTopics = session.weakAreas?.join(', ') || 'various topics';
    const prompt = `Student scored ${session.score}% on ${session.totalQuestions} questions. Weak areas: ${weakTopics}. Give brief encouraging feedback in 2 sentences max.`;

    const response = await generateWithGemini(prompt);
    return response?.trim() || baseFeedback;
  } catch {
    return baseFeedback;
  }
};

// ─── Overload Detection ───
exports.detectOverload = async (recentAnswers) => {
  const wrongCount = recentAnswers.filter(a => !a.isCorrect).length;
  if (!model) return wrongCount >= 3;

  try {
    const prompt = `Student has ${wrongCount} wrong out of ${recentAnswers.length} recent answers. Should they take a break? Answer only "true" or "false". Break suggested if >= 3 wrong.`;
    const response = await generateWithGemini(prompt);
    return response?.toLowerCase().includes('true');
  } catch {
    return wrongCount >= 3;
  }
};

// Keep old function for backward compat
exports.extractTextFromPDF = async (filePath) => {
  try {
    const mod = require('pdf-parse');
    let pdfParse = null;
    if (typeof mod === 'function') pdfParse = mod;
    else if (mod && typeof mod.default === 'function') pdfParse = mod.default;
    else if (mod && typeof mod.parse === 'function') pdfParse = mod.parse;
    if (pdfParse) {
      const data = await pdfParse(filePath);
      if (data && data.text) return data.text.substring(0, 50000);
    }
  } catch {}
  throw new Error('PDF text extraction not available.');
};
