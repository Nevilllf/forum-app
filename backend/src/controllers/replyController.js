const replyModel = require('../models/replyModel');
const jwt = require('jsonwebtoken');

exports.getReplies = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const replies = await replyModel.getRepliesByMessageId(messageId);
    res.json(replies);
  } catch (err) {
    next(err);
  }
};

exports.createReply = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content, parentReplyId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const replyId = await replyModel.createReply(messageId, decoded.id, content, parentReplyId);
    res.status(201).json({ message: 'Reply posted', replyId });
  } catch (err) {
    next(err);
  }
};
