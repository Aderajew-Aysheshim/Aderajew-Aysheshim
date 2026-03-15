const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/tutor-documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only documents (PDF, DOC, PPT, XLS, TXT, ZIP) are allowed!'));
    }
  }
});

// Auth middleware
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, userType: decoded.userType };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized' });
  }
};

// @route   POST /api/tutor-documents/upload
// @desc    Upload a document
// @access  Private (Tutor only)
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (req.user.userType !== 'tutor') {
      return res.status(403).json({ error: 'Only tutors can upload documents' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a document' });
    }

    const { title, description, subject, gradeLevel, documentType, isFree, price } = req.body;

    if (!title) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Title is required' });
    }

    const filePath = `/uploads/tutor-documents/${req.file.filename}`;

    const sql = `
      INSERT INTO tutor_documents 
      (tutor_id, title, description, file_name, file_path, file_type, file_size, subject, grade_level, document_type, is_free, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      req.user.id,
      title,
      description || null,
      req.file.originalname,
      filePath,
      req.file.mimetype,
      req.file.size,
      subject || null,
      gradeLevel || null,
      documentType || 'notes',
      isFree === 'true' || isFree === true,
      price || 0
    ]);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: result.insertId,
        title,
        fileName: req.file.originalname,
        filePath
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutor-documents/my-documents
// @desc    Get tutor's documents
// @access  Private (Tutor only)
router.get('/my-documents', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'tutor') {
      return res.status(403).json({ error: 'Only tutors can access this' });
    }

    const documents = await query(
      `SELECT * FROM tutor_documents WHERE tutor_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutor-documents
// @desc    Get all approved documents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, gradeLevel, tutorId } = req.query;

    let sql = `
      SELECT d.*, t.first_name, t.last_name, t.specialization
      FROM tutor_documents d
      JOIN tutors t ON d.tutor_id = t.id
      WHERE d.is_approved = TRUE
    `;
    const params = [];

    if (subject) {
      sql += ' AND d.subject = ?';
      params.push(subject);
    }

    if (gradeLevel) {
      sql += ' AND d.grade_level = ?';
      params.push(gradeLevel);
    }

    if (tutorId) {
      sql += ' AND d.tutor_id = ?';
      params.push(tutorId);
    }

    sql += ' ORDER BY d.created_at DESC';

    const documents = await query(sql, params);

    res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/tutor-documents/:id
// @desc    Delete a document
// @access  Private (Tutor only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'tutor') {
      return res.status(403).json({ error: 'Only tutors can delete documents' });
    }

    const [document] = await query(
      'SELECT * FROM tutor_documents WHERE id = ? AND tutor_id = ?',
      [req.params.id, req.user.id]
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', document.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await query('DELETE FROM tutor_documents WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
