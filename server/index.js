const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

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
      process.exit(1);
    }
    await mongoose.connect(connStr);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB database connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/bookings', require('./routes/bookings'));

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Start Server
const PORT = process.env.PORT;
if (!PORT) {
  console.error('CRITICAL ERROR: PORT is not defined in the environment variables.');
  process.exit(1);
}
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
