const express = require('express');
const router = express.Router();
const { query } = require('../config/mysqlDatabase');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { protect } = require('../middleware/authMiddleware');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/payment-screenshots';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `pay-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// @route   POST /api/payment-verification/upload
router.post('/upload', protect, upload.single('screenshot'), async (req, res) => {
  try {
    const { paymentType, amount, paymentMethod, transactionReference } = req.body;
    if (!req.file || !paymentType || !amount || !transactionReference) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Incomplete payment data' });
    }

    const screenshotUrl = `/uploads/payment-screenshots/${req.file.filename}`;
    const sql = `INSERT INTO payment_verifications (student_id, tutor_id, payment_type, amount, payment_method, transaction_reference, screenshot_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;

    const studentId = req.user.userType === 'student' ? req.user.id : null;
    const tutorId = req.user.userType === 'tutor' ? req.user.id : null;

    const result = await query(sql, [studentId, tutorId, paymentType, amount, paymentMethod, transactionReference, screenshotUrl]);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/payment-verification/all (Admin Only)
router.get('/all', protect, async (req, res) => {
  if (req.user.userType !== 'admin') return res.status(403).json({ error: 'Access Denied' });
  try {
    const { status } = req.query;
    let sql = `
      SELECT pv.*, 
             COALESCE(s.full_name, t.full_name) as user_name,
             COALESCE(s.email, t.email) as user_email,
             CASE 
               WHEN pv.student_id IS NOT NULL THEN 'student'
               WHEN pv.tutor_id IS NOT NULL THEN 'tutor'
               ELSE 'unknown'
             END as user_type,
             a.full_name as admin_name
      FROM payment_verifications pv
      LEFT JOIN students s ON pv.student_id = s.id
      LEFT JOIN tutors t ON pv.tutor_id = t.id
      LEFT JOIN admins a ON pv.verified_by = a.id
    `;

    const queryParams = [];
    if (status && status !== 'all') {
      sql += ` WHERE pv.status = ?`;
      queryParams.push(status);
    }

    sql += ` ORDER BY pv.created_at DESC`;

    const verifications = await query(sql, queryParams);
    res.json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/payment-verification/:id/approve
router.put('/:id/approve', protect, async (req, res) => {
  if (req.user.userType !== 'admin') return res.status(403).json({ error: 'Access Denied' });
  try {
    const { adminNotes } = req.body;
    const [verification] = await query('SELECT * FROM payment_verifications WHERE id = ?', [req.params.id]);
    if (!verification) return res.status(404).json({ error: 'Not found' });

    await query('UPDATE payment_verifications SET status = "approved", admin_notes = ?, verified_by = ?, verified_at = NOW() WHERE id = ?',
      [adminNotes || 'Approved', req.user.id, req.params.id]);

    // Activation logic
    if (verification.student_id) {
      if (verification.payment_type === 'premium' || verification.payment_type === 'premium_subscription') {
        await query('UPDATE students SET is_premium = TRUE, premium_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY), is_active = 1 WHERE id = ?', [verification.student_id]);
      } else if (verification.payment_type === 'registration') {
        await query('UPDATE students SET registration_fee_paid = 1, is_active = 1 WHERE id = ?', [verification.student_id]);
      }
    } else if (verification.tutor_id) {
      if (verification.payment_type === 'tutor-activation' || verification.payment_type === 'tutor_activation') {
        await query('UPDATE tutors SET is_verified = 1, activation_fee_paid = 1, is_active = 1 WHERE id = ?', [verification.tutor_id]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/payment-verification/:id/reject
router.put('/:id/reject', protect, async (req, res) => {
  if (req.user.userType !== 'admin') return res.status(403).json({ error: 'Access Denied' });
  try {
    const { adminNotes } = req.body;
    await query('UPDATE payment_verifications SET status = "rejected", admin_notes = ?, verified_by = ?, verified_at = NOW() WHERE id = ?',
      [adminNotes, req.user.id, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/payment-verification/bulk-approve
router.put('/bulk-approve', protect, async (req, res) => {
  if (req.user.userType !== 'admin') return res.status(403).json({ error: 'Access Denied' });
  try {
    const { ids } = req.body;
    for (const id of ids) {
      const [verification] = await query('SELECT * FROM payment_verifications WHERE id = ?', [id]);
      if (verification && verification.status === 'pending') {
        await query('UPDATE payment_verifications SET status = "approved", verified_by = ?, verified_at = NOW() WHERE id = ?', [req.user.id, id]);

        // Handle activation for bulk approve
        if (verification.student_id) {
          if (verification.payment_type === 'premium') {
            await query('UPDATE students SET is_premium = TRUE, premium_expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY), is_active = 1 WHERE id = ?', [verification.student_id]);
          } else if (verification.payment_type === 'registration') {
            await query('UPDATE students SET registration_fee_paid = 1, is_active = 1 WHERE id = ?', [verification.student_id]);
          }
        } else if (verification.tutor_id) {
          if (verification.payment_type === 'tutor-activation' || verification.payment_type === 'tutor_activation') {
            await query('UPDATE tutors SET is_verified = 1, activation_fee_paid = 1, is_active = 1 WHERE id = ?', [verification.tutor_id]);
          }
        }
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;