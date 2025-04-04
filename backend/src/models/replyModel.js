const db = require('../db');

async function getRepliesByMessageId(messageId) {
    const [rows] = await db.query(`
      SELECT 
        r.*, 
        u.name AS username,
        DATE_FORMAT(r.timestamp, '%Y-%m-%d %H:%i') AS formattedTimestamp,
        (SELECT COUNT(*) FROM replies cr WHERE cr.parentReplyId = r.id) AS childReplyCount
      FROM replies r
      JOIN users u ON r.userId = u.id
      WHERE r.messageId = ?
      ORDER BY r.timestamp ASC
    `, [messageId]);
  
    return rows;
  }
  
  
  

async function createReply(messageId, userId, content, parentReplyId = null) {
  const [result] = await db.query(
    'INSERT INTO replies (messageId, parentReplyId, userId, content) VALUES (?, ?, ?, ?)',
    [messageId, parentReplyId, userId, content]
  );
  return result.insertId;
}

module.exports = {
  getRepliesByMessageId,
  createReply,
};
