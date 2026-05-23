const User = require('../models/User');
const QuizSession = require('../models/QuizSession');
const PDFCloud = require('../models/PDFCloud');
const PerformanceAnalytics = require('../models/PerformanceAnalytics');

exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const recentSessions = await QuizSession.find({ 
      user: req.userId,
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type score createdAt status');

    const pdfs = await PDFCloud.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalName fileSize status createdAt topics');

    res.json({
      stats: {
        studyStreak: user.studyStreak,
        totalHours: user.totalStudyHours,
        quizzesTaken: user.totalQuizzes,
        avgScore: user.averageScore,
      },
      readiness: user.examReadiness || Math.min(95, Math.round(50 + user.totalQuizzes * 1.5)),
      recentSessions: recentSessions.map(s => ({
        id: s._id,
        title: s.title,
        type: s.type === 'exam_simulation' ? 'Exam' : 'Quiz',
        score: s.score,
        date: s.createdAt,
        status: 'completed',
      })),
      pdfs: pdfs.map(p => ({
        id: p._id,
        name: p.originalName,
        size: `${(p.fileSize / 1024 / 1024).toFixed(1)} MB`,
        status: p.status,
        date: p.createdAt,
        topics: p.topics.length,
      })),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const sessions = await QuizSession.find({ 
      user: req.userId, 
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .limit(30);

    const analytics = await PerformanceAnalytics.findOne({ user: req.userId });

    // Calculate weekly data
    const weeklyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daySessions = sessions.filter(s => {
        const sDate = new Date(s.createdAt);
        return sDate.toDateString() === date.toDateString();
      });
      const totalScore = daySessions.reduce((sum, s) => sum + (s.score || 0), 0);
      weeklyData.push({
        day: days[date.getDay()],
        hours: Math.round(daySessions.length * 0.5 * 10) / 10,
        score: daySessions.length > 0 ? Math.round(totalScore / daySessions.length) : 0,
      });
    }

    // Calculate topic performance
    const topicMap = {};
    sessions.forEach(s => {
      s.answers.forEach(a => {
        if (!topicMap[a.topic]) {
          topicMap[a.topic] = { total: 0, correct: 0 };
        }
        topicMap[a.topic].total += 1;
        if (a.isCorrect) topicMap[a.topic].correct += 1;
      });
    });
    const topicData = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

    res.json({
      weeklyData,
      topicData,
      skillBreakdown: analytics?.skillBreakdown || {
        recall: 75,
        understanding: 68,
        application: 62,
        analysis: 70,
        evaluation: 55,
        synthesis: 60,
      },
      weakAreas: analytics?.weakAreas || ['Biochemistry', 'Evolution'],
      strongAreas: analytics?.strongAreas || ['Ecology', 'Cell Biology'],
      overallReadiness: analytics?.overallReadiness || 72,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

exports.getWeakAreas = async (req, res) => {
  try {
    const sessions = await QuizSession.find({
      user: req.userId,
      status: 'completed',
    }).sort({ createdAt: -1 });

    const wrongAnswers = [];
    sessions.forEach(s => {
      s.answers.filter(a => !a.isCorrect).forEach(a => {
        wrongAnswers.push({
          question: a.question,
          yourAnswer: a.selectedAnswer,
          correctAnswer: a.correctAnswer,
          explanation: a.explanation,
          topic: a.topic,
          attempts: 1,
          lastAttempted: s.createdAt,
        });
      });
    });

    res.json({ weakAreas: wrongAnswers });
  } catch (error) {
    console.error('Weak areas error:', error);
    res.status(500).json({ message: 'Error fetching weak areas' });
  }
};
