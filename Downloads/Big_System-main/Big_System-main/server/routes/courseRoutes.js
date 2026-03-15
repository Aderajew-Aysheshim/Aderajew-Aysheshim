const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Tutor = require('../models/Tutor');
const { validateCourse, handleValidationErrors } = require('../middleware/validators');
const { protect, restrictTo, verifiedTutor } = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, gradeLevel, tutor } = req.query;

    let query = { status: 'active' };

    if (subject) query.subject = subject;
    if (gradeLevel) query.gradeLevel = gradeLevel;
    if (tutor) query.tutor = tutor;

    const courses = await Course.find(query)
      .populate('tutor', 'firstName lastName rating')
      .sort('-createdAt');

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'firstName lastName email rating qualifications')
      .populate('enrolledStudents', 'firstName lastName');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Tutor - Verified)
router.post('/', protect, restrictTo('tutor'), verifiedTutor, validateCourse, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, subject, gradeLevel, price, duration, maxStudents, schedule } = req.body;

    const course = await Course.create({
      title,
      description,
      subject,
      gradeLevel,
      tutor: req.user._id,
      price,
      duration,
      maxStudents,
      schedule
    });

    // Add course to tutor's courses
    await Tutor.findByIdAndUpdate(req.user._id, {
      $push: { courses: course._id }
    });

    res.status(201).json({ success: true, message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Tutor - Owner)
router.put('/:id', protect, restrictTo('tutor'), verifiedTutor, async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if tutor owns the course
    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Tutor - Owner)
router.delete('/:id', protect, restrictTo('tutor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if tutor owns the course
    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await course.deleteOne();

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll student in course
// @access  Private (Student)
router.post('/:id/enroll', protect, restrictTo('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Check if course is full
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ error: 'Course is full' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
