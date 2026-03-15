const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');

// @route   GET /api/resources
// @desc    Get all resources (free or premium based on user)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, gradeLevel, type, accessLevel } = req.query;

    let sql = 'SELECT * FROM resources WHERE 1=1';
    const params = [];

    if (subject) {
      sql += ' AND subject = ?';
      params.push(subject);
    }

    if (gradeLevel) {
      sql += ' AND grade_level = ?';
      params.push(gradeLevel);
    }

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (accessLevel) {
      sql += ' AND access_level = ?';
      params.push(accessLevel);
    }

    sql += ' ORDER BY created_at DESC';

    const resources = await query(sql, params);

    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/free
// @desc    Get all free resources
// @access  Public
router.get('/free', async (req, res) => {
  try {
    const resources = await query(
      'SELECT * FROM resources WHERE access_level = "free" ORDER BY created_at DESC'
    );
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    console.error('Get free resources error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/premium
// @desc    Get all premium resources
// @access  Public (for now)
router.get('/premium', async (req, res) => {
  try {
    const resources = await query(
      'SELECT * FROM resources WHERE access_level = "premium" ORDER BY created_at DESC'
    );
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    console.error('Get premium resources error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/aastu
// @desc    Get all AASTU resources
// @access  Public
router.get('/aastu', async (req, res) => {
  try {
    const resources = await query(
      'SELECT * FROM resources WHERE is_aastu = TRUE ORDER BY created_at DESC'
    );
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    console.error('Get AASTU resources error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const [resource] = await query('SELECT * FROM resources WHERE id = ?', [req.params.id]);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Increment download count
    await query('UPDATE resources SET downloads = downloads + 1 WHERE id = ?', [req.params.id]);

    res.json({ success: true, resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/subject/:subject
// @desc    Get resources by subject
// @access  Public
router.get('/subject/:subject', async (req, res) => {
  try {
    const resources = await query(
      'SELECT * FROM resources WHERE subject = ? ORDER BY created_at DESC',
      [req.params.subject]
    );
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    console.error('Get resources by subject error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/resources/grade/:grade
// @desc    Get resources by grade level
// @access  Public
router.get('/grade/:grade', async (req, res) => {
  try {
    const resources = await query(
      'SELECT * FROM resources WHERE grade_level = ? ORDER BY created_at DESC',
      [req.params.grade]
    );
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    console.error('Get resources by grade error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
