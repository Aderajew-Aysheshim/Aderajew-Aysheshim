const express = require('express');
const router = express.Router();
const PaymentVerification = require('../models/PaymentVerification');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, restrictTo } = require('../middleware/auth');

// Configure multer for screenshot uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/payment-screenshots';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(jpeg|jpg|png|gif|webp)|application\/pdf/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPG, PNG, GIF, WEBP) and PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// @route   POST /api/payment-verification/upload
// @desc    Upload payment screenshot
// @access  Private (Student/Tutor)
router.post('/upload', protect, upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a payment screenshot' });
    }

    const { paymentType, amount, paymentMethod, transactionReference } = req.body;

    if (!paymentType || !amount || !paymentMethod || !transactionReference) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const screenshotUrl = `/uploads/payment-screenshots/${req.file.filename}`;

    const verification = await PaymentVerification.create({
      user: req.user._id,
      userModel: req.userType === 'student' ? 'Student' : 'Tutor',
      paymentType,
      amount,
      paymentMethod,
      transactionReference,
      screenshotUrl
    });

    res.status(201).json({
      success: true,
      message: 'Payment screenshot uploaded successfully. Awaiting admin verification.',
      verification
    });
  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/payment-verification/my-submissions
// @desc    Get user's payment submissions
// @access  Private (Student/Tutor)
router.get('/my-submissions', protect, async (req, res) => {
  try {
    const verifications = await PaymentVerification.find({
      user: req.user._id,
      userModel: req.userType === 'student' ? 'Student' : 'Tutor'
    }).sort('-createdAt');

    res.json({ success: true, count: verifications.length, verifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/payment-verification/pending
// @desc    Get all pending payment verifications (Admin)
// @access  Private (Admin)
router.get('/pending', protect, restrictTo('admin'), async (req, res) => {
  try {
    const verifications = await PaymentVerification.find({ status: 'pending' })
      .populate('user', 'firstName lastName email')
      .sort('-createdAt');

    res.json({ success: true, count: verifications.length, verifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/payment-verification/all
// @desc    Get all payment verifications (Admin)
// @access  Private (Admin)
router.get('/all', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const verifications = await PaymentVerification.find(query)
      .populate('user', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort('-createdAt');

    res.json({ success: true, count: verifications.length, verifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/payment-verification/:id/approve
// @desc    Approve payment verification
// @access  Private (Admin)
router.put('/:id/approve', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const verification = await PaymentVerification.findById(req.params.id)
      .populate('user');

    if (!verification) {
      return res.status(404).json({ error: 'Payment verification not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ error: 'This payment has already been reviewed' });
    }

    verification.status = 'approved';
    verification.adminNotes = adminNotes;
    verification.reviewedBy = req.user._id;
    verification.reviewedAt = new Date();
    await verification.save();

    // Update user subscription/status based on payment type
    if (verification.paymentType === 'subscription' && verification.userModel === 'Student') {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

      await Student.findByIdAndUpdate(verification.user._id, {
        subscriptionStatus: 'premium',
        subscriptionExpiry: expiryDate
      });
    } else if (verification.paymentType === 'tutor-activation' && verification.userModel === 'Tutor') {
      await Tutor.findByIdAndUpdate(verification.user._id, {
        isVerified: true,
        subscriptionStatus: 'premium'
      });
    }

    res.json({
      success: true,
      message: 'Payment approved successfully',
      verification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/payment-verification/:id/reject
// @desc    Reject payment verification
// @access  Private (Admin)
router.put('/:id/reject', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const verification = await PaymentVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({ error: 'Payment verification not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ error: 'This payment has already been reviewed' });
    }

    verification.status = 'rejected';
    verification.adminNotes = adminNotes || 'Payment verification rejected';
    verification.reviewedBy = req.user._id;
    verification.reviewedAt = new Date();
    await verification.save();

    res.json({
      success: true,
      message: 'Payment rejected',
      verification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/payment-verification/statistics
// @desc    Get payment verification statistics (Admin)
// @access  Private (Admin)
router.get('/statistics', protect, restrictTo('admin'), async (req, res) => {
  try {
    const totalPending = await PaymentVerification.countDocuments({ status: 'pending' });
    const totalApproved = await PaymentVerification.countDocuments({ status: 'approved' });
    const totalRejected = await PaymentVerification.countDocuments({ status: 'rejected' });

    const tutorActivations = await PaymentVerification.countDocuments({
      paymentType: 'tutor-activation',
      status: 'approved'
    });

    const subscriptions = await PaymentVerification.countDocuments({
      paymentType: 'subscription',
      status: 'approved'
    });

    res.json({
      success: true,
      statistics: {
        totalPending,
        totalApproved,
        totalRejected,
        tutorActivations,
        subscriptions
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
