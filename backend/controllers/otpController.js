const crypto = require('crypto');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/emailService');

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function clearOTP(email) {
  otpStore.delete(email.toLowerCase());
}

// ─── Request OTP ───
exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[OTP-REQUEST] Received request for email: "${email}"`);

    if (!email) {
      console.log('[OTP-REQUEST] No email provided');
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(`[OTP-REQUEST] User lookup for "${email.toLowerCase()}":`, user ? 'FOUND' : 'NOT FOUND');

    if (!user) {
      // Don't reveal if user exists
      console.log('[OTP-REQUEST] User not found - returning generic success (security)');
      return res.json({ success: true, message: 'If an account exists, you will receive a code shortly.' });
    }

    // Rate limit
    const existing = otpStore.get(email.toLowerCase());
    if (existing && Date.now() - existing.sentAt < 60000) {
      console.log('[OTP-REQUEST] Rate limited - too soon');
      return res.status(429).json({ message: 'Please wait 60 seconds before requesting a new code.' });
    }

    const otp = generateOTP();
    console.log(`[OTP-REQUEST] Generated OTP: ${otp} for ${email}`);

    otpStore.set(email.toLowerCase(), {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      sentAt: Date.now(),
    });

    try {
      console.log(`[OTP-REQUEST] Calling sendOTPEmail(${email}, ${otp})...`);
      const result = await sendOTPEmail(email, otp);
      console.log(`[OTP-REQUEST] Email sent! MessageId: ${result.messageId}`);
      res.json({ success: true, message: 'If an account exists, you will receive a code shortly.' });
    } catch (err) {
      clearOTP(email.toLowerCase());
      console.error('[OTP-REQUEST] EMAIL SEND FAILED:', err.code, err.message);
      res.status(500).json({ message: 'Could not send code: ' + err.message });
    }
  } catch (error) {
    console.error('[OTP-REQUEST] Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Verify OTP ───
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`[OTP-VERIFY] Verifying ${email} with code ${otp}`);

    if (!email || !otp) return res.status(400).json({ message: 'Email and code are required' });

    const record = otpStore.get(email.toLowerCase());
    if (!record) {
      console.log('[OTP-VERIFY] No record found for', email);
      return res.status(400).json({ message: 'Code expired. Please request a new one.' });
    }

    if (Date.now() > record.expires) {
      clearOTP(email.toLowerCase());
      return res.status(400).json({ message: 'Code expired. Please request a new one.' });
    }

    if (record.attempts >= 5) {
      clearOTP(email.toLowerCase());
      return res.status(400).json({ message: 'Too many attempts. Please request a new code.' });
    }

    record.attempts += 1;

    if (record.otp !== otp) {
      return res.status(400).json({ message: `Invalid code. ${5 - record.attempts} attempts remaining.` });
    }

    record.verified = true;
    console.log('[OTP-VERIFY] Code verified for', email);
    res.json({ success: true, message: 'Code verified.' });
  } catch (error) {
    console.error('[OTP-VERIFY] Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Reset Password with OTP ───
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    console.log(`[OTP-RESET] Reset request for ${email}`);

    if (!email || !otp || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const record = otpStore.get(email.toLowerCase());
    if (!record || !record.verified || record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired code. Please start over.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();
    console.log('[OTP-RESET] Password reset for', email);

    clearOTP(email.toLowerCase());
    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('[OTP-RESET] Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
