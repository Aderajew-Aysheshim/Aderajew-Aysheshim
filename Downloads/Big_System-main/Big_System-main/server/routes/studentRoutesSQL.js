const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/mysqlDatabase');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPG, PNG, GIF, WEBP) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter
});

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [student] = await query(
      'SELECT id, full_name, email, phone, profile_photo, is_premium, registration_fee_paid, is_active FROM students WHERE id = ?',
      [decoded.id]
    );

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    req.user = { ...student, userType: 'student' };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);

    const { firstName, lastName, email, phone, password, gradeLevel, studentId } = req.body;

    if (!firstName || !lastName || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        error: 'Please provide all required fields',
        missing: {
          firstName: !firstName,
          lastName: !lastName,
          email: !email,
          password: !password
        }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    console.log('Checking if student exists:', email);
    const existingStudents = await query(
      'SELECT id FROM students WHERE email = ?',
      [email]
    );

    if (existingStudents && existingStudents.length > 0) {
      console.log('Student already exists:', email);
      return res.status(400).json({ error: 'Student with this email already exists' });
    }

    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);

    console.log('Inserting student into database...');
    const fullName = `${firstName} ${lastName}`;
    const sql = `
      INSERT INTO students (full_name, email, phone, password_hash, is_premium, registration_fee_paid, is_active)
      VALUES (?, ?, ?, ?, FALSE, FALSE, FALSE)
    `;

    const result = await query(sql, [
      fullName,
      email,
      phone || null,
      passwordHash
    ]);

    console.log('Student registered successfully, ID:', result.insertId);

    const token = generateToken(result.insertId, 'student');

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      student: {
        id: result.insertId,
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        isPremium: false,
        registrationFeePaid: false
      }
    });
  } catch (error) {
    console.error('Student registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const [student] = await query(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );

    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!student.is_active) {
      return res.status(401).json({ error: 'Your account is pending admin approval. Please wait for verification.' });
    }

    const isMatch = await bcrypt.compare(password, student.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(student.id, 'student');

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      token,
      student: {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        phone: student.phone,
        isPremium: student.is_premium,
        registrationFeePaid: student.registration_fee_paid
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

router.get('/verify', protect, async (req, res) => {
  try {
    const student = req.user;
    res.json({
      success: true,
      user: {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        phone: student.phone,
        profilePhoto: student.profile_photo,
        isPremium: student.is_premium,
        registrationFeePaid: student.registration_fee_paid,
        createdAt: student.created_at,
        userType: 'student'
      }
    });
  } catch (error) {
    console.error('Student verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const student = req.user;
    res.json({
      success: true,
      student: {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        phone: student.phone,
        profilePhoto: student.profile_photo,
        isPremium: student.is_premium,
        registrationFeePaid: student.registration_fee_paid,
        createdAt: student.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/profile/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    const studentId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a photo' });
    }

    const [student] = await query(
      'SELECT profile_photo FROM students WHERE id = ?',
      [studentId]
    );

    if (student && student.profile_photo) {
      const oldPhotoPath = path.join(__dirname, '..', student.profile_photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    const photoUrl = `/uploads/profile-photos/${req.file.filename}`;

    await query(
      'UPDATE students SET profile_photo = ? WHERE id = ?',
      [photoUrl, studentId]
    );

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      profilePhoto: photoUrl
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { fullName, phone } = req.body;

    const sql = `
      UPDATE students 
      SET full_name = ?, phone = ?
      WHERE id = ?
    `;

    await query(sql, [fullName, phone, studentId]);

    const [student] = await query(
      'SELECT id, full_name, email, phone, is_premium FROM students WHERE id = ?',
      [studentId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      student: {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        phone: student.phone,
        isPremium: student.is_premium
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
