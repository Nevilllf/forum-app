const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../db');


// router.patch('/profile', updateProfile);
router.patch('/profile', authenticateToken, updateProfile);

router.get('/me', authenticateToken, getProfile);

router.get('/explore', async (req, res) => {
    try {
      const [users] = await db.query(`
        SELECT 
          u.id, u.name, u.bio, u.avatarUrl,
          COALESCE(p.postCount, 0) AS postCount,
          COALESCE(r.replyCount, 0) AS replyCount,
          COALESCE(l.totalLikes, 0) AS totalLikes
        FROM users u
        LEFT JOIN (
          SELECT userId, COUNT(*) AS postCount
          FROM messages
          GROUP BY userId
        ) p ON u.id = p.userId
        LEFT JOIN (
          SELECT userId, COUNT(*) AS replyCount
          FROM replies
          GROUP BY userId
        ) r ON u.id = r.userId
        LEFT JOIN (
          SELECT m.userId, SUM(m.likes) + IFNULL(SUM(r.likes), 0) AS totalLikes
          FROM messages m
          LEFT JOIN replies r ON m.userId = r.userId
          GROUP BY m.userId
        ) l ON u.id = l.userId
        WHERE u.isAdmin = false
      `);
  
      res.json(users);
    } catch (err) {
      console.error('Failed to fetch user explorer data:', err);
      res.status(500).json({ message: 'Error retrieving users' });
    }
  });

  
module.exports = router;
