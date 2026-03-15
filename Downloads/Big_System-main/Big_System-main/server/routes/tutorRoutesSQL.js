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
    cb(null, 'tutor-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

const credentialStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/credentials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'credential-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadCredential = multer({
  storage: credentialStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png)|application\/pdf/.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed!'));
    }
  }
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
    const [tutor] = await query(
      'SELECT id, full_name, email, phone, profile_photo, specializations, bio, hourly_rate, is_verified, activation_fee_paid, is_active FROM tutors WHERE id = ?',
      [decoded.id]
    );

    if (!tutor) {
      return res.status(401).json({ error: 'Tutor not found' });
    }

    req.user = { ...tutor, userType: 'tutor' };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, qualifications, subjects, availability, bio } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existingTutors = await query('SELECT id FROM tutors WHERE email = ?', [email]);
    if (existingTutors && existingTutors.length > 0) {
      return res.status(400).json({ error: 'Tutor with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const fullName = `${firstName} ${lastName}`;

    const [columns] = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'tutors' 
      AND COLUMN_NAME = 'qualifications'
    `);

    let sql, params;

    if (columns && columns.length > 0) {
     
      sql = `
        INSERT INTO tutors (full_name, email, phone, password_hash, specializations, bio, qualifications, availability, is_verified, activation_fee_paid, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, FALSE, FALSE)
      `;
      params = [
        fullName,
        email,
        phone || null,
        passwordHash,
        subjects || null,
        bio || null,
        qualifications || null,
        availability || null
      ];
    } else {
     
      sql = `
        INSERT INTO tutors (full_name, email, phone, password_hash, specializations, bio, is_verified, activation_fee_paid, is_active)
        VALUES (?, ?, ?, ?, ?, ?, FALSE, FALSE, FALSE)
      `;
      params = [
        fullName,
        email,
        phone || null,
        passwordHash,
        subjects || null,
        bio || null
      ];
    }

    const result = await query(sql, params);

    const token = generateToken(result.insertId, 'tutor');

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Tutor registered successfully',
      token,
      tutor: {
        id: result.insertId,
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        subjects,
        qualifications: qualifications || 'Experienced educator',
        availability: availability || 'Flexible',
        isVerified: false,
        activationFeePaid: false,
        userType: 'tutor'
      }
    });
  } catch (error) {
    console.error('Tutor registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const [tutor] = await query('SELECT * FROM tutors WHERE email = ?', [email]);

    if (!tutor) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!tutor.is_active) {
      return res.status(401).json({ error: 'Your account is pending admin approval. Please wait for verification.' });
    }

    const isMatch = await bcrypt.compare(password, tutor.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(tutor.id, 'tutor');

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
      tutor: {
        id: tutor.id,
        fullName: tutor.full_name,
        email: tutor.email,
        phone: tutor.phone,
        specializations: tutor.specializations,
        bio: tutor.bio,
        hourlyRate: tutor.hourly_rate,
        isVerified: tutor.is_verified,
        activationFeePaid: tutor.activation_fee_paid,
        rating: tutor.rating,
        totalEarnings: tutor.total_earnings
      }
    });
  } catch (error) {
    console.error('Tutor login error:', error);
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
    const tutor = req.user;
    res.json({
      success: true,
      user: {
        id: tutor.id,
        fullName: tutor.full_name,
        email: tutor.email,
        phone: tutor.phone,
        profilePhoto: tutor.profile_photo,
        specializations: tutor.specializations,
        bio: tutor.bio,
        hourlyRate: tutor.hourly_rate,
        isVerified: tutor.is_verified,
        activationFeePaid: tutor.activation_fee_paid,
        createdAt: tutor.created_at,
        userType: 'tutor'
      }
    });
  } catch (error) {
    console.error('Tutor verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const tutor = req.user;
    res.json({
      success: true,
      tutor: {
        id: tutor.id,
        fullName: tutor.full_name,
        email: tutor.email,
        phone: tutor.phone || null,
        specializations: tutor.specializations || null,
        bio: tutor.bio || null,
        profilePhoto: tutor.profile_photo || null,
        hourlyRate: tutor.hourly_rate || 500,
        isVerified: tutor.is_verified || false,
        activationFeePaid: tutor.activation_fee_paid || false,
        rating: tutor.rating || 0,
        totalReviews: tutor.total_reviews || 0,
        totalEarnings: tutor.total_earnings || 0,
        commissionOwed: tutor.commission_owed || 0,
        degreeCertificate: tutor.degree_certificate || null,
        idDocument: tutor.id_document || null,
        cvDocument: tutor.cv_document || null,
        transcript: tutor.transcript || null,
        createdAt: tutor.created_at
      }
    });
  } catch (error) {
    console.error('Get tutor profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { fullName, phone, specializations, bio, hourlyRate } = req.body;

    const sql = `
      UPDATE tutors 
      SET full_name = ?, phone = ?, specializations = ?, bio = ?, hourly_rate = ?
      WHERE id = ?
    `;

    await query(sql, [fullName, phone, specializations, bio, hourlyRate, tutorId]);

    const [tutor] = await query(
      'SELECT id, full_name, email, phone, specializations, bio, hourly_rate, is_verified FROM tutors WHERE id = ?',
      [tutorId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      tutor: {
        id: tutor.id,
        fullName: tutor.full_name,
        email: tutor.email,
        phone: tutor.phone,
        specializations: tutor.specializations,
        bio: tutor.bio,
        hourlyRate: tutor.hourly_rate,
        isVerified: tutor.is_verified
      }
    });
  } catch (error) {
    console.error('Update tutor profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/profile/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    const tutorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a photo' });
    }

    const [tutor] = await query('SELECT profile_photo FROM tutors WHERE id = ?', [tutorId]);

    if (tutor && tutor.profile_photo) {
      const oldPhotoPath = path.join(__dirname, '..', tutor.profile_photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    const photoUrl = `/uploads/profile-photos/${req.file.filename}`;

    await query('UPDATE tutors SET profile_photo = ? WHERE id = ?', [photoUrl, tutorId]);

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

router.post('/credentials/upload', protect, uploadCredential.single('credential'), async (req, res) => {
  try {
    const tutorId = req.user.id;

    const { credentialType } = req.body;

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'Please upload a file' });
    }

    if (!credentialType) {
      console.log('❌ No credential type provided');
      return res.status(400).json({ error: 'Credential type is required' });
    }

    console.log('📁 File uploaded:', req.file.filename);
    console.log('📋 Credential type:', credentialType);

    const fileUrl = `/uploads/credentials/${req.file.filename}`;

    const columnMap = {
      'degree': 'degree_certificate',
      'id': 'id_document',
      'cv': 'cv_document',
      'transcript': 'transcript'
    };

    const column = columnMap[credentialType];
    if (!column) {
      console.log('❌ Invalid credential type:', credentialType);
      return res.status(400).json({ error: 'Invalid credential type' });
    }

    console.log('💾 Updating database column:', column);

    const [tutor] = await query(`SELECT ${column} FROM tutors WHERE id = ?`, [tutorId]);

    if (tutor && tutor[column]) {
      const oldFilePath = path.join(__dirname, '..', tutor[column]);
      console.log('🗑️ Deleting old file:', oldFilePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log('✅ Old file deleted');
      }
    }

    await query(`UPDATE tutors SET ${column} = ? WHERE id = ?`, [fileUrl, tutorId]);
    console.log('✅ Database updated successfully');

    res.json({
      success: true,
      message: `${credentialType} uploaded successfully`,
      fileUrl: fileUrl
    });

    console.log('✅ Response sent to client');
  } catch (error) {
    console.error('❌ Upload credential error:', error);
    console.error('Error stack:', error.stack);
    if (req.file) {
      console.log('🗑️ Cleaning up uploaded file due to error');
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const tutorId = req.user.id;

    const [studentCount] = await query(
      'SELECT COUNT(DISTINCT student_id) as count FROM tutor_students WHERE tutor_id = ?',
      [tutorId]
    );

    const [convCount] = await query(
      'SELECT COUNT(*) as count FROM conversations WHERE tutor_id = ?',
      [tutorId]
    );

    const [tutor] = await query(
      'SELECT total_earnings, commission_owed FROM tutors WHERE id = ?',
      [tutorId]
    );

    res.json({
      success: true,
      stats: {
        totalStudents: studentCount?.count || 0,
        totalEarnings: tutor?.total_earnings || 0,
        commissionOwed: tutor?.commission_owed || 0,
        activeConversations: convCount?.count || 0
      }
    });
  } catch (error) {
    console.error('Get tutor stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
   
    const tutors = await query(
      'SELECT id, full_name, email, phone, bio, profile_photo, hourly_rate, rating, total_reviews, specializations FROM tutors WHERE is_verified = TRUE ORDER BY rating DESC'
    );

    res.json({
      success: true,
      count: tutors.length,
      tutors: tutors.map(t => {
        const nameParts = t.full_name ? t.full_name.split(' ') : ['', ''];
        return {
          id: t.id,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: t.email,
          phone: t.phone,
          subjects: t.specializations,
          specialization: t.specializations,
          bio: t.bio,
          profilePhoto: t.profile_photo,
          hourlyRate: t.hourly_rate,
          rating: t.rating,
          totalReviews: t.total_reviews
        };
      })
    });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [tutor] = await query(
      'SELECT id, full_name, email, phone, bio, profile_photo, hourly_rate, rating, total_reviews, specializations FROM tutors WHERE id = ? AND is_verified = TRUE',
      [req.params.id]
    );

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const nameParts = tutor.full_name ? tutor.full_name.split(' ') : ['', ''];

    res.json({
      success: true,
      tutor: {
        id: tutor.id,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: tutor.email,
        phone: tutor.phone,
        subjects: tutor.specializations,
        specialization: tutor.specializations,
        bio: tutor.bio,
        profilePhoto: tutor.profile_photo,
        hourlyRate: tutor.hourly_rate,
        rating: tutor.rating,
        totalReviews: tutor.total_reviews
      }
    });
  } catch (error) {
    console.error('Get tutor error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard', protect, async (req, res) => {
  try {
    const tutorId = req.user.id;

    const [tutor] = await query(
      'SELECT total_earnings, rating FROM tutors WHERE id = ?',
      [tutorId]
    );

    const [studentCount] = await query(
      'SELECT COUNT(DISTINCT student_id) as count FROM tutor_students WHERE tutor_id = ?',
      [tutorId]
    );

    const [sessionCount] = await query(
      'SELECT COUNT(*) as count FROM sessions WHERE tutor_id = ? AND MONTH(session_date) = MONTH(NOW()) AND YEAR(session_date) = YEAR(NOW())',
      [tutorId]
    );

    res.json({
      success: true,
      stats: {
        activeStudents: studentCount?.count || 0,
        sessionsThisMonth: sessionCount?.count || 0,
        totalEarnings: tutor?.total_earnings || 0,
        rating: tutor?.rating || 0,
        recentActivities: [
          {
            type: 'completed',
            title: 'Session Completed',
            description: 'Your recent tutoring session',
            status: '✓ Completed'
          }
        ]
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/resources', protect, async (req, res) => {
  try {
    const tutorId = req.user.id;

    const resources = await query(
      'SELECT id, title, file_name, file_url, type, created_at FROM tutor_resources WHERE tutor_id = ? ORDER BY created_at DESC',
      [tutorId]
    );

    res.json({
      success: true,
      resources: resources.map(r => ({
        id: r.id,
        title: r.title,
        fileName: r.file_name,
        fileUrl: r.file_url,
        type: r.type,
        createdAt: r.created_at
      }))
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: error.message });
  }
});

const resourceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/resources';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resource-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadResource = multer({
  storage: resourceStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG files are allowed!'));
    }
  }
});

router.post('/upload-resource', protect, uploadResource.single('file'), async (req, res) => {
  try {
    const tutorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const { title, type } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const fileUrl = `/uploads/resources/${req.file.filename}`;

    const result = await query(
      'INSERT INTO tutor_resources (tutor_id, title, file_name, file_url, type) VALUES (?, ?, ?, ?, ?)',
      [tutorId, title, req.file.filename, fileUrl, type || 'material']
    );

    res.json({
      success: true,
      message: 'Resource uploaded successfully',
      resource: {
        id: result.insertId,
        title,
        fileName: req.file.filename,
        fileUrl,
        type: type || 'material',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Upload resource error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete('/resources/:id', protect, async (req, res) => {
  try {
    const tutorId = req.user.id;

    const [resource] = await query(
      'SELECT file_url FROM tutor_resources WHERE id = ? AND tutor_id = ?',
      [req.params.id, tutorId]
    );

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const filePath = path.join(__dirname, '..', resource.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await query('DELETE FROM tutor_resources WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
