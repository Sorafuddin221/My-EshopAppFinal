const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, authorizeRoles } = require('../middleware/auth');

// @route   POST /api/categories
// @desc    Add new category
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }
    category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
