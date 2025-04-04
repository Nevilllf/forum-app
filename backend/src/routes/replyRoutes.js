const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');

// GET replies for a message
router.get('/:messageId', replyController.getReplies);

// POST a reply to a message
router.post('/:messageId', replyController.createReply);

module.exports = router;
