const QuizSession = require('../models/QuizSession');
const QuizQuestion = require('../models/QuizQuestion');
const User = require('../models/User');
const PDFCloud = require('../models/PDFCloud');
const { generateQuizQuestions, generateExplanation } = require('../utils/geminiService');

// ─── Get available topics from user's uploaded materials ───
exports.getStudyTopics = async (req, res) => {
  try {
    const pdfs = await PDFCloud.find({
      user: req.userId,
      status: 'processed',
    }).select('originalName extractedText topics summary questionCount cloudinaryUrl fileType fileSize');

    if (!pdfs || pdfs.length === 0) {
      return res.status(404).json({
        message: 'No processed materials found. Please upload study materials first.',
        hasMaterials: false
      });
    }

    const topicMap = new Map();
    let totalMaxQuestions = 0;

    for (const pdf of pdfs) {
      if (pdf.extractedText === '[PDF_DIRECT]') {
        totalMaxQuestions += Math.min(30, Math.max(5, pdf.questionCount || 15));
      } else {
        totalMaxQuestions += Math.min(30, Math.max(5, Math.floor((pdf.extractedText?.length || 0) / 500)));
      }

      if (pdf.topics && pdf.topics.length > 0) {
        for (const t of pdf.topics) {
          const name = t.name || t;
          if (!topicMap.has(name)) {
            topicMap.set(name, { name, confidence: t.confidence || 0.5, count: 1 });
          } else {
            const existing = topicMap.get(name);
            existing.confidence = Math.max(existing.confidence, t.confidence || 0.5);
            existing.count += 1;
          }
        }
      }
    }

    let topics = Array.from(topicMap.values()).sort((a, b) => b.confidence - a.confidence);
    if (topics.length === 0) topics = [{ name: 'General', confidence: 1.0, count: 1 }];

    const user = await User.findById(req.userId).select('difficulty');

    res.json({
      hasMaterials: true,
      pdfCount: pdfs.length,
      totalMaxQuestions: Math.min(30, totalMaxQuestions),
      topics: topics.map(t => t.name),
      defaultDifficulty: user?.difficulty || 'medium',
    });
  } catch (error) {
    console.error('Get study topics error:', error);
    res.status(500).json({ message: 'Error fetching study topics' });
  }
};

// ─── Create a study session with PDF-aware question generation ───
exports.createSession = async (req, res) => {
  try {
    // CRITICAL FIX: accept both `count` and `questionCount` from frontend
    const { type, difficulty, count, questionCount, title, selectedTopics } = req.body;
    const requestedCount = count || questionCount || 5;
    const user = await User.findById(req.userId);

    // Fetch user's processed materials
    const pdfs = await PDFCloud.find({
      user: req.userId,
      status: 'processed',
      extractedText: { $exists: true, $ne: '' }
    }).select('originalName extractedText topics summary filePath fileType');

    if (!pdfs || pdfs.length === 0) {
      return res.status(404).json({
        message: 'No processed materials found. Please upload study materials first.',
        hasMaterials: false
      });
    }

    // Separate PDFs (send directly) from PPTX (use extracted text)
    const pdfFiles = [];
    let combinedText = '';
    const allTopics = [];

    for (const pdf of pdfs) {
      if (pdf.extractedText === '[PDF_DIRECT]' && pdf.filePath) {
        pdfFiles.push(pdf.filePath);
      } else if (pdf.extractedText) {
        combinedText += '\n\n---\nSOURCE: ' + pdf.originalName + '\n' + pdf.extractedText;
      }
      if (pdf.topics) {
        for (const t of pdf.topics) {
          const name = t.name || t;
          if (!allTopics.includes(name)) allTopics.push(name);
        }
      }
    }

    const topicsToUse = (selectedTopics && selectedTopics.length > 0)
      ? selectedTopics
      : allTopics;

    const topicString = Array.isArray(topicsToUse) ? topicsToUse.join(', ') : topicsToUse;
    const sessionTitle = title || `${topicString} Quiz`;

    // CRITICAL FIX: Request exactly `requestedCount` questions
    const questions = await generateQuizQuestions({
      topic: topicString,
      difficulty: difficulty || user.difficulty,
      count: requestedCount,
      userLevel: user.schoolType,
      pdfContent: combinedText || undefined,
      pdfFilePath: pdfFiles.length > 0 ? pdfFiles[0] : undefined,
      selectedTopics: topicsToUse,
      seenQuestions: [], // New session = no seen questions yet
    });

    const session = await QuizSession.create({
      user: req.userId,
      type: type || 'practice',
      title: sessionTitle,
      topic: topicString,
      difficulty: difficulty || user.difficulty,
      totalQuestions: requestedCount, // Store the ACTUAL requested count
      seenQuestions: questions.map(q => ({ questionText: q.question, topic: q.topic })),
    });

    res.status(201).json({
      session: {
        id: session._id,
        title: session.title,
        type: session.type,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions,
      },
      questions,
    });
  } catch (error) {
    console.error('Create session error:', error);
    const status = error.message?.includes('rate limit') ? 429 : error.message?.includes('not configured') ? 503 : error.message?.includes('No processed') ? 404 : 500;
    res.status(status).json({ message: error.message || 'Error creating quiz session' });
  }
};

