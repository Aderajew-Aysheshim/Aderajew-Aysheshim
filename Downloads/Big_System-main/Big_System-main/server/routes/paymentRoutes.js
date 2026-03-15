const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/initiate
// @desc    Initiate payment (CBE or Telebirr)
// @access  Private
router.post('/initiate', protect, async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // TODO: Integrate with actual CBE/Telebirr API
    // For now, return mock payment URL
    const paymentUrl = `https://payment-gateway.example.com/${paymentMethod}?amount=${booking.amount}&ref=${bookingId}`;

    res.json({
      success: true,
      message: 'Payment initiated',
      paymentUrl,
      amount: booking.amount,
      currency: 'ETB'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify payment callback
// @access  Public (Webhook)
router.post('/verify', async (req, res) => {
  try {
    const { bookingId, transactionId, status } = req.body;

    // TODO: Verify with actual payment gateway

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.paymentStatus = status === 'success' ? 'completed' : 'failed';
    booking.transactionId = transactionId;
    await booking.save();

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/payments/subscription
// @desc    Subscribe to premium (Student or Tutor)
// @access  Private
router.post('/subscription', protect, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    // Subscription prices
    const price = req.userType === 'student' ? 500 : 1000; // ETB

    // TODO: Integrate with actual payment gateway
    const paymentUrl = `https://payment-gateway.example.com/${paymentMethod}?amount=${price}&type=subscription`;

    res.json({
      success: true,
      message: 'Subscription payment initiated',
      paymentUrl,
      amount: price,
      currency: 'ETB'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/payments/subscription/verify
// @desc    Verify subscription payment
// @access  Public (Webhook)
router.post('/subscription/verify', async (req, res) => {
  try {
    const { userId, userType, transactionId, status } = req.body;

    if (status !== 'success') {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // Update subscription status
    const Model = userType === 'student' ? Student : Tutor;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

    await Model.findByIdAndUpdate(userId, {
      subscriptionStatus: 'premium',
      subscriptionExpiry: expiryDate
    });

    res.json({ success: true, message: 'Subscription activated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
