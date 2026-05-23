const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pdfSource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadedPDF',
    default: null,
  },
  question: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'scenario', 'application'],
    default: 'multiple_choice',
  },
  options: [{
    text: String,
    isCorrect: Boolean,
  }],
  correctAnswer: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  tags: [String],
  timesAttempted: {
    type: Number,
    default: 0,
  },
  timesCorrect: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
