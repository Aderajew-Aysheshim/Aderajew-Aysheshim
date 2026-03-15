const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { testConnection } = require('./config/mysqlDatabase');

dotenv.config();

const app = express();
const cookieParser = require('cookie-parser');
const maintenanceMiddleware = require('./middleware/maintenanceMiddleware');

app.use(cookieParser());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://astraetx.com',
    'https://www.astraetx.com',
    /\.astraetx\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(maintenanceMiddleware);

app.use('/api/admin', require('./routes/adminRoutesSQL'));
app.use('/api/resources', require('./routes/resourceRoutesEnhanced'));
app.use('/api/payment-verification', require('./routes/paymentVerificationRoutesSQL'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/students', require('./routes/studentRoutesSQL'));
app.use('/api/tutors', require('./routes/tutorRoutesSQL'));
app.use('/api/courses', require('./routes/courseRoutesSQL'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/tutoring-sessions', require('./routes/tutoringSessionRoutes'));

app.use('/uploads', express.static('uploads'));
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TutorHub API is running' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const isDbConnected = await testConnection();

  if (isDbConnected) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } else {
    console.error('Failed to connect to the database. Server not started.');
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);

  setTimeout(() => process.exit(1), 1000);
});

module.exports = app;
