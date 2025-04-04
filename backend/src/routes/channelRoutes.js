const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

// GET all channels
router.get('/', channelController.getChannels);

// POST a new channel
router.post('/', channelController.createChannel);

router.post('/:channelId/view', channelController.incrementView);

router.get('/:channelId', channelController.getChannelById);


module.exports = router;
