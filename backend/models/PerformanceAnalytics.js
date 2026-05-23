const mongoose = require('mongoose');

const dailyStatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  hoursStudied: {
    type: Number,
    default: 0,
  },
  questionsAnswered: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  sessionsCompleted: {
    type: Number,
    default: 0,
  },
});

const topicMasterySchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  lastPracticed: {
    type: Date,
    default: Date.now,
  },
});

const performanceAnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  dailyStats: [dailyStatSchema],
  topicMastery: [topicMasterySchema],
  skillBreakdown: {
    recall: { type: Number, default: 0 },
    understanding: { type: Number, default: 0 },
    application: { type: Number, default: 0 },
    analysis: { type: Number, default: 0 },
    evaluation: { type: Number, default: 0 },
    synthesis: { type: Number, default: 0 },
  },
  weakAreas: [String],
  strongAreas: [String],
  overallReadiness: {
    type: Number,
    default: 0,
  },
  streakHistory: [{
    date: Date,
    active: Boolean,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('PerformanceAnalytics', performanceAnalyticsSchema);
