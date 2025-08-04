const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const {
  registerCommunityMember,
  loginCommunityMember,
  getMe,
  uploadProfilePicture,
} = require('../controllers/communityMemberController');
const authCommunityMember = require('../middleware/authMiddleware');

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


module.exports = router;
