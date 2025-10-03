const express = require('express');
const router = express.Router();
const SubMenu = require('../models/SubMenu');
const { auth } = require('../middleware/auth');

// GET all sub menus
router.get('/', async (req, res) => {
  try {
    const subMenus = await SubMenu.find().populate('parent');
    res.json(subMenus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new sub menu
router.post('/', auth, async (req, res) => {
  const { title, url, parent, parentType } = req.body;
  const subMenu = new SubMenu({
    title,
    url,
    parent,
    parentType
  });

  try {
    const newSubMenu = await subMenu.save();
    res.status(201).json(newSubMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT to update a sub menu
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedSubMenu = await SubMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubMenu) {
            return res.status(404).json({ message: 'Sub menu not found' });
        }
        res.json(updatedSubMenu);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE a sub menu
router.delete('/:id', auth, async (req, res) => {
  try {
    await SubMenu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sub menu deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
