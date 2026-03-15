const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Course = require('../models/Course');
const { validateBooking, handleValidationErrors } = require('../middleware/validators');
const { protect, restrictTo } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Student)
router.post('/', protect, restrictTo('student'), validateBooking, handleValidationErrors, async (req, res) => {
  try {
    const { courseId, sessionDate, paymentMethod } = req.body;

    // Get course details
    const course = await Course.findById(courseId).populate('tutor');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create booking
    const booking = await Booking.create({
      student: req.user._id,
      tutor: course.tutor._id,
      course: courseId,
      sessionDate,
      duration: course.duration,
      amount: course.price,
      paymentMethod,
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created. Please complete payment.',
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.userType === 'student') {
      query.student = req.user._id;
    } else if (req.userType === 'tutor') {
      query.tutor = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('student', 'firstName lastName email')
      .populate('tutor', 'firstName lastName email')
      .populate('course', 'title subject')
      .sort('-createdAt');

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('student', 'firstName lastName email phone')
      .populate('tutor', 'firstName lastName email phone')
      .populate('course');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (booking.student._id.toString() !== req.user._id.toString() &&
      booking.tutor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/bookings/:id/payment
// @desc    Update payment status
// @access  Private
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const { transactionId, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.transactionId = transactionId;
    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json({ success: true, message: 'Payment status updated', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/bookings/:id/complete
// @desc    Mark booking as completed
// @access  Private (Tutor)
router.put('/:id/complete', protect, restrictTo('tutor'), async (req, res) => {
  try {
    const { recordingUrl } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    booking.status = 'completed';
    if (recordingUrl) booking.recordingUrl = recordingUrl;
    await booking.save();

    res.json({ success: true, message: 'Booking marked as completed', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (booking.student.toString() !== req.user._id.toString() &&
      booking.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
