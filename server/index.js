const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
const fs = require('fs');
const path = require('path');
const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr) {
      console.error('CRITICAL ERROR: MONGO_URI is not defined in the environment variables.');
      if (!process.env.VERCEL) {
        process.exit(1);
      }
      return;
    }
    await mongoose.connect(connStr);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB database connection error:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

connectDB();

// Database status check middleware for routes
app.use((req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({
      error: 'Database connection is not established.',
      message: 'Ensure MONGO_URI is correctly configured in your Vercel Environment Variables. If you are deploying to production, this must be a remote cloud MongoDB Atlas connection, not a local (localhost) database.'
    });
  }
  next();
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/bookings', require('./routes/bookings'));

// Test Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'healthy', 
    database: dbStatus,
    timestamp: new Date() 
  });
});

// Start Server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
  });
}

module.exports = app;
