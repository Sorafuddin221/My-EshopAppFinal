const express = require('express');
const router = express.Router();
const FooterMenu = require('../models/FooterMenu');
const { auth } = require('../middleware/auth');

// @route   GET /api/footer-menus
// @desc    Get all footer menus
// @access  Public
router.get('/', async (req, res) => {
  try {
    const footerMenus = await FooterMenu.find().sort({ order: 1 });
    res.json(footerMenus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/footer-menus
// @desc    Create a footer menu
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  const { title, url, order } = req.body;

  try {
    const newFooterMenu = new FooterMenu({
      title,
      url,
      order,
    });

    const footerMenu = await newFooterMenu.save();
    res.json(footerMenu);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/footer-menus/:id
// @desc    Update a footer menu
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  const { title, url, order } = req.body;

  try {
    let footerMenu = await FooterMenu.findById(req.params.id);

    if (!footerMenu) {
      return res.status(404).json({ msg: 'Footer menu not found' });
    }

    footerMenu.title = title;
    footerMenu.url = url;
    footerMenu.order = order;

    footerMenu = await footerMenu.save();
    res.json(footerMenu);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/footer-menus/:id
// @desc    Delete a footer menu
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await FooterMenu.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Footer menu removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
