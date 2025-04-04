const channelModel = require('../models/channelModel');
const jwt = require('jsonwebtoken');

exports.getChannels = async (req, res, next) => {
  try {
    const channels = await channelModel.getAllChannels();
    res.json(channels);
  } catch (err) {
    next(err);
  }
};

exports.createChannel = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const authHeader = req.headers.authorization;
    console.log('Headers:', req.headers);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newChannelId = await channelModel.createChannel(name, description, decoded.id);
    res.status(201).json({ message: 'Channel created', channelId: newChannelId });
  } catch (err) {
    next(err);
  }
};

exports.incrementView = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    await channelModel.incrementChannelView(channelId);
    res.status(200).json({ message: 'View incremented' });
  } catch (err) {
    next(err);
  }
};

exports.getChannelById = async (req, res, next) => {
  try {
    const channel = await channelModel.getChannelById(req.params.channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    res.json(channel);
  } catch (err) {
    next(err);
  }
};

