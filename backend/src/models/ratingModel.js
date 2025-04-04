const db = require('../db');

async function ratePost(userId, postId, rating) {
  const [existing] = await db.query(
    'SELECT * FROM ratings WHERE userId = ? AND postId = ?',
    [userId, postId]
  );

  if (existing.length > 0) {
    if (existing[0].rating === rating) return; // already rated
    await db.query(
      'UPDATE ratings SET rating = ? WHERE userId = ? AND postId = ?',
      [rating, userId, postId]
    );
  } else {
    await db.query(
      'INSERT INTO ratings (userId, postId, rating) VALUES (?, ?, ?)',
      [userId, postId, rating]
    );
  }

  // Update post like/dislike count
  const [counts] = await db.query(
    `SELECT 
      SUM(rating = 'up') AS likes, 
      SUM(rating = 'down') AS dislikes 
     FROM ratings WHERE postId = ?`,
    [postId]
  );

  await db.query(
    'UPDATE messages SET likes = ?, dislikes = ? WHERE id = ?',
    [counts[0].likes || 0, counts[0].dislikes || 0, postId]
  );
}

async function getUserPostVote(userId, postId) {
    const [rows] = await db.query(
      'SELECT rating FROM ratings WHERE userId = ? AND postId = ?',
      [userId, postId]
    );
    return rows[0]?.rating || null;
  }
  

async function rateReply(userId, replyId, rating) {
  const [existing] = await db.query(
    'SELECT * FROM ratings WHERE userId = ? AND replyId = ?',
    [userId, replyId]
  );

  if (existing.length > 0) {
    if (existing[0].rating === rating) return;
    await db.query(
      'UPDATE ratings SET rating = ? WHERE userId = ? AND replyId = ?',
      [rating, userId, replyId]
    );
  } else {
    await db.query(
      'INSERT INTO ratings (userId, replyId, rating) VALUES (?, ?, ?)',
      [userId, replyId, rating]
    );
  }

  const [counts] = await db.query(
    `SELECT 
      SUM(rating = 'up') AS likes, 
      SUM(rating = 'down') AS dislikes 
     FROM ratings WHERE replyId = ?`,
    [replyId]
  );

  await db.query(
    'UPDATE replies SET likes = ?, dislikes = ? WHERE id = ?',
    [counts[0].likes || 0, counts[0].dislikes || 0, replyId]
  );
}

async function getUserReplyVote(userId, replyId) {
    const [rows] = await db.query(
      'SELECT rating FROM ratings WHERE userId = ? AND replyId = ?',
      [userId, replyId]
    );
    return rows[0]?.rating || null;
  }
  

module.exports = { ratePost, rateReply , getUserPostVote, getUserReplyVote};
