const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadFile, getPDFs, deletePDF } = require('../controllers/uploadController');

router.post('/', auth, upload.single('file'), uploadFile);
router.get('/', auth, getPDFs);
router.delete('/:id', auth, deletePDF);

module.exports = router;
