const { v2: cloudinary } = require('cloudinary');

// Support both CLOUDINARY_API_SECRET (standard) and CLOUDINARY_SECRET_KEY (common alias)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

module.exports = cloudinary;
