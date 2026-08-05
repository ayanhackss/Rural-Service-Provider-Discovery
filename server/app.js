const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

const meRoutes = require('./routes/me');

const seedAdmin = require('./config/seedAdmin');

// Connect to database on startup if MONGO_URI exists
if (process.env.MONGO_URI) {
  connectDB().then(() => seedAdmin()).catch((err) => console.warn('Initial DB connect warning:', err.message));
}

const app = express();

// Middleware — ensure DB is connected before every API request (handles serverless cold starts)
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/health') return next();
  if (!process.env.MONGO_URI) {
    return res.status(503).json({ 
      message: 'Database connection string (MONGO_URI) is missing in environment variables. Please configure it in your Vercel Dashboard.' 
    });
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: `Database connection error: ${err.message}` });
  }
});

app.use(cors({
  origin: true, // Allow requesting origin including vercel.app and localhost
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/me', meRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
