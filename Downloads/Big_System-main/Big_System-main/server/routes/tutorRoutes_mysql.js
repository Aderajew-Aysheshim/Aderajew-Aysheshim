const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/mysqlDatabase');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/credentials/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Generate JWT token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// @route   POST /api/tutors/register
// @desc    Register a new tutor
// @access  Public
router.post('/register', upload.fields([
  { name: 'degree_certificate', maxCount: 1 },
  { name: 'teaching_certificate', maxCount: 1 },
  { name: 'id_document', maxCount: 1 }
]), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, qualifications, subjects, specialization, bio, availability, hourlyRate } = req.body;

    // Check if tutor already exists
    const existing = await query('SELECT id FROM tutors WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Get uploaded file paths
    const degreeCert = req.files?.degree_certificate ? req.files.degree_certificate[0].path : null;
    const teachingCert = req.files?.teaching_certificate ? req.files.teaching_certificate[0].path : null;
    const idDoc = req.files?.id_document ? req.files.id_document[0].path : null;

    // Insert tutor
    const result = await query(
      `INSERT INTO tutors (first_name, last_name, email, phone, password_hash, qualifications, subjects, specialization, bio, availability, hourly_rate, degree_certificate, teaching_certificate, id_document, is_verified, activation_fee_paid) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, FALSE)`,
      [firstName, lastName, email, phone, passwordHash, qualifications, subjects, specialization, bio, availability, hourlyRate || 0, degreeCert, teachingCert, idDoc]
    );

    // Generate token
    const token = generateToken(result.insertId, 'tutor');

    res.status(201).json({
      success: true,
      message: 'Tutor registered successfully. Awaiting admin verification.',
      token,
      tutor: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        isVerified: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/tutors/login
// @desc    Login tutor
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find tutor
    const tutors = await query('SELECT * FROM tutors WHERE email = ?', [email]);
    if (tutors.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tutor = tutors[0];

    // Check password
    const isMatch = await bcrypt.compare(password, tutor.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(tutor.id, 'tutor');

    res.json({
      success: true,
      token,
      tutor: {
        id: tutor.id,
        firstName: tutor.first_name,
        lastName: tutor.last_name,
        email: tutor.email,
        isVerified: tutor.is_verified,
        rating: tutor.rating,
        subscriptionStatus: tutor.subscription_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutors
// @desc    Get all verified tutors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tutors = await query(
      'SELECT id, first_name, last_name, email, phone, qualifications, subjects, specialization, bio, availability, hourly_rate, rating, total_reviews, profile_photo FROM tutors WHERE is_verified = TRUE ORDER BY rating DESC'
    );

    res.json({
      success: true,
      count: tutors.length,
      tutors: tutors.map(t => ({
        id: t.id,
        firstName: t.first_name,
        lastName: t.last_name,
        email: t.email,
        phone: t.phone,
        qualifications: t.qualifications,
        subjects: t.specializations,
        specialization: t.specialization,
        bio: t.bio,
        availability: t.availability,
        hourlyRate: t.hourly_rate,
        rating: t.rating,
        totalReviews: t.total_reviews,
        profilePhoto: t.profile_photo
      }))
    });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutors/:id
// @desc    Get single tutor
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tutors = await query('SELECT * FROM tutors WHERE id = ?', [req.params.id]);

    if (tutors.length === 0) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const tutor = tutors[0];
    res.json({
      success: true,
      tutor: {
        id: tutor.id,
        firstName: tutor.first_name,
        lastName: tutor.last_name,
        email: tutor.email,
        phone: tutor.phone,
        qualifications: tutor.qualifications,
        subjects: tutor.specializations,
        specialization: tutor.specialization,
        bio: tutor.bio,
        availability: tutor.availability,
        hourlyRate: tutor.hourly_rate,
        rating: tutor.rating,
        totalReviews: tutor.total_reviews,
        isVerified: tutor.is_verified
      }
    });
  } catch (error) {
    console.error('Get tutor error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
