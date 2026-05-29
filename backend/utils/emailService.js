const nodemailer = require('nodemailer');

console.log('[EMAIL] Loading email service...');
console.log('[EMAIL] EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('[EMAIL] EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

// Gmail SMTP config with explicit TLS for Windows compatibility
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // needed on some Windows machines
  },
  debug: true, // log SMTP traffic
  logger: true, // log to console
});

// Verify on load
transporter.verify((err, success) => {
  if (err) {
    console.error('[EMAIL] Transporter verify failed:', err.message);
  } else {
    console.log('[EMAIL] Transporter ready. Gmail SMTP verified on port 465.');
  }
});

exports.sendOTPEmail = async (to, otp) => {
  console.log(`[EMAIL] ===== SENDING OTP EMAIL =====`);
  console.log(`[EMAIL] To: ${to}`);
  console.log(`[EMAIL] OTP: ${otp}`);
  console.log(`[EMAIL] From: ${process.env.EMAIL_USER}`);

  const mailOptions = {
    from: `"Excel" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Excel Password Reset Code',
    text: `Your Excel password reset code is: ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<div style="max-width:480px;margin:40px auto;font-family:Arial,Helvetica,sans-serif;color:#171717;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
  <div style="background:#DC2626;padding:28px;text-align:center;">
    <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0;">Excel</h1>
    <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Password Reset</p>
  </div>
  <div style="padding:32px;text-align:center;">
    <p style="color:#525252;font-size:14px;line-height:1.6;margin:0 0 20px;">
      Use this code to reset your password. It expires in 10 minutes.
    </p>
    <div style="background:#FAFAFA;border:2px dashed #DC2626;border-radius:10px;padding:18px;margin:0 0 20px;">
      <span style="font-size:36px;font-weight:800;color:#DC2626;font-family:monospace;letter-spacing:6px;">${otp}</span>
    </div>
    <p style="color:#A3A3A3;font-size:12px;margin:0;">
      Did not request this? You can safely ignore this email.
    </p>
  </div>
</div>
</body>
</html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] ===== SUCCESS =====`);
    console.log(`[EMAIL] MessageId: ${info.messageId}`);
    console.log(`[EMAIL] Accepted: ${info.accepted}`);
    console.log(`[EMAIL] Rejected: ${info.rejected}`);
    return info;
  } catch (err) {
    console.error(`[EMAIL] ===== FAILED =====`);
    console.error('[EMAIL] Error code:', err.code);
    console.error('[EMAIL] Error message:', err.message);
    console.error('[EMAIL] Command:', err.command);
    console.error('[EMAIL] Response:', err.response);
    throw err;
  }
};
