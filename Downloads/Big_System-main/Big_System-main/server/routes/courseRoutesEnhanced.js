const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');

// @route   GET /api/courses
// @desc    Get all published courses with advanced filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search, category, subject, gradeLevel, difficulty,
      minPrice, maxPrice, isFree, isFeatured, sortBy = 'created_at',
      order = 'DESC', page = 1, limit = 12
    } = req.query;

    let sql = `
      SELECT c.*, 
             cc.name as category_name,
             t.full_name as tutor_name,
             t.rating as tutor_rating,
             COUNT(DISTINCT ce.id) as enrollment_count
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN tutors t ON c.tutor_id = t.id
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      WHERE c.status = 'published'
    `;
    const params = [];

    // Search filter
    if (search) {
      sql += ` AND (MATCH(c.title, c.description, c.tags) AGAINST (? IN NATURAL LANGUAGE MODE)
               OR c.title LIKE ? OR c.description LIKE ?)`;
      params.push(search, `%${search}%`, `%${search}%`);
    }

    // Category filter
    if (category) {
      sql += ' AND c.category_id = ?';
      params.push(category);
    }

    // Subject filter
    if (subject) {
      sql += ' AND c.subject = ?';
      params.push(subject);
    }

    // Grade level filter
    if (gradeLevel) {
      sql += ' AND c.grade_level = ?';
      params.push(gradeLevel);
    }

    // Difficulty filter
    if (difficulty) {
      sql += ' AND c.difficulty_level = ?';
      params.push(difficulty);
    }

    // Price filters
    if (isFree === 'true') {
      sql += ' AND c.is_free = TRUE';
    } else {
      if (minPrice) {
        sql += ' AND c.price >= ?';
        params.push(minPrice);
      }
      if (maxPrice) {
        sql += ' AND c.price <= ?';
        params.push(maxPrice);
      }
    }

    // Featured filter
    if (isFeatured === 'true') {
      sql += ' AND c.is_featured = TRUE';
    }

    sql += ' GROUP BY c.id';

    // Sorting
    const allowedSortFields = ['created_at', 'price', 'average_rating', 'total_enrollments', 'title'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY c.${sortField} ${sortOrder}`;

    // Pagination
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const courses = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM courses WHERE status = "published"';
    const countParams = [];
    if (search) {
      countSql += ` AND (MATCH(title, description, tags) AGAINST (? IN NATURAL LANGUAGE MODE)
                    OR title LIKE ? OR description LIKE ?)`;
      countParams.push(search, `%${search}%`, `%${search}%`);
    }
    const [{ total }] = await query(countSql, countParams);

    res.json({
      success: true,
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course with full details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Get course details
    const [course] = await query(
      `SELECT c.*, 
              cc.name as category_name,
              t.full_name as tutor_name,
              t.email as tutor_email,
              t.bio as tutor_bio,
              t.rating as tutor_rating,
              t.profile_photo as tutor_photo,
              COUNT(DISTINCT ce.id) as enrollment_count
       FROM courses c
       LEFT JOIN course_categories cc ON c.category_id = cc.id
       LEFT JOIN tutors t ON c.tutor_id = t.id
       LEFT JOIN course_enrollments ce ON c.id = ce.course_id
       WHERE c.id = ? AND c.status = 'published'
       GROUP BY c.id`,
      [req.params.id]
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get modules and lessons
    const modules = await query(
      `SELECT * FROM course_modules 
       WHERE course_id = ? AND is_published = TRUE 
       ORDER BY module_order`,
      [req.params.id]
    );

    for (let module of modules) {
      module.lessons = await query(
        `SELECT * FROM course_lessons 
         WHERE module_id = ? AND is_published = TRUE 
         ORDER BY lesson_order`,
        [module.id]
      );
    }

    // Get reviews
    const reviews = await query(
      `SELECT cr.*, 
              s.full_name as student_name,
              s.profile_photo as student_photo
       FROM course_reviews cr
       LEFT JOIN students s ON cr.student_id = s.id
       WHERE cr.course_id = ? AND cr.is_approved = TRUE
       ORDER BY cr.created_at DESC
       LIMIT 10`,
      [req.params.id]
    );

    res.json({
      success: true,
      course: {
        ...course,
        modules,
        reviews
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a new course (Tutor only)
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      tutorId, categoryId, title, subtitle, description,
      whatYouWillLearn, requirements, subject, gradeLevel,
      difficultyLevel, price, durationHours, maxStudents,
      tags, language
    } = req.body;

    if (!title || !description || !subject || !tutorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO courses 
       (tutor_id, category_id, title, subtitle, description, what_you_will_learn,
        requirements, subject, grade_level, difficulty_level, price, duration_hours,
        max_students, tags, language, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [tutorId, categoryId, title, subtitle, description, whatYouWillLearn,
        requirements, subject, gradeLevel, difficultyLevel || 'beginner',
        price || 0, durationHours, maxStudents || 50, tags, language || 'English']
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      courseId: result.insertId
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll student in course
// @access  Private
router.post('/:id/enroll', async (req, res) => {
  try {
    const { studentId, enrollmentType = 'paid', amountPaid = 0 } = req.body;
    const courseId = req.params.id;

    // Check if already enrolled
    const existing = await query(
      'SELECT id FROM course_enrollments WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const result = await query(
      `INSERT INTO course_enrollments 
       (student_id, course_id, enrollment_type, amount_paid, payment_status)
       VALUES (?, ?, ?, ?, 'completed')`,
      [studentId, courseId, enrollmentType, amountPaid]
    );

    // Update course enrollment count
    await query(
      'UPDATE courses SET enrolled_students = enrolled_students + 1, total_enrollments = total_enrollments + 1 WHERE id = ?',
      [courseId]
    );

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollmentId: result.insertId
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/courses/:id/review
// @desc    Add course review
// @access  Private
router.post('/:id/review', async (req, res) => {
  try {
    const { studentId, enrollmentId, rating, reviewTitle, reviewText } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    await query(
      `INSERT INTO course_reviews 
       (course_id, student_id, enrollment_id, rating, review_title, review_text)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?, review_title = ?, review_text = ?`,
      [req.params.id, studentId, enrollmentId, rating, reviewTitle, reviewText,
        rating, reviewTitle, reviewText]
    );

    // Update course rating
    const [{ avg_rating, total }] = await query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM course_reviews WHERE course_id = ? AND is_approved = TRUE',
      [req.params.id]
    );

    await query(
      'UPDATE courses SET average_rating = ?, total_reviews = ? WHERE id = ?',
      [avg_rating, total, req.params.id]
    );

    res.json({ success: true, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/courses/categories/list
// @desc    Get all course categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await query(
      'SELECT * FROM course_categories WHERE is_active = TRUE ORDER BY name'
    );
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/courses/:id/progress/:studentId
// @desc    Get student's course progress
// @access  Private
router.get('/:id/progress/:studentId', async (req, res) => {
  try {
    const [enrollment] = await query(
      'SELECT * FROM course_enrollments WHERE course_id = ? AND student_id = ?',
      [req.params.id, req.params.studentId]
    );

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const progress = await query(
      `SELECT cp.*, cl.title as lesson_title
       FROM course_progress cp
       LEFT JOIN course_lessons cl ON cp.lesson_id = cl.id
       WHERE cp.enrollment_id = ?`,
      [enrollment.id]
    );

    res.json({
      success: true,
      enrollment,
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
