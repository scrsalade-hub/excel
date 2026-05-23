const mongoose = require('mongoose');

const pdfCloudSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  originalName: {
    type: String,
    required: true,
    trim: true,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
    index: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'pptx'],
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'processed', 'failed'],
    default: 'uploading',
  },
  extractedText: {
    type: String,
    default: '',
  },
  topics: [{
    name: { type: String },
    confidence: { type: Number, min: 0, max: 1 },
  }],
  summary: {
    type: String,
    default: '',
  },
  questionCount: {
    type: Number,
    default: 0,
  },
  processingError: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for fast queries by user
pdfCloudSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('PDFCloud', pdfCloudSchema);
