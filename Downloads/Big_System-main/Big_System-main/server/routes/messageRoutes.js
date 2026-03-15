const express = require('express');
const router = express.Router();
const {
  query
} = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');

// Auth middleware
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/messages/send
// @desc    Send a message
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    console.log('📨 Message send request:', {
      user: { id: req.user.id, type: req.user.userType },
      body: req.body
    });

    const {
      receiverId,
      receiverType,
      message,
      conversationId: providedConvId
    } = req.body;

    if (!receiverId || !receiverType || !message) {
      console.log('❌ Missing required fields:', { receiverId, receiverType, message });
      return res.status(400).json({
        error: 'Please provide all required fields'
      });
    }

    // First, create or get conversation
    let conversationId = providedConvId;
    let isAdminInvolved = false;

    try {
      if (conversationId) {
        // For existing conversation, verify user has access
        const [conv] = await query(
          `SELECT id, student_id, tutor_id, admin_joined, admin_id 
           FROM conversations 
           WHERE id = ? AND (
             student_id = ? OR 
             tutor_id = ? OR 
             (admin_joined = 1 AND (admin_id = ? OR ? = 'admin'))
           )`,
          [conversationId, req.user.id, req.user.id, req.user.id, req.user.userType]
        );

        if (!conv) {
          return res.status(403).json({
            error: 'Not authorized to access this conversation'
          });
        }

        isAdminInvolved = conv.admin_joined === 1;
      } else if (req.user.userType === 'student' && receiverType === 'tutor') {
        console.log('🎓 Student sending message to tutor:', { studentId: req.user.id, tutorId: receiverId });
        const [conv] = await query(
          `SELECT id, admin_joined FROM conversations 
           WHERE student_id = ? AND tutor_id = ?`,
          [req.user.id, receiverId]
        );

        if (conv) {
          conversationId = conv.id;
          isAdminInvolved = conv.admin_joined === 1;
          console.log('✅ Found existing conversation:', conversationId);
        } else {
          console.log('🆕 Creating new conversation...');
          const result = await query(
            `INSERT INTO conversations (student_id, tutor_id, last_message_at) 
             VALUES (?, ?, NOW())`,
            [req.user.id, receiverId]
          );
          conversationId = result.insertId;
          console.log('✅ Created new conversation with ID:', conversationId);
        }
      } else if (req.user.userType === 'tutor' && receiverType === 'student') {
        console.log('👨‍🏫 Tutor sending message to student:', { tutorId: req.user.id, studentId: receiverId });
        const [conv] = await query(
          `SELECT id, admin_joined FROM conversations 
           WHERE student_id = ? AND tutor_id = ?`,
          [receiverId, req.user.id]
        );

        if (conv) {
          conversationId = conv.id;
          isAdminInvolved = conv.admin_joined === 1;
          console.log('✅ Found existing conversation:', conversationId);
        } else {
          console.log('🆕 Creating new conversation...');
          const result = await query(
            `INSERT INTO conversations (student_id, tutor_id, last_message_at) 
             VALUES (?, ?, NOW())`,
            [receiverId, req.user.id]
          );
          conversationId = result.insertId;
          console.log('✅ Created new conversation with ID:', conversationId);
        }
      } else if (req.user.userType === 'admin' && receiverType && receiverId) {
        // Admin starting a new conversation
        const [tutor] = await query('SELECT id FROM tutors WHERE id = ?', [receiverType === 'tutor' ? receiverId : null]);
        const [student] = await query('SELECT id FROM students WHERE id = ?', [receiverType === 'student' ? receiverId : null]);

        if (!tutor && !student) {
          return res.status(404).json({
            error: 'Recipient not found'
          });
        }

        const result = await query(
          `INSERT INTO conversations (
            student_id, tutor_id, admin_joined, admin_id, last_message_at
          ) VALUES (?, ?, 1, ?, NOW())`,
          [
            receiverType === 'student' ? receiverId : null,
            receiverType === 'tutor' ? receiverId : null,
            req.user.id
          ]
        );

        conversationId = result.insertId;
        isAdminInvolved = true;
      }
    } catch (err) {
      console.log('Conversation error:', err.message);
      return res.status(500).json({
        error: 'Failed to create conversation'
      });
    }

    // Insert message with conversation_id
    let sql, result;

    // Ensure conversationId is not null
    if (!conversationId) {
      console.error('❌ conversationId is null - cannot insert message');
      return res.status(500).json({
        error: 'Failed to create conversation for message'
      });
    }

    console.log('📝 Inserting message with conversationId:', conversationId);

    try {
      sql = `
        INSERT INTO messages (
          conversation_id, 
          sender_id, 
          sender_type, 
          receiver_id, 
          receiver_type,
          content,
          is_admin_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      result = await query(sql, [
        conversationId,
        req.user.id,
        req.user.userType,
        receiverId,
        receiverType,
        message,
        req.user.userType === 'admin' ? 1 : 0
      ]);
      console.log('✅ Message inserted successfully with ID:', result.insertId);
    } catch (err) {
      console.log('⚠️ Content column failed, trying message column:', err.message);
      // Fallback to message column if content doesn't exist
      sql = `
        INSERT INTO messages (
          conversation_id, 
          sender_id, 
          sender_type, 
          receiver_id, 
          receiver_type,
          message,
          is_admin_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      result = await query(sql, [
        conversationId,
        req.user.id,
        req.user.userType,
        receiverId,
        receiverType,
        message,
        req.user.userType === 'admin' ? 1 : 0
      ]);
      console.log('✅ Message inserted successfully with message column, ID:', result.insertId);
    }

    // Update conversation last_message_at and admin_joined if admin is involved
    try {
      if (req.user.userType === 'admin' && !isAdminInvolved) {
        await query(
          `UPDATE conversations 
           SET last_message_at = NOW(), 
               admin_joined = 1, 
               admin_id = ? 
           WHERE id = ?`,
          [req.user.id, conversationId]
        );
      } else {
        await query(
          `UPDATE conversations 
           SET last_message_at = NOW() 
           WHERE id = ?`,
          [conversationId]
        );
      }
    } catch (err) {
      console.log('Update conversation error:', err.message);
      // Continue even if update fails
    }

    // Create notifications
    try {
      // Notification for receiver
      await query(
        `INSERT INTO notifications (user_id, user_type, title, message, type, link)
         VALUES (?, ?, ?, ?, 'message', ?)`,
        [
          receiverId,
          receiverType,
          `New message from ${req.user.userType}`,
          message.length > 50 ? message.substring(0, 50) + '...' : message,
          `/messages/${conversationId}`
        ]
      );

      // If admin is involved but not the sender, notify admin
      if (isAdminInvolved && req.user.userType !== 'admin') {
        const [conv] = await query(
          `SELECT admin_id FROM conversations WHERE id = ?`,
          [conversationId]
        );

        if (conv && conv.admin_id) {
          await query(
            `INSERT INTO notifications (user_id, user_type, title, message, type, link)
             VALUES (?, 'admin', 'New message in conversation', ?, 'message', ?)`,
            [
              conv.admin_id,
              `New message in conversation #${conversationId}`,
              `/admin/messages/${conversationId}`
            ]
          );
        }
      }
    } catch (err) {
      console.log('Notification creation error:', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// @route   GET /api/messages/admin/all
// @desc    Get all conversations (Admin only)
// @access  Private (Admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    // Get all conversations with full details
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
        t.profile_photo as tutor_photo,
        s.full_name as student_name,
        s.email as student_email,
        s.profile_photo as student_photo,
        (SELECT COUNT(*) FROM messages 
         WHERE (sender_id = c.student_id AND sender_type = 'student' AND receiver_id = c.tutor_id)
            OR (sender_id = c.tutor_id AND sender_type = 'tutor' AND receiver_id = c.student_id)) as message_count,
        (SELECT COALESCE(message, content) FROM messages 
         WHERE (sender_id = c.student_id AND sender_type = 'student' AND receiver_id = c.tutor_id)
            OR (sender_id = c.tutor_id AND sender_type = 'tutor' AND receiver_id = c.student_id)
         ORDER BY created_at DESC LIMIT 1) as last_message
       FROM conversations c
       JOIN tutors t ON c.tutor_id = t.id
       JOIN students s ON c.student_id = s.id
       ORDER BY c.last_message_at DESC`
    );

    console.log(`Admin fetched ${conversations.length} conversations`);

    res.json({
      success: true,
      count: conversations.length,
      conversations: conversations || []
    });
  } catch (error) {
    console.error('Get all conversations error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      conversations: []
    });
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
          t.full_name as tutor_name,
          t.profile_photo as tutor_photo,
          t.specializations,
          (SELECT COALESCE(m.message, m.content) FROM messages m 
           WHERE m.conversation_id = c.id
           ORDER BY m.created_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages m 
           WHERE m.conversation_id = c.id AND m.receiver_id = ? AND m.receiver_type = 'student' AND m.is_read = FALSE) as unread_count
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
          s.full_name as student_name,
          s.profile_photo as student_photo,
          (SELECT COALESCE(m.message, m.content) FROM messages m 
           WHERE m.conversation_id = c.id
           ORDER BY m.created_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages m 
           WHERE m.conversation_id = c.id AND m.receiver_id = ? AND m.receiver_type = 'tutor' AND m.is_read = FALSE) as unread_count
         FROM conversations c
         JOIN students s ON c.student_id = s.id
         WHERE c.tutor_id = ?
         ORDER BY c.last_message_at DESC`,
        [req.user.id, req.user.id]
      );
    }

    res.json({
      success: true,
      count: conversations?.length || 0,
      conversations: conversations || []
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      conversations: []
    });
  }
});

