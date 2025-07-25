const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

router.get('/dashboard', protect, (req, res) => {
  res.sendFile('dashboard.html', { root: 'public' });
});

router.get('/api/user-profile', protect, (req, res) => {
  res.json({
    name: req.user.firstName + ' ' + req.user.lastName,
    email: req.user.email
  });
});

module.exports = router;
