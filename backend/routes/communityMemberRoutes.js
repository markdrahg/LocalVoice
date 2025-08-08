const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const {
  registerCommunityMember,
  loginCommunityMember,
  getMe,
  uploadProfilePicture,
  postCommunityProblem,
} = require('../controllers/communityMemberController');
const authCommunityMember = require('../middleware/authMiddleware');
const communityProblemUpload = require('../middleware/communityProblemUploadMiddleware');

const router = express.Router();

router.post('/register', registerCommunityMember);
router.post('/login', loginCommunityMember);
router.get('/me', authCommunityMember, getMe);

// Route to upload profile picture
router.post(
  '/upload-profile-pic',
  authCommunityMember,
  upload.single('profilePic'),
  uploadProfilePicture
);

router.post(
  '/community-problems',
  authCommunityMember,
  communityProblemUpload.array('files', 5), // up to 5 files
  postCommunityProblem
);

module.exports = router;
