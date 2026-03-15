const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { testConnection } = require('./config/mysqlDatabase');

// Load environment variables
dotenv.config();
// Initialize express app
const app = express();
const maintenanceMiddleware = require('./middleware/maintenanceMiddleware');
// Trigger restart for .env loading

// Connect to MySQL
testConnection();
// Security middleware - Configure helmet to allow images
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
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

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Maintenance Middleware
app.use(maintenanceMiddleware);

// Routes - Using MySQL versions
app.use('/api/admin', require('./routes/adminRoutesSQL'));
app.use('/api/resources', require('./routes/resourceRoutesEnhanced')); // Enhanced resource system
app.use('/api/payment-verification', require('./routes/paymentVerificationRoutesSQL'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/students', require('./routes/studentRoutesSQL'));
app.use('/api/tutors', require('./routes/tutorRoutesSQL'));
app.use('/api/courses', require('./routes/courseRoutesSQL')); // Using existing course system
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/tutoring-sessions', require('./routes/tutoringSessionRoutes')); // Pro tutoring & payment system

// MongoDB routes (will be converted to MySQL later)
// app.use('/api/bookings', require('./routes/bookingRoutes'));
// app.use('/api/reviews', require('./routes/reviewRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/exit-exams', require('./routes/exitExamRoutes'));
// app.use('/api/admin/exit-exams', require('./routes/adminExitExamRoutes'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TutorHub API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
