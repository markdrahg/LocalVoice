const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const {
  createCommunityMember,
  findCommunityMemberByEmail
} = require('../models/communityMemberModel');

const registerCommunityMember = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log('Registering community member:', { firstName, lastName, email });
  try {
    const existingUser = await findCommunityMemberByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await createCommunityMember(firstName, lastName, email, hashedPassword);

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const loginCommunityMember = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findCommunityMemberByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMe = async (req, res) => {
  const userId = req.user;
  console.log('Incoming GET /me request for user ID:', userId);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const [results] = await db.query(
      'SELECT id, first_name, last_name, email FROM community_members WHERE id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', results[0]);
    res.json(results[0]);
  } catch (err) {
    console.error('❌ DB Query Error:', err.message);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};


module.exports = {
  registerCommunityMember,
  loginCommunityMember,
  getMe,
};
