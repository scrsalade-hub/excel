const fs = require('fs');
const path = require('path');
const UploadedPDF = require('../models/UploadedPDF');
const { analyzePDFFile, analyzePDFContent } = require('../utils/geminiService');

// ─── PPTX Text Extraction ───
async function extractTextFromPPTX(filePath) {
  const PPTX2Json = require('pptx2json');
  const parser = new PPTX2Json();
  const result = await parser.toJson(filePath);

  if (!result) {
    throw new Error('Could not extract text from PPTX. The file may be corrupted or contain no text content.');
  }

  const texts = [];
  for (const [fileName, fileData] of Object.entries(result)) {
    if (fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml')) {
      extractTextsFromNode(fileData, texts);
    }
  }

  const combined = texts.filter(t => t && t.trim()).join('\n\n');
  if (combined.length < 50) {
    throw new Error('PPTX contains very little text. It may be image-based or contain only graphics.');
  }
  return combined.substring(0, 50000);
}

function extractTextsFromNode(node, collector) {
  if (typeof node === 'string' && node.trim()) {
    collector.push(node.trim());
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) extractTextsFromNode(item, collector);
    return;
  }
  if (node && typeof node === 'object') {
    for (const [key, val] of Object.entries(node)) {
      if (key === 'a:t') {
        if (Array.isArray(val)) {
          for (const t of val) {
            if (typeof t === 'string' && t.trim()) collector.push(t.trim());
            else if (t && typeof t === 'object' && t._ && t._.trim()) collector.push(t._.trim());
          }
        } else if (typeof val === 'string' && val.trim()) {
          collector.push(val.trim());
        }
      } else {
        extractTextsFromNode(val, collector);
      }
    }
  }
}

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileType = ext === '.pptx' ? 'pptx' : 'pdf';

    const pdf = await UploadedPDF.create({
      user: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType,
      status: 'processing',
    });

    // Process file asynchronously
    processFile(pdf._id, req.file.path, fileType);

    res.status(201).json({
      message: `${fileType.toUpperCase()} uploaded successfully`,
      pdf: {
        id: pdf._id,
        name: pdf.originalName,
        size: `${(pdf.fileSize / 1024 / 1024).toFixed(1)} MB`,
        status: pdf.status,
        fileType: pdf.fileType,
        topics: pdf.topics.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

exports.getPDFs = async (req, res) => {
  try {
    const pdfs = await UploadedPDF.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .select('_id originalName fileSize status fileType createdAt topics');

    res.json({
      pdfs: pdfs.map(pdf => ({
        id: pdf._id,
        name: pdf.originalName,
        size: `${(pdf.fileSize / 1024 / 1024).toFixed(1)} MB`,
        status: pdf.status,
        fileType: pdf.fileType,
        date: pdf.createdAt,
        topics: pdf.topics.length,
      })),
    });
  } catch (error) {
    console.error('Get PDFs error:', error);
    res.status(500).json({ message: 'Error fetching PDFs' });
  }
};

exports.deletePDF = async (req, res) => {
  try {
    const pdf = await UploadedPDF.findOne({ _id: req.params.id, user: req.userId });
    if (!pdf) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (fs.existsSync(pdf.filePath)) {
      fs.unlinkSync(pdf.filePath);
    }

    await pdf.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
};

async function processFile(docId, filePath, fileType) {
  try {
    let analysis;

    if (fileType === 'pptx') {
      // PPTX: extract text locally, then send text to Gemini for analysis
      const extractedText = await extractTextFromPPTX(filePath);
      analysis = await analyzePDFContent(extractedText);

      await UploadedPDF.findByIdAndUpdate(docId, {
        extractedText: extractedText.substring(0, 50000),
        status: 'processed',
        topics: analysis.topics || [],
        summary: analysis.summary || '',
        questionCount: analysis.questionCount || 0,
      });
    } else {
      // PDF: send the ENTIRE file directly to Gemini — let the AI parse it
      analysis = await analyzePDFFile(filePath);

      // PDFs stay on disk; quiz generation reads the file directly
      // We store a placeholder so the DB knows text was processed
      await UploadedPDF.findByIdAndUpdate(docId, {
        extractedText: '[PDF_DIRECT]', // marker: quiz gen should read file directly
        status: 'processed',
        topics: analysis.topics || [],
        summary: analysis.summary || '',
        questionCount: analysis.questionCount || 0,
      });
    }
  } catch (error) {
    console.error('File processing error:', error);
    await UploadedPDF.findByIdAndUpdate(docId, {
      status: 'failed',
      processingError: error.message || 'Failed to process file',
    });
  }
}
