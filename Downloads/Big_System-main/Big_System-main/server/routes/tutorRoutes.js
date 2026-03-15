const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor');
const jwt = require('jsonwebtoken');
const { validateTutorRegistration, validateLogin, handleValidationErrors } = require('../middleware/validators');
const { protect, restrictTo, verifiedTutor } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/tutors/register
// @desc    Register a new tutor
// @access  Public
router.post('/register', validateTutorRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, qualifications, subjects, availability } = req.body;

    // Check if tutor already exists
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create tutor
    const tutor = await Tutor.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      qualifications,
      subjects,
      availability
    });

    // Generate token
    const token = generateToken(tutor._id, 'tutor');

    res.status(201).json({
      success: true,
      message: 'Tutor registered successfully. Awaiting admin verification.',
      token,
      tutor: {
        id: tutor._id,
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        email: tutor.email,
        isVerified: tutor.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/tutors/login
// @desc    Login tutor
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find tutor and include password
    const tutor = await Tutor.findOne({ email }).select('+password');
    if (!tutor) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await tutor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(tutor._id, 'tutor');

    res.json({
      success: true,
      token,
      tutor: {
        id: tutor._id,
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        email: tutor.email,
        isVerified: tutor.isVerified,
        rating: tutor.rating,
        subscriptionStatus: tutor.subscriptionStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutors/profile
// @desc    Get tutor profile
// @access  Private (Tutor)
router.get('/profile', protect, restrictTo('tutor'), async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.user._id).populate('courses');
    res.json({ success: true, tutor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/tutors/profile
// @desc    Update tutor profile
// @access  Private (Tutor)
router.put('/profile', protect, restrictTo('tutor'), async (req, res) => {
  try {
    const { firstName, lastName, phone, qualifications, subjects, availability } = req.body;

    const tutor = await Tutor.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, qualifications, subjects, availability },
      { new: true, runValidators: true }
    );

    res.json({ success: true, tutor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutors
// @desc    Get all verified tutors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tutors = await Tutor.find({ isVerified: true })
      .select('-password')
      .sort('-rating');

    res.json({ success: true, count: tutors.length, tutors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutors/:id
// @desc    Get single tutor
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)
      .select('-password')
      .populate('courses');

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.json({ success: true, tutor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
