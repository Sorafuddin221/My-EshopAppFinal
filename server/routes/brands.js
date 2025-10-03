const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const { auth, authorizeRoles } = require('../middleware/auth');

// @route   POST /api/brands
// @desc    Add new brand
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    let brand = await Brand.findOne({ name });
    if (brand) {
      return res.status(400).json({ msg: 'Brand already exists' });
    }
    brand = new Brand({ name });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/brands
// @desc    Get all brands
// @access  Public
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/brands/:id
// @desc    Get brand by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ msg: 'Brand not found' });
    }
    res.json(brand);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