// ─── Generate a NEW set of questions for the same session ───
exports.generateNewSet = async (req, res) => {
  try {
    const { sessionId, selectedTopics } = req.body;
    const user = await User.findById(req.userId);

    // Fetch the session to get already-seen questions
    const session = await QuizSession.findOne({ _id: sessionId, user: req.userId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Fetch user's processed materials
    const pdfs = await PDFCloud.find({
      user: req.userId,
      status: 'processed',
      extractedText: { $exists: true, $ne: '' }
    }).select('originalName extractedText topics summary filePath fileType');

    if (!pdfs || pdfs.length === 0) {
      return res.status(404).json({ message: 'No processed materials found.' });
    }

    const pdfFiles = [];
    let combinedText = '';
    const allTopics = [];

    for (const pdf of pdfs) {
      if (pdf.extractedText === '[PDF_DIRECT]' && pdf.filePath) {
        pdfFiles.push(pdf.filePath);
      } else if (pdf.extractedText) {
        combinedText += '\n\n---\nSOURCE: ' + pdf.originalName + '\n' + pdf.extractedText;
      }
      if (pdf.topics) {
        for (const t of pdf.topics) {
          const name = t.name || t;
          if (!allTopics.includes(name)) allTopics.push(name);
        }
      }
    }

    const topicsToUse = (selectedTopics && selectedTopics.length > 0)
      ? selectedTopics
      : (session.topic ? session.topic.split(', ') : allTopics);

    const topicString = Array.isArray(topicsToUse) ? topicsToUse.join(', ') : topicsToUse;

    // Pass seen questions to prevent repetition
    const seenQuestions = session.seenQuestions || [];

    const questions = await generateQuizQuestions({
      topic: topicString,
      difficulty: session.difficulty,
      count: session.totalQuestions,
      userLevel: user.schoolType,
      pdfContent: combinedText || undefined,
      pdfFilePath: pdfFiles.length > 0 ? pdfFiles[0] : undefined,
      selectedTopics: topicsToUse,
      seenQuestions: seenQuestions.map(sq => sq.questionText),
    });

    // Update session with newly seen questions
    const newSeen = questions.map(q => ({ questionText: q.question, topic: q.topic }));
    session.seenQuestions = [...session.seenQuestions, ...newSeen];
    await session.save();

    res.json({ questions });
  } catch (error) {
    console.error('Generate new set error:', error);
    const status = error.message?.includes('rate limit') ? 429 : 500;
    res.status(status).json({ message: error.message || 'Error generating new questions' });
  }
};

// ─── Submit an answer ───
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, selectedAnswer, question, options, correctAnswer, topic } = req.body;

    const isCorrect = selectedAnswer === correctAnswer;

    let explanation = '';
    try {
      explanation = await generateExplanation(question, options, correctAnswer);
    } catch (e) {
      explanation = `The correct answer is ${options[correctAnswer] || 'the marked option'}.`;
    }

    const session = await QuizSession.findById(sessionId);
    if (session) {
      session.answers.push({
        questionId,
        question,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        explanation,
        topic,
      });

      if (isCorrect) {
        session.correctCount += 1;
      } else {
        session.wrongCount += 1;
        if (!session.weakAreas.includes(topic)) {
          session.weakAreas.push(topic);
        }
      }

      await session.save();
    }

    res.json({
      isCorrect,
      explanation,
      correctAnswer,
      weakAreas: session?.weakAreas || [],
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Error submitting answer' });
  }
};

// ─── Complete a session ───
exports.completeSession = async (req, res) => {
  try {
    const { sessionId, duration } = req.body;

    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.status = 'completed';
    session.duration = duration || 0;
    session.score = session.totalQuestions > 0
      ? Math.round((session.correctCount / session.totalQuestions) * 100)
      : 0;

    try {
      const feedback = await generateSessionFeedback(session);
      session.aiFeedback = feedback;
    } catch (e) {
      session.aiFeedback = session.score >= 80
        ? 'Excellent work! You are showing strong mastery of these concepts.'
        : session.score >= 60
        ? 'Good effort! Focus on your weak areas and keep practicing.'
        : 'Keep pushing! Review the material and try again.';
    }

    await session.save();

    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        totalQuizzes: 1,
        totalStudyHours: Math.round((duration || 0) / 3600 * 10) / 10,
      },
    });

    res.json({
      session: {
        id: session._id,
        score: session.score,
        correctCount: session.correctCount,
        wrongCount: session.wrongCount,
        weakAreas: session.weakAreas,
        aiFeedback: session.aiFeedback,
        duration: session.duration,
      },
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Error completing session' });
  }
};

// ─── Get session history ───
exports.getSessionHistory = async (req, res) => {
  try {
    const sessions = await QuizSession.find({ user: req.userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('_id title type score correctCount wrongCount totalQuestions duration createdAt');

    res.json({ sessions });
  } catch (error) {
    console.error('Get session history error:', error);
    res.status(500).json({ message: 'Error fetching session history' });
  }
};

async function generateSessionFeedback(session) {
  const { generateSessionFeedback: geminiFeedback } = require('../utils/geminiService');
  return await geminiFeedback(session);
}
