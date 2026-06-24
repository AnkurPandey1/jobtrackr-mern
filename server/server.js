require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import routes
const authRouter = require('./routes/authRoutes');
const jobRouter = require('./routes/jobRoutes');
const statsRouter = require('./routes/statsRoutes');

const app = express();

// Middlewares
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS setup
const origin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: origin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Route
app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'API health check passed. JobTrackr Server is running.' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/stats', statsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';
  res.status(status).json({ msg: message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
