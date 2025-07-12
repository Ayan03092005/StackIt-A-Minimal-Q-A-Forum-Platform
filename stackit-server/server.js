const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const questionRoutes = require('./routes/question');
app.use('/api/questions', questionRoutes);

const answerRoutes = require('./routes/answer');
app.use('/api/answers', answerRoutes);

const notificationRoutes = require('./routes/notification');
app.use('/api/notifications', notificationRoutes);




// Test Route
app.get('/', (req, res) => {
  res.send('✅ StackIt Backend is running!');
});

// Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
