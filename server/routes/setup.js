const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route   POST /api/setup/create-admin
// @desc    Create the first admin user
// @access  Public
router.post('/create-admin', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if there are any users in the database
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ msg: 'An admin user already exists.' });
    }

    // Create a new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      isApproved: true,
    });

    await newUser.save();

    res.status(201).json({ msg: 'Admin user created successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
