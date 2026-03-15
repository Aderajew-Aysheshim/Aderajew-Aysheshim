const express = require('express');
const router = express.Router();
const {
    query
} = require('../config/mysqlDatabase');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            subject,
            gradeLevel,
            tutor
        } = req.query;

        let sql = `
      SELECT 
        c.*,
        t.full_name as tutorName,
        t.email as tutorEmail
      FROM courses c
      LEFT JOIN tutors t ON c.tutor_id = t.id
      WHERE 1=1
    `;
        const params = [];

        if (subject) {
            sql += ' AND c.subject = ?';
            params.push(subject);
        }

        if (gradeLevel) {
            sql += ' AND c.grade_level = ?';
            params.push(gradeLevel);
        }

        if (tutor) {
            sql += ' AND c.tutor_id = ?';
            params.push(tutor);
        }

        sql += ' ORDER BY c.created_at DESC';

        const courses = await query(sql, params);

        res.json({
            success: true,
            count: courses?.length || 0,
            courses: courses || []
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const courses = await query(
            `SELECT 
        c.*,
        t.full_name as tutorName,
        t.email as tutorEmail,
        t.phone as tutorPhone
      FROM courses c
      LEFT JOIN tutors t ON c.tutor_id = t.id
      WHERE c.id = ?`,
            [req.params.id]
        );

        if (courses.length === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        res.json({
            success: true,
            course: courses[0]
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Tutor)
router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            gradeLevel,
            price,
            duration,
            tutorId
        } = req.body;

        // Validation
        if (!title || !description || !subject || !tutorId) {
            return res.status(400).json({
                error: 'Please provide title, description, subject, and tutor ID'
            });
        }

        const result = await query(
            `INSERT INTO courses 
        (title, description, subject, grade_level, price, duration, tutor_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, subject, gradeLevel || 'University', price || 1500, duration || 2, tutorId]
        );

        const insertId = result.insertId;
        const newCourse = await query(
            `SELECT 
        c.*,
        t.full_name as tutorName
      FROM courses c
      LEFT JOIN tutors t ON c.tutor_id = t.id
      WHERE c.id = ?`,
            [insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: newCourse[0]
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Tutor - Owner)
router.put('/:id', async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            gradeLevel,
            price,
            duration
        } = req.body;

        // Check if course exists first
        const existing = await query('SELECT id FROM courses WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        await query(
            `UPDATE courses 
      SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        subject = COALESCE(?, subject),
        grade_level = COALESCE(?, grade_level),
        price = COALESCE(?, price),
        duration = COALESCE(?, duration),
        updated_at = NOW()
      WHERE id = ?`,
            [title, description, subject, gradeLevel, price, duration, req.params.id]
        );

        const updatedCourse = await query(
            `SELECT 
        c.*,
        t.full_name as tutorName
      FROM courses c
      LEFT JOIN tutors t ON c.tutor_id = t.id
      WHERE c.id = ?`,
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse[0]
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Tutor - Owner)
router.delete('/:id', async (req, res) => {
    try {
        // Check if course exists first
        const existing = await query('SELECT id FROM courses WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        await query('DELETE FROM courses WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll student in course
// @access  Private (Student)
router.post('/:id/enroll', async (req, res) => {
    try {
        const {
            studentId
        } = req.body;
        const courseId = req.params.id;

        if (!studentId) {
            return res.status(400).json({
                error: 'Student ID is required'
            });
        }

        // Check if course exists
        const courses = await query(
            'SELECT * FROM courses WHERE id = ?',
            [courseId]
        );

        if (courses.length === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        // Check if already enrolled
        const existing = await query(
            'SELECT * FROM course_enrollments WHERE student_id = ? AND course_id = ?',
            [studentId, courseId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                error: 'Already enrolled in this course'
            });
        }

        // Create enrollment
        await query(
            'INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)',
            [studentId, courseId]
        );

        res.json({
            success: true,
            message: 'Successfully enrolled in course'
        });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;