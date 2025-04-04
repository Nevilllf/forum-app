const db = require('../db');
const jwt = require('jsonwebtoken');

exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, bio, avatarUrl } = req.body;

    // Build dynamic SET clause
    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (bio) {
      fields.push('bio = ?');
      values.push(bio);
    }
    if (avatarUrl) {
      fields.push('avatarUrl = ?');
      values.push(avatarUrl);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.getProfile = async (req, res) => {
    try {
      const [rows] = await db.query('SELECT name, avatarUrl,isAdmin, bio FROM users WHERE id = ?', [req.user.id]);
      res.json(rows[0]);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      res.status(500).json({ message: 'Failed to get profile' });
    }
  };
  
