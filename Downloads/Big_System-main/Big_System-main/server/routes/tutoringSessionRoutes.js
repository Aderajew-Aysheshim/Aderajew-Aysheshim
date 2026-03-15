const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for payment screenshots
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/payment-screenshots';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `payment-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Auth middleware
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, userType: decoded.userType };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized' });
  }
};

// @route   POST /api/tutoring-sessions/request
// @desc    Student requests a tutoring session
// @access  Private (Student)
router.post('/request', protect, async (req, res) => {
  try {
    const {
      tutorId, title, description, subject, scheduledDate,
      durationMinutes, sessionType, meetingPlatform
    } = req.body;

    // Get tutor's hourly rate
    const [tutor] = await query('SELECT hourly_rate FROM tutors WHERE id = ?', [tutorId]);
    if (!tutor) return res.status(404).json({ error: 'Tutor not found' });

    // Calculate costs
    const hours = durationMinutes / 60;
    const totalAmount = tutor.hourly_rate * hours;
    const commissionRate = 10; // 10%
    const platformCommission = totalAmount * (commissionRate / 100);
    const tutorEarnings = totalAmount - platformCommission;

    // Create session
    const result = await query(
      `INSERT INTO tutoring_sessions 
       (student_id, tutor_id, title, description, subject, scheduled_date, 
        duration_minutes, session_type, hourly_rate, total_amount, 
        platform_commission, tutor_earnings, meeting_platform, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', 'pending')`,
      [req.user.id, tutorId, title, description, subject, scheduledDate,
        durationMinutes, sessionType, tutor.hourly_rate, totalAmount,
        platformCommission, tutorEarnings, meetingPlatform]
    );

    // Create notification for tutor
    await query(
      `INSERT INTO notifications (user_id, user_type, title, message, type, link)
       VALUES (?, 'tutor', 'New Session Request', ?, 'info', '/sessions')`,
      [tutorId, `New tutoring session request for ${subject}`]
    );

    res.status(201).json({
      success: true,
      message: 'Session requested successfully',
      sessionId: result.insertId,
      totalAmount,
      platformCommission,
      tutorEarnings
    });
  } catch (error) {
    console.error('Request session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/tutoring-sessions/:id/payment
// @desc    Submit payment for session
// @access  Private (Student)
router.post('/:id/payment', protect, upload.single('screenshot'), async (req, res) => {
  try {
    const { paymentMethod, transactionReference } = req.body;
    const sessionId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot required' });
    }

    const screenshotUrl = `/uploads/payment-screenshots/${req.file.filename}`;

    // Get session details
    const [session] = await query('SELECT * FROM tutoring_sessions WHERE id = ?', [sessionId]);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Create payment record
    await query(
      `INSERT INTO session_payments 
       (session_id, student_id, tutor_id, amount, payment_method, 
        payment_screenshot, transaction_reference, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [sessionId, req.user.id, session.tutor_id, session.total_amount,
        paymentMethod, screenshotUrl, transactionReference]
    );

    // Update session
    await query(
      `UPDATE tutoring_sessions 
       SET payment_screenshot = ?, transaction_id = ?, payment_method = ?
       WHERE id = ?`,
      [screenshotUrl, transactionReference, paymentMethod, sessionId]
    );

    // Notify admin
    await query(
      `INSERT INTO notifications (user_id, user_type, title, message, type, link)
       SELECT id, 'admin', 'Payment Verification Needed', 
              'New payment screenshot submitted for tutoring session', 
              'warning', '/admin/payments'
       FROM admins WHERE role = 'super-admin' LIMIT 1`
    );

    res.json({
      success: true,
      message: 'Payment submitted. Awaiting admin verification.'
    });
  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutoring-sessions/my-sessions
// @desc    Get user's sessions (student or tutor)
// @access  Private
router.get('/my-sessions', protect, async (req, res) => {
  try {
    let sessions;

    if (req.user.userType === 'student') {
      sessions = await query(
        `SELECT ts.*, 
                t.full_name as tutor_name,
                t.email as tutor_email,
                t.phone as tutor_phone,
                t.profile_photo as tutor_photo
         FROM tutoring_sessions ts
         JOIN tutors t ON ts.tutor_id = t.id
         WHERE ts.student_id = ?
         ORDER BY ts.scheduled_date DESC`,
        [req.user.id]
      );
    } else if (req.user.userType === 'tutor') {
      sessions = await query(
        `SELECT ts.*, 
                s.full_name as student_name,
                s.email as student_email,
                s.phone as student_phone,
                s.profile_photo as student_photo
         FROM tutoring_sessions ts
         JOIN students s ON ts.student_id = s.id
         WHERE ts.tutor_id = ?
         ORDER BY ts.scheduled_date DESC`,
        [req.user.id]
      );
    }

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tutoring-sessions/admin/all
// @desc    Get all sessions (Admin)
// @access  Private (Admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const sessions = await query(
      `SELECT ts.*, 
              s.full_name as student_name,
              s.email as student_email,
              t.full_name as tutor_name,
              t.email as tutor_email,
              sp.status as payment_verification_status
       FROM tutoring_sessions ts
       JOIN students s ON ts.student_id = s.id
       JOIN tutors t ON ts.tutor_id = t.id
       LEFT JOIN session_payments sp ON ts.id = sp.session_id
       ORDER BY ts.created_at DESC`
    );

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Get all sessions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/tutoring-sessions/admin/verify-payment/:id
// @desc    Verify payment (Admin)
// @access  Private (Admin)
router.put('/admin/verify-payment/:id', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { approved, adminNotes } = req.body;
    const sessionId = req.params.id;

    if (approved) {
      // Approve payment
      await query(
        `UPDATE session_payments 
         SET status = 'approved', verified_by = ?, verified_at = NOW(), admin_notes = ?
         WHERE session_id = ?`,
        [req.user.id, adminNotes, sessionId]
      );

      await query(
        `UPDATE tutoring_sessions 
         SET payment_status = 'paid', paid_at = NOW(), admin_approved = TRUE
         WHERE id = ?`,
        [sessionId]
      );

      // Get session details
      const [session] = await query('SELECT * FROM tutoring_sessions WHERE id = ?', [sessionId]);

      // Create commission record
      await query(
        `INSERT INTO admin_commissions 
         (session_id, tutor_id, student_id, session_amount, commission_rate, commission_amount)
         VALUES (?, ?, ?, ?, 10.00, ?)`,
        [sessionId, session.tutor_id, session.student_id, session.total_amount, session.platform_commission]
      );

      // Create tutor earnings record
      await query(
        `INSERT INTO tutor_earnings 
         (tutor_id, session_id, amount, commission_deducted, net_earnings, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [session.tutor_id, sessionId, session.total_amount, session.platform_commission, session.tutor_earnings]
      );

      // Notify student
      await query(
        `INSERT INTO notifications (user_id, user_type, title, message, type, link)
         VALUES (?, 'student', 'Payment Approved', 'Your payment has been verified. Session confirmed!', 'success', '/sessions')`,
        [session.student_id]
      );

      // Notify tutor
      await query(
        `INSERT INTO notifications (user_id, user_type, title, message, type, link)
         VALUES (?, 'tutor', 'New Session Confirmed', 'A new tutoring session has been confirmed', 'success', '/sessions')`,
        [session.tutor_id]
      );

      res.json({ success: true, message: 'Payment approved and session confirmed' });
    } else {
      // Reject payment
      await query(
        `UPDATE session_payments 
         SET status = 'rejected', verified_by = ?, verified_at = NOW(), admin_notes = ?
         WHERE session_id = ?`,
        [req.user.id, adminNotes, sessionId]
      );

      await query(
        `UPDATE tutoring_sessions 
         SET payment_status = 'cancelled', status = 'cancelled'
         WHERE id = ?`,
        [sessionId]
      );

      const [session] = await query('SELECT student_id FROM tutoring_sessions WHERE id = ?', [sessionId]);

      // Notify student
      await query(
        `INSERT INTO notifications (user_id, user_type, title, message, type, link)
         VALUES (?, 'student', 'Payment Rejected', ?, 'error', '/sessions')`,
        [session.student_id, `Payment rejected. Reason: ${adminNotes}`]
      );

      res.json({ success: true, message: 'Payment rejected' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/tutoring-sessions/:id/complete
// @desc    Mark session as completed
// @access  Private (Tutor)
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const { studentAttended, notes } = req.body;

    await query(
      `UPDATE tutoring_sessions 
       SET status = 'completed', completed_at = NOW(), 
           student_attended = ?, tutor_attended = TRUE, admin_notes = ?
       WHERE id = ? AND tutor_id = ?`,
      [studentAttended, notes, req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Session marked as completed' });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/tutoring-sessions/:id/rate
// @desc    Rate a session
// @access  Private
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (req.user.userType === 'student') {
      await query(
        `UPDATE tutoring_sessions 
         SET student_rating = ?, student_review = ?
         WHERE id = ? AND student_id = ?`,
        [rating, review, req.params.id, req.user.id]
      );
    } else if (req.user.userType === 'tutor') {
      await query(
        `UPDATE tutoring_sessions 
         SET tutor_rating = ?, tutor_review = ?
         WHERE id = ? AND tutor_id = ?`,
        [rating, review, req.params.id, req.user.id]
      );
    }

    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate session error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
