const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const { validateStudentRegistration, validateLogin, handleValidationErrors } = require('../middleware/validators');
const { protect, restrictTo } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/students/register
// @desc    Register a new student
// @access  Public
router.post('/register', validateStudentRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, studentId, email, phone, password, gradeLevel } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create student
    const student = await Student.create({
      firstName,
      lastName,
      studentId,
      email,
      phone,
      password,
      gradeLevel
    });

    // Generate token
    const token = generateToken(student._id, 'student');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        gradeLevel: student.gradeLevel
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/students/login
// @desc    Login student
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student and include password
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(student._id, 'student');

    res.json({
      success: true,
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        gradeLevel: student.gradeLevel,
        subscriptionStatus: student.subscriptionStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/students/profile
// @desc    Get student profile
// @access  Private (Student)
router.get('/profile', protect, restrictTo('student'), async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).populate('enrolledCourses');
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/students/profile
// @desc    Update student profile
// @access  Private (Student)
router.put('/profile', protect, restrictTo('student'), async (req, res) => {
  try {
    const { firstName, lastName, phone, gradeLevel } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, gradeLevel },
      { new: true, runValidators: true }
    );

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/students/enroll/:courseId
// @desc    Enroll in a course
// @access  Private (Student)
router.post('/enroll/:courseId', protect, restrictTo('student'), async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (student.enrolledCourses.includes(req.params.courseId)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    student.enrolledCourses.push(req.params.courseId);
    await student.save();

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
