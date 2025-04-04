const db = require('./db');
// const bcrypt = require('bcrypt');


async function initDatabase() {
  // USERS
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      avatarUrl VARCHAR(255),
      bio TEXT,
      isAdmin BOOLEAN DEFAULT FALSE
    );
  `);

  // CHANNELS
  await db.query(`
    CREATE TABLE IF NOT EXISTS channels (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      createdBy INT NOT NULL,
      description TEXT,
      views INT DEFAULT 0
    );
  `);

  // MESSAGES (Posts)
  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      channelId INT NOT NULL,
      userId INT NOT NULL,
      title VARCHAR(255),
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      screenshotUrl VARCHAR(255),
      likes INT DEFAULT 0,
      dislikes INT DEFAULT 0,
      views INT DEFAULT 0
    );
  `);

  // REPLIES
  await db.query(`
    CREATE TABLE IF NOT EXISTS replies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      messageId INT NOT NULL,
      parentReplyId INT NULL,
      userId INT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      screenshotUrl VARCHAR(255),
      likes INT DEFAULT 0,
      dislikes INT DEFAULT 0
    );
  `);

  // RATINGS
  await db.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      postId INT NULL,
      replyId INT NULL,
      userId INT NOT NULL,
      rating ENUM('up', 'down') NOT NULL,
      CHECK (
        (postId IS NOT NULL AND replyId IS NULL) OR
        (postId IS NULL AND replyId IS NOT NULL)
      )
    );
  `);

  console.log("* Database tables initialized");

  // create admin account
  // try {
  //   const hashed = await bcrypt.hash('Admin@8988', 10);
  //   await db.query(`
  //     INSERT INTO users (name, password, isAdmin)
  //     VALUES ('admin', ?, true)
  //     ON DUPLICATE KEY UPDATE isAdmin = true;
  //   `, [hashed]);
  
  //   console.log("✔ Default admin user ensured");
  // } catch (err) {
  //   console.error("❌ Failed to create admin user:", err.message);
  // }

}

module.exports = initDatabase;
