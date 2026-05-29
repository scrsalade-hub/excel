const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/emailService');

// ─── Request Password Reset ───
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success even if user not found (security: don't reveal who has accounts)
      return res.json({ success: true, message: 'If an account exists with this email, you will receive a reset link shortly.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and store on user
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Build reset URL (frontend hash route)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/#/reset-password/${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      res.json({ success: true, message: 'If an account exists with this email, you will receive a reset link shortly.' });
    } catch (emailErr) {
      // Rollback token if email fails
      user.resetPasswordToken = '';
      user.resetPasswordExpire = null;
      await user.save();
      console.error('Email send error:', emailErr);
      res.status(500).json({ message: 'Could not send reset email. Please try again later.' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ─── Verify Reset Token ───
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ valid: false, message: 'Invalid or expired reset token.' });
    }

    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ valid: false, message: 'Server error.' });
  }
};

// ─── Reset Password ───
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new reset link.' });
    }

    // Update password and clear token
    user.password = password;
    user.resetPasswordToken = '';
    user.resetPasswordExpire = null;
    await user.save();

    res.json({ success: true, message: 'Your password has been reset successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
