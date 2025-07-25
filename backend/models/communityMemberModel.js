const db = require('../config/db');

const createCommunityMember = async (firstName, lastName, email, hashedPassword) => {
  const [result] = await db.execute(
    'INSERT INTO community_members (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, hashedPassword]
  );
  return result;
};

const findCommunityMemberByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM community_members WHERE email = ?',
    [email]
  );
  return rows[0];
};

module.exports = {
  createCommunityMember,
  findCommunityMemberByEmail,
};
