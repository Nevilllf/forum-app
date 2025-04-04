const db = require('../db');

async function createUser(name, password) {
  const [result] = await db.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, password]);
  return result;
}

async function findUserByName(name) {
  const [rows] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
  return rows[0];
}

module.exports = { createUser, findUserByName };
