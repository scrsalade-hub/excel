const multer = require('multer');

// Use memory storage — files live in RAM as Buffer, never touch disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  const allowedExts = ['.pdf', '.pptx'];
  const ext = file.originalname.toLowerCase().slice(-5);

  if (allowedTypes.includes(file.mimetype) || allowedExts.some(e => ext.endsWith(e))) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and PPTX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max
    files: 5, // max 5 files per upload
  },
});

module.exports = upload;
