const cloudinary = require('../config/cloudinary');
const PDFCloud = require('../models/PDFCloud');
const { analyzePDFFile, analyzePDFContent } = require('../utils/geminiService');

// ─── Upload PDF to Cloudinary ───
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const file = req.file;
    const ext = file.originalname.toLowerCase().endsWith('.pptx') ? 'pptx' : 'pdf';

    // Upload buffer directly to Cloudinary — no local disk
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'excel/pdfs',
          public_id: `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // Save metadata to MongoDB
    const pdfDoc = await PDFCloud.create({
      user: req.userId,
      originalName: file.originalname,
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: ext,
      fileSize: file.size,
      status: 'processing',
    });

    // Process with AI in background (non-blocking)
    processPDFWithAI(pdfDoc._id, file.buffer, ext, file.originalname);

    res.status(201).json({
      success: true,
      message: 'File uploaded and AI analysis started',
      pdf: {
        id: pdfDoc._id,
        name: pdfDoc.originalName,
        size: `${(pdfDoc.fileSize / 1024 / 1024).toFixed(1)} MB`,
        type: pdfDoc.fileType,
        url: pdfDoc.cloudinaryUrl,
        status: pdfDoc.status,
        createdAt: pdfDoc.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

// ─── Get all PDFs for user ───
exports.getPDFs = async (req, res) => {
  try {
    const pdfs = await PDFCloud.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .select('_id originalName cloudinaryUrl publicId fileType fileSize status createdAt topics summary questionCount');

    res.json({
      success: true,
      count: pdfs.length,
      pdfs: pdfs.map(p => ({
        id: p._id,
        name: p.originalName,
        size: `${(p.fileSize / 1024 / 1024).toFixed(1)} MB`,
        type: p.fileType,
        url: p.cloudinaryUrl,
        status: p.status,
        createdAt: p.createdAt,
        topics: (p.topics || []).map(t => t.name),
        summary: p.summary,
        questionCount: p.questionCount,
      })),
    });
  } catch (error) {
    console.error('Get PDFs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch PDFs' });
  }
};

// ─── Delete PDF from Cloudinary + MongoDB ───
exports.deletePDF = async (req, res) => {
  try {
    const pdf = await PDFCloud.findOne({ _id: req.params.id, user: req.userId });
    if (!pdf) {
      return res.status(404).json({ success: false, message: 'PDF not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(pdf.publicId, { resource_type: 'raw' });

    // Delete from MongoDB
    await PDFCloud.deleteOne({ _id: pdf._id });

    res.json({ success: true, message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: error.message || 'Delete failed' });
  }
};

// ─── Get single PDF ───
exports.getPDF = async (req, res) => {
  try {
    const pdf = await PDFCloud.findOne({ _id: req.params.id, user: req.userId })
      .select('-__v');

    if (!pdf) {
      return res.status(404).json({ success: false, message: 'PDF not found' });
    }

    res.json({
      success: true,
      pdf: {
        id: pdf._id,
        name: pdf.originalName,
        url: pdf.cloudinaryUrl,
        type: pdf.fileType,
        size: `${(pdf.fileSize / 1024 / 1024).toFixed(1)} MB`,
        status: pdf.status,
        topics: (pdf.topics || []).map(t => t.name),
        summary: pdf.summary,
        questionCount: pdf.questionCount,
        createdAt: pdf.createdAt,
      },
    });
  } catch (error) {
    console.error('Get PDF error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch PDF' });
  }
};

// ─── Background AI Processing ───
async function processPDFWithAI(docId, fileBuffer, fileType, originalName) {
  try {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    // Write buffer to temp file for AI processing
    const tmpPath = path.join(os.tmpdir(), `excel_${Date.now()}_${originalName}`);
    fs.writeFileSync(tmpPath, fileBuffer);

    let analysis;

    if (fileType === 'pptx') {
      // PPTX: extract text locally
      const PPTX2Json = require('pptx2json');
      const parser = new PPTX2Json();
      const result = await parser.toJson(tmpPath);
      const texts = [];

      function extractTexts(node, collector) {
        if (typeof node === 'string' && node.trim()) { collector.push(node.trim()); return; }
        if (Array.isArray(node)) { for (const item of node) extractTexts(item, collector); return; }
        if (node && typeof node === 'object') {
          for (const [key, val] of Object.entries(node)) {
            if (key === 'a:t') {
              if (Array.isArray(val)) {
                for (const t of val) {
                  if (typeof t === 'string' && t.trim()) collector.push(t.trim());
                  else if (t && typeof t === 'object' && t._ && t._.trim()) collector.push(t._.trim());
                }
              } else if (typeof val === 'string' && val.trim()) { collector.push(val.trim()); }
            } else { extractTexts(val, collector); }
          }
        }
      }

      for (const [fileName, fileData] of Object.entries(result)) {
        if (fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml')) {
          extractTexts(fileData, texts);
        }
      }

      const combined = texts.filter(t => t && t.trim()).join('\n\n');
      analysis = await analyzePDFContent(combined.substring(0, 30000));

      await PDFCloud.findByIdAndUpdate(docId, {
        extractedText: combined.substring(0, 30000),
        status: 'processed',
        topics: analysis.topics || [],
        summary: analysis.summary || '',
        questionCount: analysis.questionCount || 0,
      });
    } else {
      // PDF: send file directly to Gemini
      analysis = await analyzePDFFile(tmpPath);

      await PDFCloud.findByIdAndUpdate(docId, {
        extractedText: '[PDF_DIRECT]',
        status: 'processed',
        topics: analysis.topics || [],
        summary: analysis.summary || '',
        questionCount: analysis.questionCount || 0,
      });
    }

    // Clean up temp file
    try { fs.unlinkSync(tmpPath); } catch {}

  } catch (error) {
    console.error('AI processing error:', error);
    await PDFCloud.findByIdAndUpdate(docId, {
      status: 'failed',
      processingError: error.message || 'AI processing failed',
    });
  }
}
