// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
// const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/requireAdmin')
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// Remove user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try{
  await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'User deleted' });
  }catch (err) {
    console.error('Failed to delete user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Remove channel
router.delete('/channels/:id', authenticateToken, requireAdmin, async (req, res) => {
    try{
  await db.query('DELETE FROM channels WHERE id = ?', [req.params.id]);
  res.json({ message: 'Channel deleted' });
}catch (err) {
    console.error('Failed to delete user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Remove message
router.delete('/messages/:id', authenticateToken, requireAdmin, async (req, res) => {
    try{
  await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
  res.json({ message: 'Message deleted' });
}catch (err) {
    console.error('Failed to delete user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Remove reply
router.delete('/replies/:id', authenticateToken, requireAdmin, async (req, res) => {
    try{
  await db.query('DELETE FROM replies WHERE id = ?', [req.params.id]);
  res.json({ message: 'Reply deleted' });
}catch (err) {
    console.error('Failed to delete user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const [users] = await db.query('SELECT id, name, avatarUrl, bio FROM users WHERE isAdmin = false');
      res.json(users);
    } catch (err) {
      console.error('Failed to get users:', err);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });
  

module.exports = router;
