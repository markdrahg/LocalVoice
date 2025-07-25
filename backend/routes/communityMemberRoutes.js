const express = require('express');
const {
  registerCommunityMember,
  loginCommunityMember,
  getMe,
} = require('../controllers/communityMemberController');
const authCommunityMember = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerCommunityMember);
router.post('/login', loginCommunityMember);
router.get('/me', authCommunityMember, getMe);


module.exports = router;
