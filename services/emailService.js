const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"NaijaParrot" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #667eea;">Welcome to NaijaParrot! 🦜</h1>
      <p>Hello ${user.firstName},</p>
      <p>Thank you for joining NaijaParrot - Nigeria's rising voice for authentic stories!</p>
      <p>Click the link below to verify your email:</p>
      <a href="${process.env.CLIENT_URL}/verify-email/${user.emailVerificationToken}" 
         style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
      <hr>
      <p style="color: #666;">© 2025 NaijaParrot. All rights reserved.</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Welcome to NaijaParrot! 🦜',
    html
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #667eea;">Password Reset Request</h1>
      <p>Hello ${user.firstName},</p>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" 
         style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request - NaijaParrot',
    html
  });
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };