const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');
const { validateReview, handleValidationErrors } = require('../middleware/validators');
const { protect, restrictTo } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private (Student)
router.post('/', protect, restrictTo('student'), validateReview, handleValidationErrors, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed sessions' });
    }

    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ error: 'Review already submitted for this booking' });
    }

    // Create review
    const review = await Review.create({
      student: req.user._id,
      tutor: booking.tutor,
      course: booking.course,
      booking: bookingId,
      rating,
      comment
    });

    // Update tutor rating
    const reviews = await Review.find({ tutor: booking.tutor });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Tutor.findByIdAndUpdate(booking.tutor, {
      rating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/reviews/tutor/:tutorId
// @desc    Get all reviews for a tutor
// @access  Public
router.get('/tutor/:tutorId', async (req, res) => {
  try {
    const reviews = await Review.find({ tutor: req.params.tutorId })
      .populate('student', 'firstName lastName')
      .populate('course', 'title')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/reviews/course/:courseId
// @desc    Get all reviews for a course
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('student', 'firstName lastName')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/reviews/my-reviews
// @desc    Get student's reviews
// @access  Private (Student)
router.get('/my-reviews', protect, restrictTo('student'), async (req, res) => {
  try {
    const reviews = await Review.find({ student: req.user._id })
      .populate('tutor', 'firstName lastName')
      .populate('course', 'title')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
