const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

// Post rating routes
router.post('/post/:postId', authMiddleware, ratingController.ratePost);
router.get('/post/:postId/vote', authMiddleware, ratingController.getUserPostVote);

// Reply rating routes
router.post('/replies/:replyId/rate', authMiddleware, ratingController.rateReply);
router.get('/replies/:replyId/vote', authMiddleware, ratingController.getUserReplyVote);

module.exports = router;
