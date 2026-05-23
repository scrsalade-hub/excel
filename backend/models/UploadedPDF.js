const mongoose = require('mongoose');

const uploadedPDFSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'pptx'],
    default: 'pdf',
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'processed', 'failed', 'image_pdf'],
    default: 'uploaded',
  },
  processingError: {
    type: String,
    default: '',
  },
  extractedText: {
    type: String,
    default: '',
  },
  topics: [{
    name: String,
    confidence: Number,
  }],
  summary: {
    type: String,
    default: '',
  },
  questionCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UploadedPDF', uploadedPDFSchema);
