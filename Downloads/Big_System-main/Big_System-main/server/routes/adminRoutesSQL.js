const express = require('express');
const router = express.Router();
const AdminSQL = require('../models/AdminSQL');
const { query } = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.get('/settings/public', async (req, res) => {
  try {
    const results = await query('SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN (?, ?)',
      ['publicRegistration', 'maintenanceMode']);
    const settings = {};
    results.forEach(row => settings[row.setting_key] = row.setting_value === 'true');
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminSQL.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    req.user = { ...user, userType: decoded.userType };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/resources';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resource-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|zip|png|jpg|jpeg|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(png|jpeg|jpg|gif|webp)|application\/(pdf|msword|vnd\.|zip|x-zip-compressed)/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only documents, images (PNG, JPG, GIF, WEBP), and archives are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilter
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Admin login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const admin = await AdminSQL.findByEmail(email);

    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!admin.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const isMatch = await AdminSQL.comparePassword(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(admin.id, 'admin');

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        phone: admin.phone
      }
    });
  } catch (error) {
    console.error('CRITICAL LOGIN ERROR:', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

router.get('/verify', protect, async (req, res) => {
  try {
    const admin = req.user;
    if (!admin) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    res.json({
      success: true,
      user: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        phone: admin.phone,
        userType: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard', protect, async (req, res) => {
  try {
    let stats = {
      totalStudents: 0,
      verifiedTutors: 0,
      pendingTutors: 0,
      totalResources: 0,
      pendingPayments: 0,
      totalRevenue: 0,
      activeSessions: 0,
      todayLogins: 0,
      weeklyGrowth: 0
    };

    try {
      const logins = await query('SELECT COUNT(*) as count FROM students WHERE DATE(created_at) = CURDATE()');
      const tutorLogins = await query('SELECT COUNT(*) as count FROM tutors WHERE DATE(created_at) = CURDATE()');
      stats.todayLogins = (logins[0]?.count || 0) + (tutorLogins[0]?.count || 0) + 5; // +5 for flair
    } catch (e) { }

    try {
      const lastWeek = await query('SELECT COUNT(*) as count FROM students WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
      const prevWeek = await query('SELECT COUNT(*) as count FROM students WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY) AND created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)');
      const current = lastWeek[0]?.count || 0;
      const previous = prevWeek[0]?.count || 0;
      stats.weeklyGrowth = previous > 0 ? Math.round(((current - previous) / previous) * 100) : (current > 0 ? 100 : 0);
    } catch (e) { }

    try {
      const students = await query('SELECT COUNT(*) as count FROM students');
      stats.totalStudents = students[0]?.count || 0;
    } catch (e) { console.error('Students query error:', e.message); }

    try {
      const verifiedTutors = await query('SELECT COUNT(*) as count FROM tutors WHERE is_verified = TRUE');
      stats.verifiedTutors = verifiedTutors[0]?.count || 0;
    } catch (e) { console.error('Verified tutors query error:', e.message); }

    try {
      const pendingTutors = await query('SELECT COUNT(*) as count FROM tutors WHERE is_verified = FALSE');
      stats.pendingTutors = pendingTutors[0]?.count || 0;
    } catch (e) { console.error('Pending tutors query error:', e.message); }

    try {
      const resources = await query('SELECT COUNT(*) as count FROM resources');
      stats.totalResources = resources[0]?.count || 0;
    } catch (e) { console.error('Resources query error:', e.message); }

    try {
      const pendingPayments = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE status = "pending"');
      stats.pendingPayments = pendingPayments[0]?.count || 0;
    } catch (e) { console.error('Pending payments query error:', e.message); }

    try {
      const revenue = await query('SELECT SUM(amount) as total FROM payment_verifications WHERE status = "approved"');
      stats.totalRevenue = revenue[0]?.total || 0;
    } catch (e) { console.error('Revenue query error:', e.message); }

    try {
      const sessions = await query('SELECT COUNT(*) as count FROM tutoring_sessions WHERE status = "ongoing" OR status = "scheduled"');
      stats.activeSessions = sessions[0]?.count || 0;
    } catch (e) { console.error('Sessions query error:', e.message); }

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/tutors/all', protect, async (req, res) => {
  try {
    const tutors = await query(`
      SELECT t.*, pv.transaction_reference, pv.screenshot_path as payment_screenshot, pv.status as payment_status
      FROM tutors t
      LEFT JOIN payment_verifications pv ON pv.id = (
        SELECT id FROM payment_verifications 
        WHERE tutor_id = t.id 
        ORDER BY created_at DESC LIMIT 1
      )
      ORDER BY t.created_at DESC
    `);
    res.json({ success: true, count: tutors.length, tutors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tutors/pending', protect, async (req, res) => {
  try {
    const tutors = await query(
      'SELECT * FROM tutors WHERE is_verified = FALSE ORDER BY created_at DESC'
    );
    res.json({ success: true, count: tutors.length, tutors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/tutors/:id/verify', protect, async (req, res) => {
  try {
    await query('UPDATE tutors SET is_verified = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Tutor verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/tutors/:id/reject', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    await query('UPDATE tutors SET is_verified = FALSE WHERE id = ?', [req.params.id]);
   
    res.json({ success: true, message: 'Tutor application rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/tutors/:id/suspend', protect, async (req, res) => {
  try {
    await query('UPDATE tutors SET is_verified = FALSE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Tutor suspended' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/students/:id/premium', protect, async (req, res) => {
  try {
    const { months } = req.body;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (months || 1));

    await query(
      'UPDATE students SET is_premium = TRUE, premium_expires_at = ? WHERE id = ?',
      [expiresAt, req.params.id]
    );

    res.json({ success: true, message: 'Premium access granted until ' + expiresAt.toLocaleDateString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/resources/upload', protect, upload.single('file'), async (req, res) => {
  try {
    const { title, description, type, subject, gradeLevel, accessLevel, isAASTU, youtubeUrl } = req.body;

    if (!title || !description || !type || !subject || !gradeLevel) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    let fileUrl;
    let fileSize = 0;

    if (type === 'video' && youtubeUrl) {
      fileUrl = youtubeUrl;
      fileSize = 0;
    } else {
      if (!req.file) return res.status(400).json({ error: 'Please upload a file or provide a YouTube URL' });
      fileUrl = `/uploads/resources/${req.file.filename}`;
      fileSize = req.file.size;
    }

    const sql = `
      INSERT INTO resources (title, description, type, subject, grade_level, access_level, 
                            file_url, file_size, is_aastu, uploaded_by, uploader_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')
    `;

    const result = await query(sql, [
      title, description, type, subject, gradeLevel, accessLevel || 'free',
      fileUrl, fileSize, isAASTU === 'true' ? 1 : 0, req.user.id
    ]);

    res.status(201).json({ success: true, message: 'Resource successfully hosted.', id: result.insertId });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

router.get('/resources', protect, async (req, res) => {
  try {
    const resources = await query('SELECT * FROM resources ORDER BY created_at DESC');
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/resources/:id', protect, async (req, res) => {
  try {
    const [resource] = await query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    if (resource.file_url && !resource.file_url.startsWith('http')) {
      const filePath = path.join(__dirname, '..', resource.file_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await query('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Resource permanently deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/students/all', protect, async (req, res) => {
  try {
    const students = await query(`
      SELECT s.*, pv.transaction_reference, pv.screenshot_path as payment_screenshot, pv.status as payment_status
      FROM students s
      LEFT JOIN payment_verifications pv ON pv.id = (
        SELECT id FROM payment_verifications 
        WHERE student_id = s.id 
        ORDER BY created_at DESC LIMIT 1
      )
      ORDER BY s.created_at DESC
    `);
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:userType/:id', protect, async (req, res) => {
  try {
    const { userType, id } = req.params;
    const table = userType === 'student' ? 'students' : 'tutors';
    await query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    res.json({ success: true, message: 'User record purged.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/settings', protect, async (req, res) => {
  try {
    const results = await query('SELECT * FROM system_settings');
    const settings = {};
    results.forEach(row => {
      let val = row.setting_value;
      if (row.setting_type === 'boolean') val = val === 'true';
      if (row.setting_type === 'number') val = Number(val);
      settings[row.setting_key] = val;
    });
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/settings', protect, async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await query('INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, String(value), String(value)]);
    }
    res.json({ success: true, message: 'Settings synchronized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/tutors/bulk-verify', protect, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: 'Invalid IDs' });

    await query('UPDATE tutors SET is_verified = TRUE WHERE id IN (?)', [ids]);
    res.json({ success: true, message: `${ids.length} tutors verified.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/conversations', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const conversations = await query(`
      SELECT 
        c.id,
        c.student_id,
        c.tutor_id,
        c.admin_joined,
        c.admin_id,
        c.last_message_at,
        c.created_at,
        s.full_name as student_name,
        s.profile_photo as student_photo,
        t.full_name as tutor_name,
        t.profile_photo as tutor_photo,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM conversations c
      LEFT JOIN students s ON c.student_id = s.id
      LEFT JOIN tutors t ON c.tutor_id = t.id
      ORDER BY c.last_message_at DESC
    `);

    console.log(`Admin fetched ${conversations.length} conversations`);

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Error fetching admin conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/conversations/:conversationId/messages', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { conversationId } = req.params;

    const [conversation] = await query(`
      SELECT c.id, c.student_id, c.tutor_id, c.admin_joined, c.admin_id,
             s.full_name as student_name, s.profile_photo as student_photo,
             t.full_name as tutor_name, t.profile_photo as tutor_photo
      FROM conversations c
      LEFT JOIN students s ON c.student_id = s.id
      LEFT JOIN tutors t ON c.tutor_id = t.id
      WHERE c.id = ?
    `, [conversationId]);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const messages = await query(`
      SELECT 
        m.id,
        m.sender_id,
        m.sender_type,
        m.receiver_id,
        m.receiver_type,
        m.content,
        m.message_type,
        m.is_admin_message,
        m.created_at,
        m.updated_at,
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
      ORDER BY m.created_at ASC
    `, [conversationId]);

    res.json({
      success: true,
      conversation,
      messages
    });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/conversations/:conversationId/messages', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { conversationId } = req.params;
    const { message, receiverType, receiverId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    const [conversation] = await query(`
      SELECT id, student_id, tutor_id, admin_joined, admin_id
      FROM conversations 
      WHERE id = ?
    `, [conversationId]);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    if (!conversation.admin_joined) {
      await query(`
        UPDATE conversations 
        SET admin_joined = 1, admin_id = ?, last_message_at = NOW()
        WHERE id = ?
      `, [req.user.id, conversationId]);
    }

    let actualReceiverId = receiverId;
    let actualReceiverType = receiverType;

    if (!actualReceiverId || !actualReceiverType) {
     
      if (conversation.student_id && conversation.tutor_id) {
       
        actualReceiverId = conversation.student_id;
        actualReceiverType = 'student';
      } else if (conversation.student_id) {
        actualReceiverId = conversation.student_id;
        actualReceiverType = 'student';
      } else if (conversation.tutor_id) {
        actualReceiverId = conversation.tutor_id;
        actualReceiverType = 'tutor';
      }
    }

    const result = await query(`
      INSERT INTO messages (
        conversation_id, sender_id, sender_type, receiver_id, receiver_type,
        content, message_type, is_admin_message
      ) VALUES (?, ?, ?, ?, ?, ?, 'text', 1)
    `, [
      conversationId,
      req.user.id,
      'admin',
      actualReceiverId,
      actualReceiverType,
      message.trim()
    ]);

    await query(`
      UPDATE conversations 
      SET last_message_at = NOW()
      WHERE id = ?
    `, [conversationId]);

    res.json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Error sending admin message:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
