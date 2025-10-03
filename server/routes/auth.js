const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');

// Nodemailer transporter setup (replace with your actual email service details)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'SendGrid', 'Mailgun'
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    console.log('Register route: Received request');
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    console.log('Register route: User not found, proceeding with creation');

    user = new User({
      email,
      password,
      username,
    });

    console.log('Register route: User object created');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log('Register route: Password hashed');

    await user.save();
    console.log('Register route: User saved');

    // For all registrations, await admin approval
    res.status(201).json({ msg: 'Registration successful. Awaiting admin approval.' });

  } catch (err) {
    console.error('Register route error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ msg: 'Your account is awaiting admin approval.' });
    }

    if (user.mfaEnabled) {
      // Generate a 6-digit MFA code
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.mfaSecret = mfaCode;
      user.mfaSecretExpires = Date.now() + 5 * 60 * 1000; // Code expires in 5 minutes
      await user.save();

      // Send MFA code to user's email
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'MFA Verification Code',
        text: `Your MFA verification code is: ${mfaCode}\n\nThis code will expire in 5 minutes.`, // Corrected newline escaping
      };
      await transporter.sendMail(mailOptions);

      return res.status(401).json({ msg: 'MFA required. Check your email for the code.' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/verify-mfa
// @desc    Verify MFA code and get token
// @access  Public
router.post('/verify-mfa', async (req, res) => {
  const { email, mfaCode } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }

    if (!user.mfaEnabled || user.mfaSecret !== mfaCode || user.mfaSecretExpires < Date.now()) {
      return res.status(401).json({ msg: 'Invalid or expired MFA code.' });
    }

    // MFA code is valid, clear it and issue JWT
    user.mfaSecret = undefined;
    user.mfaSecretExpires = undefined;
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change a user's own password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id); // Get user from authenticated token

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear any reset token fields if they exist (good practice)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ msg: 'Password changed successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (for admin to approve)
// @access  Private (Admin only)
router.get('/users', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/approve/:id
// @desc    Approve a user account
// @access  Private (Admin only)
router.put('/approve/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isApproved = true;
    user.role = 'admin';
    await user.save();

    res.json({ msg: 'User approved successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/reject/:id
// @desc    Reject a user account
// @access  Private (Admin only)
router.put('/reject/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user's data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