// @route   GET /api/messages/:userId/:userType
// @desc    Get messages with a specific user
// @access  Private
router.get('/:userId/:userType', protect, async (req, res) => {
  try {
    const {
      userId,
      userType
    } = req.params;

    const messages = await query(
      `SELECT 
        m.*,
        COALESCE(m.message, m.content) as message,
        CASE 
          WHEN m.sender_type = 'student' THEN s.full_name
          WHEN m.sender_type = 'tutor' THEN t.full_name
        END as sender_name,
        CASE 
          WHEN m.sender_type = 'student' THEN s.profile_photo
          WHEN m.sender_type = 'tutor' THEN t.profile_photo
        END as sender_photo
       FROM messages m
       LEFT JOIN students s ON m.sender_type = 'student' AND m.sender_id = s.id
       LEFT JOIN tutors t ON m.sender_type = 'tutor' AND m.sender_id = t.id
       WHERE m.conversation_id = (
         SELECT id FROM conversations 
         WHERE (
           (student_id = ? AND tutor_id = ?) OR
           (student_id = ? AND tutor_id = ?)
         )
         LIMIT 1
       )
       ORDER BY m.created_at ASC`,
      [
        req.user.id, userId,
        userId, req.user.id
      ]
    );

    // Mark messages as read using conversation_id
    await query(
      `UPDATE messages 
       SET is_read = TRUE 
       WHERE conversation_id = (
         SELECT id FROM conversations 
         WHERE (
           (student_id = ? AND tutor_id = ?) OR
           (student_id = ? AND tutor_id = ?)
         )
         LIMIT 1
       ) AND receiver_id = ? AND receiver_type = ?`,
      [
        req.user.id, userId,
        userId, req.user.id,
        req.user.id, req.user.userType
      ]
    );

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// @route   GET /api/messages/admin/conversation/:conversationId
// @desc    Get conversation messages (Admin only)
// @access  Private (Admin)
router.get('/admin/conversation/:conversationId', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    // Get conversation details
    const [conversation] = await query(
      `SELECT 
        c.*,
        t.full_name as tutor_name,
        t.email as tutor_email,
        t.profile_photo as tutor_photo,
        t.profile_photo as tutor_photo,
        s.full_name as student_name,
        s.email as student_email,
        s.profile_photo as student_photo
       FROM conversations c
       JOIN tutors t ON c.tutor_id = t.id
       JOIN students s ON c.student_id = s.id
       WHERE c.id = ?`,
      [req.params.conversationId]
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Get all messages in this conversation
    // Use conversation_id for reliable message retrieval
    let messages;
    try {
      messages = await query(
        `SELECT 
          m.*,
          COALESCE(m.message, m.content) as message,
          CASE 
            WHEN m.sender_type = 'student' THEN s.full_name
            WHEN m.sender_type = 'tutor' THEN t.full_name
            WHEN m.sender_type = 'admin' THEN 'Administrator'
          END as sender_name,
          CASE 
            WHEN m.sender_type = 'student' THEN s.profile_photo
            WHEN m.sender_type = 'tutor' THEN t.profile_photo
            WHEN m.sender_type = 'admin' THEN NULL
          END as sender_photo
         FROM messages m
         LEFT JOIN students s ON m.sender_type = 'student' AND m.sender_id = s.id
         LEFT JOIN tutors t ON m.sender_type = 'tutor' AND m.sender_id = t.id
         WHERE m.conversation_id = ?
         ORDER BY m.created_at ASC`,
        [req.params.conversationId]
      );
    } catch (err) {
      console.log('Error fetching by conversation_id, trying fallback:', err.message);
      // Fallback to sender/receiver pattern if conversation_id doesn't work
      messages = await query(
        `SELECT 
          m.*,
          COALESCE(m.message, m.content) as message,
          CASE 
            WHEN m.sender_type = 'student' THEN s.full_name
            WHEN m.sender_type = 'tutor' THEN t.full_name
            WHEN m.sender_type = 'admin' THEN 'Administrator'
          END as sender_name,
          CASE 
            WHEN m.sender_type = 'student' THEN s.profile_photo
            WHEN m.sender_type = 'tutor' THEN t.profile_photo
            WHEN m.sender_type = 'admin' THEN NULL
          END as sender_photo
         FROM messages m
         LEFT JOIN students s ON m.sender_type = 'student' AND m.sender_id = s.id
         LEFT JOIN tutors t ON m.sender_type = 'tutor' AND m.sender_id = t.id
         WHERE 
           (m.sender_id = ? AND m.sender_type = 'student' AND m.receiver_id = ? AND m.receiver_type = 'tutor')
           OR
           (m.sender_id = ? AND m.sender_type = 'tutor' AND m.receiver_id = ? AND m.receiver_type = 'student')
           OR
           (m.sender_id = ? AND m.sender_type = 'admin' AND (
             (m.receiver_id = ? AND m.receiver_type = 'student') OR
             (m.receiver_id = ? AND m.receiver_type = 'tutor')
           ))
           OR
           ((m.sender_id = ? AND m.sender_type = 'student') OR (m.sender_id = ? AND m.sender_type = 'tutor')) 
           AND m.receiver_type = 'admin'
         ORDER BY m.created_at ASC`,
        [
          conversation.student_id, conversation.tutor_id,
          conversation.tutor_id, conversation.student_id,
          conversation.admin_id, conversation.student_id, conversation.tutor_id,
          conversation.student_id, conversation.tutor_id
        ]
      );
    }

    console.log(`Admin viewing conversation ${req.params.conversationId}: ${messages.length} messages`);

    res.json({
      success: true,
      conversation,
      messages: messages || []
    });
  } catch (error) {
    console.error('Get conversation messages error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      messages: []
    });
  }
});

// @route   PUT /api/messages/admin/commission/:conversationId
// @desc    Mark commission as paid (Admin only)
// @access  Private (Admin)
router.put('/admin/commission/:conversationId', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    await query(
      'UPDATE conversations SET commission_paid = TRUE WHERE id = ?',
      [req.params.conversationId]
    );

    await query(
      'UPDATE tutor_students SET commission_paid = TRUE, payment_date = NOW() WHERE id = ?',
      [req.params.conversationId]
    ).catch(() => { }); // Ignore if table doesn't exist

    res.json({
      success: true,
      message: 'Commission marked as paid'
    });
  } catch (error) {
    console.error('Mark commission paid error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// @route   DELETE /api/messages/admin/conversation/:conversationId
// @desc    Delete a conversation and all its messages (Admin only)
// @access  Private (Admin)
router.delete('/admin/conversation/:conversationId', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const conversationId = req.params.conversationId;

    // First, verify conversation exists
    const [conversation] = await query(
      'SELECT id FROM conversations WHERE id = ?',
      [conversationId]
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Delete all messages in this conversation
    // Check if messages table uses conversation_id or sender/receiver pattern
    try {
      // Try deleting by conversation_id first
      await query(
        'DELETE FROM messages WHERE conversation_id = ?',
        [conversationId]
      );
    } catch (err) {
      // If conversation_id doesn't exist, delete by matching sender/receiver
      const [conv] = await query(
        'SELECT student_id, tutor_id FROM conversations WHERE id = ?',
        [conversationId]
      );

      if (conv) {
        await query(
          `DELETE FROM messages 
           WHERE (sender_id = ? AND sender_type = 'student' AND receiver_id = ? AND receiver_type = 'tutor')
              OR (sender_id = ? AND sender_type = 'tutor' AND receiver_id = ? AND receiver_type = 'student')`,
          [conv.student_id, conv.tutor_id, conv.tutor_id, conv.student_id]
        );
      }
    }

    // Delete the conversation
    await query('DELETE FROM conversations WHERE id = ?', [conversationId]);

    console.log(`Admin deleted conversation ${conversationId}`);

    res.json({
      success: true,
      message: 'Conversation and all messages deleted successfully'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/messages/admin/debug
// @desc    Debug endpoint to check data (Admin only)
// @access  Private (Admin)
router.get('/admin/debug', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    const conversationsCount = await query('SELECT COUNT(*) as count FROM conversations');
    const messagesCount = await query('SELECT COUNT(*) as count FROM messages');
    const studentsCount = await query('SELECT COUNT(*) as count FROM students');
    const tutorsCount = await query('SELECT COUNT(*) as count FROM tutors');

    const recentMessages = await query(
      `SELECT 
        m.id,
        m.sender_type,
        m.receiver_type,
        m.message,
        m.created_at
       FROM messages m
       ORDER BY m.created_at DESC
       LIMIT 5`
    );

    const conversationsSample = await query(
      `SELECT 
        c.id,
        c.student_id,
        c.tutor_id,
        c.last_message_at
       FROM conversations c
       LIMIT 5`
    );

    res.json({
      success: true,
      debug: {
        conversations: conversationsCount[0].count,
        messages: messagesCount[0].count,
        students: studentsCount[0].count,
        tutors: tutorsCount[0].count,
        recentMessages,
        conversationsSample
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;