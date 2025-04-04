const db = require('../db');

async function getAllChannels() {
  const [rows] = await db.query(`
    SELECT c.*, 
      (SELECT COUNT(*) FROM messages m WHERE m.channelId = c.id) AS postCount
    FROM channels c
    ORDER BY c.id DESC
  `);
  return rows;
}

async function createChannel(name,description,createdBy) {
  const [result] = await db.query(
    'INSERT INTO channels (name, description, createdBy) VALUES (?, ?, ?)',
    [name,description, createdBy]
  );
  return result.insertId;
}

async function incrementChannelView(channelId) {
  await db.query(`UPDATE channels SET views = views + 1 WHERE id = ?`, [channelId]);
}

async function getChannelById(id) {
  const [rows] = await db.query('SELECT * FROM channels WHERE id = ?', [id]);
  return rows[0]; // single channel
}

module.exports = {
  getAllChannels,
  createChannel,
  incrementChannelView,
  getChannelById,
};