const express = require('express');
const router = express.Router();
const ExitExam = require('../models/ExitExam');
const { protect, restrictTo } = require('../middleware/auth');

// @route   POST /api/admin/exit-exams
// @desc    Create a new exit exam
// @access  Private (Admin)
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const examData = {
      ...req.body,
      uploadedBy: req.user._id,
      uploaderModel: 'Admin'
    };

    const exam = await ExitExam.create(examData);

    res.status(201).json({
      success: true,
      message: 'Exit exam created successfully',
      exam
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/exit-exams
// @desc    Get all exit exams (admin view)
// @access  Private (Admin)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const exams = await ExitExam.find().sort('-createdAt');
    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/exit-exams/:id
// @desc    Update an exit exam
// @access  Private (Admin)
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const exam = await ExitExam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/admin/exit-exams/:id
// @desc    Delete an exit exam
// @access  Private (Admin)
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const exam = await ExitExam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/exit-exams/statistics
// @desc    Get exit exam statistics
// @access  Private (Admin)
router.get('/stats/overview', protect, restrictTo('admin'), async (req, res) => {
  try {
    const totalExams = await ExitExam.countDocuments();
    const mockExams = await ExitExam.countDocuments({ examType: 'mock' });
    const freeExams = await ExitExam.countDocuments({ accessLevel: 'free' });
    const premiumExams = await ExitExam.countDocuments({ accessLevel: 'premium' });

    res.json({
      success: true,
      stats: {
        totalExams,
        mockExams,
        freeExams,
        premiumExams
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
