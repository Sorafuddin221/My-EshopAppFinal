const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

// @route   POST /api/comments
// @desc    Add a new comment
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { blogPost, author, content } = req.body;
    const newComment = new Comment({ blogPost, author, content });
    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/comments/recent
// @desc    Get recent comments
// @access  Public
router.get('/recent', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(5);
    res.json(comments);
  } catch (err) {
    console.error('Error fetching recent comments:', err); // Log the full error object
    res.status(500).send('Server error');
  }
});

// @route   GET /api/comments/:blogPostId
// @desc    Get all comments for a blog post
// @access  Public
router.get('/:blogPostId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogPost: req.params.blogPostId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
