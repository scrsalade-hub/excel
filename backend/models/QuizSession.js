const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  selectedAnswer: Number,
  correctAnswer: Number,
  isCorrect: Boolean,
  explanation: String,
  topic: String,
});

const quizSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['practice', 'exam_simulation'],
    default: 'practice',
  },
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: 'all',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answers: [answerSchema],
  score: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  wrongCount: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress',
  },
  weakAreas: [String],
  aiFeedback: {
    type: String,
    default: '',
  },
  // Track previously asked questions to prevent repetition
  seenQuestions: [{
    questionText: String,
    topic: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('QuizSession', quizSessionSchema);
