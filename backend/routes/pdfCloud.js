const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadCloud');
const pdfController = require('../controllers/pdfController');

// Upload: multer reads into memory buffer, controller uploads to Cloudinary
router.post('/', auth, upload.single('file'), pdfController.uploadPDF);

// List all PDFs for user
router.get('/', auth, pdfController.getPDFs);

// Get single PDF
router.get('/:id', auth, pdfController.getPDF);

// Delete from Cloudinary + MongoDB
router.delete('/:id', auth, pdfController.deletePDF);

module.exports = router;
