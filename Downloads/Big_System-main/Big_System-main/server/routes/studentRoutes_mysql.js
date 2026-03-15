const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/mysqlDatabase');

// Generate JWT token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// @route   POST /api/students/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, studentId, email, phone, password, gradeLevel } = req.body;

    // Check if student already exists
    const existing = await query('SELECT id FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert student
    const result = await query(
      `INSERT INTO students (first_name, last_name, student_id, email, phone, password_hash, grade_level, subscription_status, registration_fee_paid) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'free', FALSE)`,
      [firstName, lastName, studentId, email, phone, passwordHash, gradeLevel]
    );

    // Generate token
    const token = generateToken(result.insertId, 'student');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      student: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        gradeLevel
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/students/login
// @desc    Login student
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student
    const students = await query('SELECT * FROM students WHERE email = ?', [email]);
    if (students.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const student = students[0];

    // Check password
    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(student.id, 'student');

    res.json({
      success: true,
      token,
      student: {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        gradeLevel: student.grade_level,
        subscriptionStatus: student.subscription_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/students/profile
// @desc    Get student profile
// @access  Private (Student)
router.get('/profile/:id', async (req, res) => {
  try {
    const students = await query('SELECT * FROM students WHERE id = ?', [req.params.id]);

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = students[0];
    res.json({
      success: true,
      student: {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        phone: student.phone,
        gradeLevel: student.grade_level,
        subscriptionStatus: student.subscription_status,
        isPremium: student.is_premium
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/students/profile/:id
// @desc    Update student profile
// @access  Private (Student)
router.put('/profile/:id', async (req, res) => {
  try {
    const { firstName, lastName, phone, gradeLevel } = req.body;

    await query(
      'UPDATE students SET first_name = ?, last_name = ?, phone = ?, grade_level = ? WHERE id = ?',
      [firstName, lastName, phone, gradeLevel, req.params.id]
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
