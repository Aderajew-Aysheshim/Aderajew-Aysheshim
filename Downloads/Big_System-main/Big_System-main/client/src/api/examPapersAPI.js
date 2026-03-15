// API Documentation for Exam Paper Management System
// This file shows the required backend endpoints for the functional exam paper system

/**
 * Backend API Endpoints Required for Exam Paper Management
 * 
 * These endpoints need to be implemented in your backend server (Node.js/Express)
 * to make the exam paper system fully functional.
 */

// 1. Admin Authentication (already exists)
// POST /api/admin/login
// GET /api/admin/profile

// 2. Exam Paper Management Endpoints
const examPapersAPI = {
  // Get all exam papers (admin)
  'GET /api/admin/exam-papers': {
    description: 'Get all exam papers for admin management',
    headers: { 'Authorization': 'Bearer adminToken' },
    response: {
      papers: [
        {
          id: 1,
          title: 'Mathematics Final Exam - 2023',
          description: 'Comprehensive final examination...',
          course: 'Mathematics',
          year: '2023',
          semester: 'Fall Semester',
          examType: 'Final Exam',
          duration: '3 Hours',
          fileUrl: '/uploads/papers/math-2023-final.pdf',
          thumbnail: '/uploads/thumbnails/math-2023-final.jpg',
          accessLevel: 'premium',
          createdAt: '2023-12-01T10:00:00Z',
          updatedAt: '2023-12-01T10:00:00Z'
        }
      ]
    }
  },

  // Upload new exam paper
  'POST /api/admin/exam-papers/upload': {
    description: 'Upload new exam paper with file',
    headers: {
      'Authorization': 'Bearer adminToken',
      'Content-Type': 'multipart/form-data'
    },
    body: {
      title: 'string (required)',
      course: 'string (required)',
      year: 'string (required)',
      semester: 'string (required)',
      examType: 'string (required)',
      duration: 'string (required)',
      description: 'string (optional)',
      accessLevel: 'string (premium|free)',
      file: 'File (PDF required)'
    }
  },

  // Update exam paper
  'PUT /api/admin/exam-papers/:id': {
    description: 'Update existing exam paper details',
    headers: { 'Authorization': 'Bearer adminToken' },
    body: {
      title: 'string',
      course: 'string',
      year: 'string',
      semester: 'string',
      examType: 'string',
      duration: 'string',
      description: 'string',
      accessLevel: 'string'
    }
  },

  // Delete exam paper
  'DELETE /api/admin/exam-papers/:id': {
    description: 'Delete exam paper',
    headers: { 'Authorization': 'Bearer adminToken' }
  },

  // Get papers by course (public/student)
  'GET /api/exam-papers/:course': {
    description: 'Get exam papers for specific course',
    response: {
      papers: [
        {
          id: 1,
          title: 'Mathematics Final Exam - 2023',
          description: 'Comprehensive final examination...',
          course: 'Mathematics',
          year: '2023',
          semester: 'Fall Semester',
          examType: 'Final Exam',
          duration: '3 Hours',
          date: 'December 2023',
          fileUrl: '/uploads/papers/math-2023-final.pdf',
          thumbnail: '/uploads/thumbnails/math-2023-final.jpg',
          accessLevel: 'premium'
        }
      ]
    }
  },

  // Get all courses with paper counts
  'GET /api/exam-papers': {
    description: 'Get all available courses with paper counts',
    response: {
      courses: [
        {
          name: 'Mathematics',
          paperCount: 5,
          premiumCount: 4,
          freeCount: 1
        }
      ]
    }
  }
};

/**
 * Database Schema Required
 * 
 * MongoDB Schema for ExamPaper collection:
 */
const examPaperSchema = {
  _id: 'ObjectId',
  title: 'String (required)',
  description: 'String (optional)',
  course: 'String (required)',
  year: 'String (required)',
  semester: 'String (required)',
  examType: 'String (required)',
  duration: 'String (required)',
  fileUrl: 'String (required)',
  thumbnail: 'String (optional)',
  accessLevel: 'String (premium|free, default: premium)',
  uploadedBy: 'ObjectId (ref: Admin)',
  createdAt: 'Date (default: Date.now)',
  updatedAt: 'Date (default: Date.now)'
};

/**
 * File Upload Configuration
 * 
 * Server setup for file uploads:
 */
const uploadConfig = {
  destination: './uploads/papers/',
  allowedTypes: ['application/pdf'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  thumbnailDestination: './uploads/thumbnails/',
  generateThumbnail: true
};

/**
 * Sample Backend Implementation (Express.js)
 * 
 * Here's a sample implementation for the main endpoints:
 */

/*
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ExamPaper = require('../models/ExamPaper');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/papers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Get all exam papers (admin)
router.get('/exam-papers', async (req, res) => {
  try {
    const papers = await ExamPaper.find().sort({ createdAt: -1 });
    res.json({ papers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload new exam paper
router.post('/exam-papers/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, course, year, semester, examType, duration, description, accessLevel } = req.body;
    
    const newPaper = new ExamPaper({
      title,
      course,
      year,
      semester,
      examType,
      duration,
      description,
      accessLevel: accessLevel || 'premium',
      fileUrl: `/uploads/papers/${req.file.filename}`,
      uploadedBy: req.admin.id
    });

    await newPaper.save();
    res.status(201).json({ message: 'Exam paper uploaded successfully', paper: newPaper });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get papers by course (public)
router.get('/exam-papers/:course', async (req, res) => {
  try {
    const papers = await ExamPaper.find({ course: req.params.course }).sort({ year: -1 });
    res.json({ papers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

export default examPapersAPI;
