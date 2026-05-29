const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  schoolType: {
    type: String,
    enum: ['High School', 'College', 'University', ''],
    default: '',
  },
  classYear: {
    type: String,
    default: '',
  },
  course: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  studyStreak: {
    type: Number,
    default: 0,
  },
  totalStudyHours: {
    type: Number,
    default: 0,
  },
  totalQuizzes: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  lastStudyDate: {
    type: Date,
    default: null,
  },
  examReadiness: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: {
    type: String,
    default: '',
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
