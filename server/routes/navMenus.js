const express = require('express');
const router = express.Router();
const NavMenu = require('../models/NavMenu');
const { auth } = require('../middleware/auth');

// @route   GET /api/nav-menus
// @desc    Get all nav menus
// @access  Public
router.get('/', async (req, res) => {
  console.log('GET /api/nav-menus hit');
  try {
    const navMenus = await NavMenu.find().sort({ order: 1 });
    console.log('Successfully fetched nav menus:', navMenus);
    res.json(navMenus);
  } catch (err) {
    console.error('Error in GET /api/nav-menus:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/nav-menus
// @desc    Create a nav menu
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  const { title, url, order } = req.body;

  try {
    const newNavMenu = new NavMenu({
      title,
      url,
      order,
    });

    const navMenu = await newNavMenu.save();
    res.json(navMenu);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/nav-menus/:id
// @desc    Update a nav menu
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  const { title, url, order } = req.body;

  try {
    let navMenu = await NavMenu.findById(req.params.id);

    if (!navMenu) {
      return res.status(404).json({ msg: 'Nav menu not found' });
    }

    navMenu.title = title;
    navMenu.url = url;
    navMenu.order = order;

    navMenu = await navMenu.save();
    res.json(navMenu);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/nav-menus/:id
// @desc    Delete a nav menu
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    let navMenu = await NavMenu.findById(req.params.id);

    if (!navMenu) {
      return res.status(404).json({ msg: 'Nav menu not found' });
    }

    await NavMenu.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Nav menu removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
