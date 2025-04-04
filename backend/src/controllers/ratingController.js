const jwt = require('jsonwebtoken');
const ratingModel = require('../models/ratingModel');

exports.ratePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { rating } = req.body;
    await ratingModel.ratePost(req.user.id, postId, rating);
    res.status(200).json({ message: 'Post rated' });
  } catch (err) {
    next(err);
  }
};

exports.rateReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const { rating } = req.body;
    await ratingModel.rateReply(req.user.id, replyId, rating);
    res.status(200).json({ message: 'Reply rated' });
  } catch (err) {
    next(err);
  }
};

exports.getUserPostVote = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const vote = await ratingModel.getUserPostVote(req.user.id, postId);
    res.json({ vote });
  } catch (err) {
    next(err);
  }
};

exports.getUserReplyVote = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const vote = await ratingModel.getUserReplyVote(req.user.id, replyId);
    res.json({ vote });
  } catch (err) {
    next(err);
  }
};
