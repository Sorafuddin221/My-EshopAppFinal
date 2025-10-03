const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('product', 'name imageUrl');
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/reviews
// @desc    Create a review for a product
// @access  Private
router.post('/', auth, async (req, res) => {
  const { product, rating, comment } = req.body;

  try {
    const newReview = new Review({
      product,
      user: req.user.id,
      rating,
      comment,
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    review.rating = rating;
    review.comment = comment;

    review = await review.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;