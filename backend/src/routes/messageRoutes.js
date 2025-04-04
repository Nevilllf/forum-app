const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// GET all messages for a channel
router.get('/:channelId', messageController.getMessages);

// POST a new message to a channel
router.post('/:channelId', upload.single('screenshot'), messageController.createMessage);

module.exports = router;
