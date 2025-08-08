// middleware/communityProblemUploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Storage engine for community problems
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/CommunityProblems/'); // New directory for clarity
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv|mkv/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype.toLowerCase());

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

const communityProblemUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB per file
});

module.exports = communityProblemUpload;
