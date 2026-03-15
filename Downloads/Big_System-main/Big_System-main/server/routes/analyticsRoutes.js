const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/growth', protect, adminOnly, async (req, res) => {
  try {
    const studentGrowth = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM students 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    const tutorGrowth = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM tutors 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    res.json({
      success: true,
      data: {
        studentGrowth,
        tutorGrowth
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/revenue', protect, adminOnly, async (req, res) => {
  try {
    const revenueStreams = await query(`
      SELECT payment_type, SUM(amount) as total
      FROM payment_verifications
      WHERE status = 'approved'
      GROUP BY payment_type
    `);

    const dailyRevenue = await query(`
      SELECT DATE(created_at) as date, SUM(amount) as total
      FROM payment_verifications
      WHERE status = 'approved' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    res.json({ success: true, streams: revenueStreams, daily: dailyRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
