const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/mysqlDatabase');

// Generate JWT token
const generateToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Auth middleware
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.user = { id: decoded.id, userType: decoded.userType };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Not authorized' });
    }
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const [admin] = await query('SELECT * FROM admins WHERE email = ?', [email]);

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(admin.id, 'admin');

        res.json({
            success: true,
            token,
            admin: {
                id: admin.id,
                firstName: admin.first_name,
                lastName: admin.last_name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard stats
// @access  Private (Admin)
router.get('/dashboard', protect, async (req, res) => {
    try {
        // Get total students
        const [studentCount] = await query('SELECT COUNT(*) as count FROM students');

        // Get verified tutors
        const [verifiedTutorCount] = await query('SELECT COUNT(*) as count FROM tutors WHERE is_verified = TRUE');

        // Get pending tutors
        const [pendingTutorCount] = await query('SELECT COUNT(*) as count FROM tutors WHERE is_verified = FALSE');

        // Get total resources
        const [resourceCount] = await query('SELECT COUNT(*) as count FROM resources');

        // Get free resources
        const [freeResourceCount] = await query('SELECT COUNT(*) as count FROM resources WHERE access_level = "free"');

        // Get premium resources
        const [premiumResourceCount] = await query('SELECT COUNT(*) as count FROM resources WHERE access_level = "premium"');

        // Get pending payments
        const [pendingPaymentCount] = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE status = "pending"');

        // Get approved payments
        const [approvedPaymentCount] = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE status = "approved"');

        // Get rejected payments
        const [rejectedPaymentCount] = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE status = "rejected"');

        // Get pending registrations
        const [pendingRegistrations] = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE payment_type = "registration" AND status = "pending"');

        // Get pending subscriptions
        const [pendingSubscriptions] = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE payment_type = "premium_subscription" AND status = "pending"');

        // Get pending tutor activations
        const [pendingTutorActivations] = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE payment_type = "tutor_activation" AND status = "pending"');

        // Get pending course payments
        const [pendingCoursePayments] = await query('SELECT COUNT(*) as count FROM payment_verifications WHERE payment_type = "course_payment" AND status = "pending"');

        res.json({
            success: true,
            stats: {
                totalStudents: studentCount.count,
                verifiedTutors: verifiedTutorCount.count,
                pendingTutors: pendingTutorCount.count,
                totalResources: resourceCount.count,
                freeResources: freeResourceCount.count,
                premiumResources: premiumResourceCount.count,
                pendingPayments: pendingPaymentCount.count,
                approvedPayments: approvedPaymentCount.count,
                rejectedPayments: rejectedPaymentCount.count,
                pendingRegistrations: pendingRegistrations.count,
                pendingSubscriptions: pendingSubscriptions.count,
                pendingTutorActivations: pendingTutorActivations.count,
                pendingCoursePayments: pendingCoursePayments.count
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/admin/tutors/all
// @desc    Get all tutors with credentials
// @access  Private (Admin)
router.get('/tutors/all', protect, async (req, res) => {
    try {
        const tutors = await query(`
      SELECT 
        id, full_name, email, phone, qualifications, subjects, 
        specialization, bio, profile_photo, hourly_rate, rating, total_reviews,
        is_verified, activation_fee_paid, degree_certificate, id_document, 
        cv_document, transcript, created_at, total_earnings, commission_owed
      FROM tutors 
      ORDER BY created_at DESC
    `);

        res.json({
            success: true,
            count: tutors.length,
            tutors
        });
    } catch (error) {
        console.error('Get all tutors error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/admin/tutors/:id/verify
// @desc    Verify a tutor
// @access  Private (Admin)
router.put('/tutors/:id/verify', protect, async (req, res) => {
    try {
        await query('UPDATE tutors SET is_verified = TRUE WHERE id = ?', [req.params.id]);

        // Create notification for tutor
        await query(
            `INSERT INTO notifications (user_id, user_type, title, message, type)
       VALUES (?, 'tutor', 'Account Verified', 'Your tutor account has been verified by admin!', 'success')`,
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Tutor verified successfully'
        });
    } catch (error) {
        console.error('Verify tutor error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/admin/tutors/:id/reject
// @desc    Reject a tutor
// @access  Private (Admin)
router.put('/tutors/:id/reject', protect, async (req, res) => {
    try {
        const { reason } = req.body;

        await query('UPDATE tutors SET is_verified = FALSE WHERE id = ?', [req.params.id]);

        // Create notification for tutor
        await query(
            `INSERT INTO notifications (user_id, user_type, title, message, type)
       VALUES (?, 'tutor', 'Application Rejected', ?, 'error')`,
            [req.params.id, reason || 'Your application has been rejected. Please contact admin for more information.']
        );

        res.json({
            success: true,
            message: 'Tutor rejected'
        });
    } catch (error) {
        console.error('Reject tutor error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/admin/tutors/:id/suspend
// @desc    Suspend a tutor
// @access  Private (Admin)
router.put('/tutors/:id/suspend', protect, async (req, res) => {
    try {
        await query('UPDATE tutors SET is_verified = FALSE WHERE id = ?', [req.params.id]);

        // Create notification for tutor
        await query(
            `INSERT INTO notifications (user_id, user_type, title, message, type)
       VALUES (?, 'tutor', 'Account Suspended', 'Your account has been suspended. Please contact admin.', 'warning')`,
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Tutor suspended'
        });
    } catch (error) {
        console.error('Suspend tutor error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/admin/students/all
// @desc    Get all students
// @access  Private (Admin)
router.get('/students/all', protect, async (req, res) => {
    try {
        const students = await query(`
      SELECT 
        id, full_name, email, phone, grade_level, school,
        profile_photo, is_premium, premium_expires_at, created_at,
        registration_fee_paid, registration_payment_screenshot
      FROM students 
      ORDER BY created_at DESC
    `);

        res.json({
            success: true,
            count: students.length,
            students
        });
    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/admin/students/:id/premium
// @desc    Grant premium access to student
// @access  Private (Admin)
router.put('/students/:id/premium', protect, async (req, res) => {
    try {
        const { months } = req.body;
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (months || 1));

        await query(
            'UPDATE students SET is_premium = TRUE, premium_expires_at = ? WHERE id = ?',
            [expiresAt, req.params.id]
        );

        // Create notification
        await query(
            `INSERT INTO notifications (user_id, user_type, title, message, type)
       VALUES (?, 'student', 'Premium Access Granted', 'You now have premium access!', 'success')`,
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Premium access granted'
        });
    } catch (error) {
        console.error('Grant premium error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   DELETE /api/admin/students/:id
// @desc    Delete a student
// @access  Private (Admin)
router.delete('/students/:id', protect, async (req, res) => {
    try {
        await query('DELETE FROM students WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Student deleted'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   DELETE /api/admin/tutors/:id
// @desc    Delete a tutor
// @access  Private (Admin)
router.delete('/tutors/:id', protect, async (req, res) => {
    try {
        await query('DELETE FROM tutors WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Tutor deleted'
        });
    } catch (error) {
        console.error('Delete tutor error:', error);
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/admin/system/stats
// @desc    Get comprehensive system statistics
// @access  Private (Admin)
router.get('/system/stats', protect, async (req, res) => {
    try {
        // Get conversation stats
        const [conversationCount] = await query('SELECT COUNT(*) as count FROM conversations');
        const [messageCount] = await query('SELECT COUNT(*) as count FROM messages');

        // Get revenue stats
        const [totalRevenue] = await query('SELECT SUM(amount) as total FROM payment_verifications WHERE status = "approved"');

        // Get tutor earnings
        const [tutorEarnings] = await query('SELECT SUM(total_earnings) as total FROM tutors');

        // Get commission owed
        const [commissionOwed] = await query('SELECT SUM(commission_owed) as total FROM tutors');

        res.json({
            success: true,
            stats: {
                totalConversations: conversationCount.count,
                totalMessages: messageCount.count,
                totalRevenue: totalRevenue.total || 0,
                tutorEarnings: tutorEarnings.total || 0,
                commissionOwed: commissionOwed.total || 0
            }
        });
    } catch (error) {
        console.error('Get system stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
