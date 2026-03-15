const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect, checkPremium } = require('../middleware/auth');

// @route   GET /api/resources
// @desc    Get all resources (free or premium based on user)
// @access  Public/Private
router.get('/', async (req, res) => {
  try {
    const { subject, gradeLevel, type, accessLevel } = req.query;

    let query = {};

    if (subject) query.subject = subject;
    if (gradeLevel) query.gradeLevel = gradeLevel;
    if (type) query.type = type;

    // If not authenticated or not premium, only show free resources
    if (!req.headers.authorization || accessLevel === 'free') {
      query.accessLevel = 'free';
    } else if (accessLevel === 'premium') {
      query.accessLevel = 'premium';
    }

    const resources = await Resource.find(query).sort('-createdAt');

    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/free
// @desc    Get all free resources
// @access  Public
router.get('/free', async (req, res) => {
  try {
    const resources = await Resource.find({ accessLevel: 'free' }).sort('-createdAt');
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/premium
// @desc    Get all premium resources
// @access  Private (Premium users)
router.get('/premium', protect, checkPremium, async (req, res) => {
  try {
    const resources = await Resource.find({ accessLevel: 'premium' }).sort('-createdAt');
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/aastu
// @desc    Get AASTU past papers
// @access  Private (Premium users)
router.get('/aastu', protect, checkPremium, async (req, res) => {
  try {
    const resources = await Resource.find({
      isAASTU: true,
      accessLevel: 'premium'
    }).sort('-createdAt');

    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public/Private (based on access level)
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check if premium resource requires authentication
    if (resource.accessLevel === 'premium') {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Premium subscription required' });
      }
    }

    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/resources/:id/download
// @desc    Download resource (increment download count)
// @access  Public/Private
router.post('/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    res.json({
      success: true,
      message: 'Download started',
      downloadUrl: resource.fileUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/resources
// @desc    Create a new resource (Admin/Tutor)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, type, subject, gradeLevel, accessLevel, fileUrl, fileSize, isAASTU } = req.body;

    const resource = await Resource.create({
      title,
      description,
      type,
      subject,
      gradeLevel,
      accessLevel,
      fileUrl,
      fileSize,
      isAASTU,
      uploadedBy: req.user._id,
      uploaderModel: req.userType === 'tutor' ? 'Tutor' : 'Admin'
    });

    res.status(201).json({ success: true, message: 'Resource created successfully', resource });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
