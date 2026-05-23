require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
    gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'configured' : 'missing',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

// Start
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB not connected. Starting server anyway...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`));
  });
