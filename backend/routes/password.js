const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP, resetPassword } = require('../controllers/otpController');
const { sendOTPEmail } = require('../utils/emailService');

router.post('/forgot', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset', resetPassword);

// Direct test: sends OTP to any email, no user lookup
router.post('/test-send', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[TEST-SEND] Sending OTP ${otp} to ${email}`);
    const result = await sendOTPEmail(email, otp);
    res.json({ success: true, message: 'Email sent. Check inbox and spam.', messageId: result.messageId });
  } catch (err) {
    console.error('[TEST-SEND] Failed:', err.code, err.message);
    res.status(500).json({ success: false, message: err.message, code: err.code });
  }
});

module.exports = router;
