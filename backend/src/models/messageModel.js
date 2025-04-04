const db = require('../db');

async function getMessagesByChannel(channelId) {
    const [rows] = await db.query(`
      SELECT 
        m.*, 
        u.name AS username,
        DATE_FORMAT(m.timestamp, '%Y-%m-%d %H:%i') AS formattedTimestamp,
        (SELECT COUNT(*) FROM replies r WHERE r.messageId = m.id) AS replyCount
      FROM messages m
      JOIN users u ON m.userId = u.id
      WHERE m.channelId = ?
      ORDER BY m.timestamp DESC
    `, [channelId]);
  
    return rows;
  }
  
  
  

async function createMessage(channelId, userId, content, title, screenshotUrl) {
    const [result] = await db.query(
      'INSERT INTO messages (channelId, userId, content, title, screenshotUrl) VALUES (?, ?, ?, ?, ?)',
      [channelId, userId, content, title || null, screenshotUrl || null]
    );
    return result.insertId;
  }
  

module.exports = { getMessagesByChannel, createMessage };
