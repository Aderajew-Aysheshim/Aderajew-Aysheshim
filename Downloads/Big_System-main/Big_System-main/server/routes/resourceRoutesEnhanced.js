const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/uploadMiddleware');

// @route   GET /api/resources
// @desc    Get all approved resources with advanced filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      subject,
      type,
      gradeLevel,
      university,
      department,
      accessLevel,
      year,
      semester,
      tags,
      sortBy = 'created_at',
      order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    let sql = `
      SELECT r.*, 
             COUNT(DISTINCT rd.id) as download_count,
             COUNT(DISTINCT rf.id) as favorite_count
      FROM resources r
      LEFT JOIN resource_downloads rd ON r.id = rd.resource_id
      LEFT JOIN resource_favorites rf ON r.id = rf.resource_id
      WHERE r.status = 'approved'
    `;
    const params = [];

    // Search filter (full-text search)
    if (search) {
      sql += ` AND (MATCH(r.title, r.description, r.tags) AGAINST (? IN NATURAL LANGUAGE MODE)
               OR r.title LIKE ? OR r.description LIKE ?)`;
      params.push(search, `%${search}%`, `%${search}%`);
    }

    // Subject filter
    if (subject) {
      sql += ' AND r.subject = ?';
      params.push(subject);
    }

    // Type filter
    if (type) {
      sql += ' AND r.type = ?';
      params.push(type);
    }

    // Grade level filter
    if (gradeLevel) {
      sql += ' AND r.grade_level = ?';
      params.push(gradeLevel);
    }

    // University and Department filters removed as columns do not exist
    /*
    if (university) {
      sql += ' AND r.university = ?';
      params.push(university);
    }
    if (department) {
      sql += ' AND r.department = ?';
      params.push(department);
    }
    */

    // Access level filter
    if (accessLevel) {
      sql += ' AND r.access_level = ?';
      params.push(accessLevel);
    }

    // Year filter
    if (year) {
      sql += ' AND r.year = ?';
      params.push(year);
    }

    // Semester filter
    if (semester) {
      sql += ' AND r.semester = ?';
      params.push(semester);
    }

    // Tags filter
    if (tags) {
      sql += ' AND r.tags LIKE ?';
      params.push(`%${tags}%`);
    }

    sql += ' GROUP BY r.id';

    // Sorting
    const allowedSortFields = ['created_at', 'downloads', 'rating', 'views', 'title'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY r.${sortField} ${sortOrder}`;

    // Pagination
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const resources = await query(sql, params);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM resources WHERE status = "approved"';
    const countParams = [];

    if (search) {
      countSql += ` AND (MATCH(title, description, tags) AGAINST (? IN NATURAL LANGUAGE MODE)
                    OR title LIKE ? OR description LIKE ?)`;
      countParams.push(search, `%${search}%`, `%${search}%`);
    }
    if (subject) {
      countSql += ' AND subject = ?';
      countParams.push(subject);
    }
    if (type) {
      countSql += ' AND type = ?';
      countParams.push(type);
    }

    const [{ total }] = await query(countSql, countParams);

    res.json({
      success: true,
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource with details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const [resource] = await query(
      `SELECT r.*, 
              COUNT(DISTINCT rd.id) as download_count,
              COUNT(DISTINCT rf.id) as favorite_count,
              AVG(rr.rating) as avg_rating,
              COUNT(DISTINCT rr.id) as rating_count
       FROM resources r
        LEFT JOIN resource_downloads rd ON r.id = rd.resource_id
       LEFT JOIN resource_favorites rf ON r.id = rf.resource_id
       LEFT JOIN resource_ratings rr ON r.id = rr.resource_id
       WHERE r.id = ? AND r.status = 'approved'
       GROUP BY r.id`,
      [req.params.id]
    );

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Increment view count
    await query('UPDATE resources SET views = views + 1 WHERE id = ?', [req.params.id]);

    res.json({ success: true, resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/resources/upload
// @desc    Upload a new resource
// @access  Private (Student/Tutor/Admin)
router.post('/upload', uploadSingle('file'), handleUploadError, async (req, res) => {
  try {
    const {
      title, description, type, subject, gradeLevel,
      courseCode, accessLevel,
      tags, year, semester, language, uploaderId, uploaderType
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    if (!title || !description || !type || !subject) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileUrl = req.file.location || `/uploads/resources/${req.file.filename}`;
    const fileType = path.extname(req.file.originalname).substring(1);
    const fileSize = req.file.size;

    // Resources uploaded by students/tutors need approval
    const status = uploaderType === 'admin' ? 'approved' : 'pending';

    const result = await query(
      `INSERT INTO resources 
       (title, description, type, subject, grade_level, 
        course_code, access_level, file_url, file_type, file_size, status, 
        uploaded_by, uploader_type, tags, year, semester, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, type, subject, gradeLevel,
        courseCode, accessLevel || 'free', fileUrl, fileType, fileSize, status,
        uploaderId, uploaderType, tags, year, semester, language || 'English']
    );

    res.status(201).json({
      success: true,
      message: status === 'pending'
        ? 'Resource uploaded successfully. Awaiting admin approval.'
        : 'Resource uploaded and published successfully.',
      resourceId: result.insertId
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Upload resource error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/resources/:id/download
// @desc    Track resource download
// @access  Private
router.post('/:id/download', async (req, res) => {
  try {
    const { userId, userType } = req.body;

    // Increment download count
    await query('UPDATE resources SET downloads = downloads + 1 WHERE id = ?', [req.params.id]);

    // Track download
    await query(
      'INSERT INTO resource_downloads (resource_id, user_id, user_type, ip_address) VALUES (?, ?, ?, ?)',
      [req.params.id, userId, userType, req.ip]
    );

    res.json({ success: true, message: 'Download tracked' });
  } catch (error) {
    console.error('Track download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/resources/:id/favorite
// @desc    Add resource to favorites
// @access  Private
router.post('/:id/favorite', async (req, res) => {
  try {
    const { userId, userType } = req.body;

    await query(
      'INSERT INTO resource_favorites (resource_id, user_id, user_type) VALUES (?, ?, ?)',
      [req.params.id, userId, userType]
    );

    res.json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    console.error('Add favorite error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/resources/:id/favorite
// @desc    Remove resource from favorites
// @access  Private
router.delete('/:id/favorite', async (req, res) => {
  try {
    const { userId, userType } = req.body;

    await query(
      'DELETE FROM resource_favorites WHERE resource_id = ? AND user_id = ? AND user_type = ?',
      [req.params.id, userId, userType]
    );

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/resources/:id/rate
// @desc    Rate a resource
// @access  Private
router.post('/:id/rate', async (req, res) => {
  try {
    const { userId, userType, rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    await query(
      `INSERT INTO resource_ratings (resource_id, user_id, user_type, rating, review) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?, review = ?`,
      [req.params.id, userId, userType, rating, review, rating, review]
    );

    // Update resource rating
    const [{ avg_rating, total }] = await query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM resource_ratings WHERE resource_id = ?',
      [req.params.id]
    );

    await query(
      'UPDATE resources SET rating = ?, total_ratings = ? WHERE id = ?',
      [avg_rating, total, req.params.id]
    );

    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate resource error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/universities/list
// @desc    Get list of universities
// @access  Public
router.get('/universities/list', async (req, res) => {
  try {
    const universities = await query(
      'SELECT * FROM universities WHERE is_active = TRUE ORDER BY name'
    );
    res.json({ success: true, universities });
  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
