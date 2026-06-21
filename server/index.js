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
let dbPromise = null;
let lastDbError = null;

const connectDB = () => {
  if (dbPromise) return dbPromise;

  const connStr = process.env.MONGO_URI;
  if (!connStr) {
    const errorMsg = 'MONGO_URI is not defined in the environment variables.';
    console.error(`CRITICAL ERROR: ${errorMsg}`);
    lastDbError = errorMsg;
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    return Promise.reject(new Error(errorMsg));
  }

  dbPromise = mongoose.connect(connStr)
    .then(() => {
      console.log('MongoDB connected successfully');
      lastDbError = null;
    })
    .catch(err => {
      console.error('MongoDB database connection error:', err.message);
      lastDbError = err.message;
      dbPromise = null; // Reset promise so subsequent requests can retry
      if (!process.env.VERCEL) {
        process.exit(1);
      }
      throw err;
    });

  return dbPromise;
};

// Start initial connection attempt
connectDB().catch(() => {});

// Database status check middleware for routes
app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log(`Database status check: connection readyState is ${mongoose.connection.readyState}. Waiting for connection...`);
      await connectDB();
    }
    next();
  } catch (err) {
    return res.status(500).json({
      error: 'Database connection failed',
      message: err.message,
      hint: 'Ensure MONGO_URI is correctly configured in your Vercel Environment Variables. If you are deploying to production, this must be a remote cloud MongoDB Atlas connection, not a local (localhost) database.'
    });
  }
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
    databaseError: lastDbError,
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
