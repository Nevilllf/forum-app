const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const channelRoutes = require('./src/routes/channelRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const replyRoutes = require('./src/routes/replyRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const ratingRoutes = require('./src/routes/ratingRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const errorHandler = require('./src/middleware/errorHandler');
const initDatabase = require('./src/dbInit');

const app = express();

// Allow frontend to talk to backend
app.use(cors({ origin: '*', credentials: true }));

// Only apply JSON parsing when not using multipart/form-data
app.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    next(); // skip body parsers — multer will handle
  } else {
    express.urlencoded({ extended: true })(req, res, () => {
      express.json()(req, res, next);
    });
  }
});

// Static route for uploaded files
app.use('/uploads', express.static('uploads'));

// Initialize DB
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


// Health check
app.get('/health', (req, res) => res.send('Server healthy'));

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}, and frontend running on port 3000 `));


//docker builder prune -a -f
//docker compose down
//docker compose up --build