const jwt = require('jsonwebtoken');

const authCommunityMember = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Make sure JWT_SECRET is defined
    req.user = decoded.userId; // or decoded.userId depending on your jwt.sign()
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authCommunityMember;
