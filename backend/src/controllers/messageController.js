const messageModel = require('../models/messageModel');
const jwt = require('jsonwebtoken');

exports.getMessages = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const messages = await messageModel.getMessagesByChannel(channelId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.createMessage = async (req, res, next) => {
    try {
      const { channelId } = req.params;
      const { content, title } = req.body;
      const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : null;

      console.log('req.body keys:', Object.keys(req.body));
      console.log('title:', req.body.title);
      console.log('content:', req.body.content);

  
      console.log('Parsed form fields:', { title, content });
      console.log('File info:', req.file);
  
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const messageId = await messageModel.createMessage(
        channelId,
        decoded.id,
        content,
        title,
        screenshotUrl
      );
  
      res.status(201).json({ message: 'Message posted', messageId });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  
