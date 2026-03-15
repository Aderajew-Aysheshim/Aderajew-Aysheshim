const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');

// Auth middleware
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, userType: decoded.userType };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized' });
  }
};

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await query(
      `SELECT * FROM notifications 
       WHERE user_id = ? AND user_type = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id, req.user.userType]
    );

    const unreadCount = await query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
      [req.user.id, req.user.userType]
    );

    res.json({
      success: true,
      notifications,
      unreadCount: unreadCount[0].count
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    await query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE id = ? AND user_id = ? AND user_type = ?`,
      [req.params.id, req.user.id, req.user.userType]
    );

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE user_id = ? AND user_type = ?`,
      [req.user.id, req.user.userType]
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    await query(
      `DELETE FROM notifications 
       WHERE id = ? AND user_id = ? AND user_type = ?`,
      [req.params.id, req.user.id, req.user.userType]
    );

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/notifications/clear-all
// @desc    Clear all notifications
// @access  Private
router.delete('/clear-all', protect, async (req, res) => {
  try {
    await query(
      `DELETE FROM notifications 
       WHERE user_id = ? AND user_type = ?`,
      [req.user.id, req.user.userType]
    );

    res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
