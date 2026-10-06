require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./database/connection');
const campusRoutes = require('./routes/campusRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'RGUKT SIS Backend is operational',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/system-setup/campuses', campusRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] RGUKT SIS Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
