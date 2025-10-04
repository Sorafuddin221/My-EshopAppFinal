const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { auth, authorizeRoles } = require('../middleware/auth');

// @route   POST /api/blogposts
// @desc    Create a new blog post
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const newBlogPost = new BlogPost(req.body);
    const blogPost = await newBlogPost.save();
    res.status(201).json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/blogposts
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate('category');
    res.json(blogPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/blogposts/:id
// @desc    Get blog post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate('category');
    if (!blogPost) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/blogposts/:id
// @desc    Update a blog post by ID
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    let blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('category');
    res.json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/blogposts/:id
// @desc    Delete a blog post by ID
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Blog post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
