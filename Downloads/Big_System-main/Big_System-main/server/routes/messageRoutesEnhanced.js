const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/message-files';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'msg-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|mp3|mp4|wav/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type!'));
    }
  }
});

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

// @route   POST /api/messages/send
// @desc    Send a message with optional file attachment
// @access  Private
router.post('/send', protect, upload.single('file'), async (req, res) => {
  try {
    const { receiverId, receiverType, message, replyToId } = req.body;

    if (!receiverId || !receiverType || (!message && !req.file)) {
      return res.status(400).json({ error: 'Please provide required fields' });
    }

    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (req.file) {
      fileUrl = `/uploads/message-files/${req.file.filename}`;
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
    }

    // Insert message
    const sql = `
      INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, message, file_url, file_name, file_type, reply_to_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      req.user.id,
      req.user.userType,
      receiverId,
      receiverType,
      message || '',
      fileUrl,
      fileName,
      fileType,
      replyToId || null
    ]);

    // Create or update conversation
    if (req.user.userType === 'student' && receiverType === 'tutor') {
      await query(
        `INSERT INTO conversations (student_id, tutor_id, last_message_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE last_message_at = NOW()`,
        [req.user.id, receiverId]
      );

      await query(
        `INSERT INTO tutor_students (tutor_id, student_id, first_contact_date)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE tutor_id = tutor_id`,
        [receiverId, req.user.id]
      );
    } else if (req.user.userType === 'tutor' && receiverType === 'student') {
      await query(
        `INSERT INTO conversations (student_id, tutor_id, last_message_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE last_message_at = NOW()`,
        [receiverId, req.user.id]
      );

      await query(
        `INSERT INTO tutor_students (tutor_id, student_id, first_contact_date)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE tutor_id = tutor_id`,
        [req.user.id, receiverId]
      );
    }

    // Create notification
    await query(
      `INSERT INTO notifications (user_id, user_type, title, message, type, link)
       VALUES (?, ?, ?, ?, 'message', ?)`,
      [
        receiverId,
        receiverType,
        'New Message',
        `You have a new message`,
        `/messages`
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Send message error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/messages/:messageId/react
// @desc    Add reaction to a message
// @access  Private
router.post('/:messageId/react', protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ error: 'Emoji is required' });
    }

    // Check if reaction already exists
    const existing = await query(
      'SELECT id FROM message_reactions WHERE message_id = ? AND user_id = ? AND user_type = ?',
      [messageId, req.user.id, req.user.userType]
    );

    if (existing.length > 0) {
      // Update existing reaction
      await query(
        'UPDATE message_reactions SET emoji = ? WHERE id = ?',
        [emoji, existing[0].id]
      );
    } else {
      // Insert new reaction
      await query(
        'INSERT INTO message_reactions (message_id, user_id, user_type, emoji) VALUES (?, ?, ?, ?)',
        [messageId, req.user.id, req.user.userType, emoji]
      );
    }

    res.json({ success: true, message: 'Reaction added' });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/:messageId', protect, async (req, res) => {
  try {
    const { messageId } = req.params;

    // Check if user owns the message
    const [message] = await query(
      'SELECT * FROM messages WHERE id = ? AND sender_id = ? AND sender_type = ?',
      [messageId, req.user.id, req.user.userType]
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }

    // Delete file if exists
    if (message.file_url) {
      const filePath = path.join(__dirname, '..', message.file_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Soft delete - mark as deleted
    await query(
      'UPDATE messages SET message = "[Message deleted]", file_url = NULL, file_name = NULL, deleted_at = NOW() WHERE id = ?',
      [messageId]
    );

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/messages/:messageId
// @desc    Edit a message
// @access  Private
router.put('/:messageId', protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Check if user owns the message
    const [existing] = await query(
      'SELECT * FROM messages WHERE id = ? AND sender_id = ? AND sender_type = ?',
      [messageId, req.user.id, req.user.userType]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }

    // Update message
    await query(
      'UPDATE messages SET message = ?, edited = TRUE, edited_at = NOW() WHERE id = ?',
      [message, messageId]
    );

    res.json({ success: true, message: 'Message updated' });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/messages/:messageId/pin
// @desc    Pin/unpin a message
// @access  Private
router.post('/:messageId/pin', protect, async (req, res) => {
  try {
    const { messageId } = req.params;

    const [message] = await query('SELECT pinned FROM messages WHERE id = ?', [messageId]);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await query(
      'UPDATE messages SET pinned = ? WHERE id = ?',
      [!message.pinned, messageId]
    );

    res.json({
      success: true,
      message: message.pinned ? 'Message unpinned' : 'Message pinned',
      pinned: !message.pinned
    });
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    let conversations;

    if (req.user.userType === 'student') {
      conversations = await query(
        `SELECT 
          c.id,
          c.tutor_id,
          c.last_message_at,
          c.last_message_at,
          t.full_name as tutor_name,
          t.profile_photo as tutor_photo,
          t.specializations,
          (SELECT message FROM messages 
           WHERE (sender_id = c.student_id AND sender_type = 'student' AND receiver_id = c.tutor_id AND receiver_type = 'tutor')
              OR (sender_id = c.tutor_id AND sender_type = 'tutor' AND receiver_id = c.student_id AND receiver_type = 'student')
           ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages 
           WHERE receiver_id = ? AND receiver_type = 'student' AND sender_id = c.tutor_id AND is_read = FALSE) as unread_count
         FROM conversations c
         JOIN tutors t ON c.tutor_id = t.id
         WHERE c.student_id = ?
         ORDER BY c.last_message_at DESC`,
        [req.user.id, req.user.id]
      );
    } else if (req.user.userType === 'tutor') {
      conversations = await query(
        `SELECT 
          c.id,
          c.student_id,
          c.last_message_at,
          c.last_message_at,
          s.full_name as student_name,
          s.profile_photo as student_photo,
          s.grade_level,
          (SELECT message FROM messages 
           WHERE (sender_id = c.student_id AND sender_type = 'student' AND receiver_id = c.tutor_id AND receiver_type = 'tutor')
              OR (sender_id = c.tutor_id AND sender_type = 'tutor' AND receiver_id = c.student_id AND receiver_type = 'student')
           ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages 
           WHERE receiver_id = ? AND receiver_type = 'tutor' AND sender_id = c.student_id AND is_read = FALSE) as unread_count
         FROM conversations c
         JOIN students s ON c.student_id = s.id
         WHERE c.tutor_id = ?
         ORDER BY c.last_message_at DESC`,
        [req.user.id, req.user.id]
      );
    }

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/messages/:userId/:userType
// @desc    Get messages with a specific user (with reactions)
// @access  Private
router.get('/:userId/:userType', protect, async (req, res) => {
  try {
    const { userId, userType } = req.params;

    const messages = await query(
      `SELECT 
        m.*,
        CASE 
          WHEN m.sender_type = 'student' THEN s.full_name
          WHEN m.sender_type = 'tutor' THEN t.full_name
        END as sender_name,
        CASE 
          WHEN m.sender_type = 'student' THEN s.profile_photo
          WHEN m.sender_type = 'tutor' THEN t.profile_photo
        END as sender_photo,
        reply.message as reply_to_message
       FROM messages m
       LEFT JOIN students s ON m.sender_type = 'student' AND m.sender_id = s.id
       LEFT JOIN tutors t ON m.sender_type = 'tutor' AND m.sender_id = t.id
       LEFT JOIN messages reply ON m.reply_to_id = reply.id
       WHERE 
         (m.sender_id = ? AND m.sender_type = ? AND m.receiver_id = ? AND m.receiver_type = ?)
         OR
         (m.sender_id = ? AND m.sender_type = ? AND m.receiver_id = ? AND m.receiver_type = ?)
       ORDER BY m.created_at ASC`,
      [
        req.user.id, req.user.userType, userId, userType,
        userId, userType, req.user.id, req.user.userType
      ]
    );

    // Get reactions for each message
    for (let msg of messages) {
      const reactions = await query(
        `SELECT emoji, COUNT(*) as count 
         FROM message_reactions 
         WHERE message_id = ? 
         GROUP BY emoji`,
        [msg.id]
      );
      msg.reactions = reactions;
    }

    // Mark messages as read
    await query(
      `UPDATE messages 
       SET is_read = TRUE 
       WHERE receiver_id = ? AND receiver_type = ? AND sender_id = ? AND sender_type = ?`,
      [req.user.id, req.user.userType, userId, userType]
    );

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/messages/admin/all
// @desc    Get all conversations (Admin only)
// @access  Private (Admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const conversations = await query(
      `SELECT 
        c.id,
        c.tutor_id,
        c.student_id,
        c.last_message_at,
        c.commission_paid,
        c.commission_amount,
        t.full_name as tutor_name,
        t.email as tutor_email,
        s.full_name as student_name,
        s.last_name as student_last_name,
        s.email as student_email,
        (SELECT COUNT(*) FROM messages 
         WHERE (sender_id = c.student_id AND sender_type = 'student' AND receiver_id = c.tutor_id)
            OR (sender_id = c.tutor_id AND sender_type = 'tutor' AND receiver_id = c.student_id)) as message_count
       FROM conversations c
       JOIN tutors t ON c.tutor_id = t.id
       JOIN students s ON c.student_id = s.id
       ORDER BY c.last_message_at DESC`
    );

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Get all conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
