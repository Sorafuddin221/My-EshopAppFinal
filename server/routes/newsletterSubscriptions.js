const express = require('express');
const router = express.Router();
const NewsletterSubscription = require('../models/NewsletterSubscription');

// @route   POST /api/newsletter-subscriptions
// @desc    Create a new newsletter subscription
// @access  Public
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    let subscription = await NewsletterSubscription.findOne({ email });

    if (subscription) {
      return res.status(400).json({ msg: 'You are already subscribed to our newsletter.' });
    }

    subscription = new NewsletterSubscription({
      email,
    });

    await subscription.save();
    res.json({ msg: 'Thank you for subscribing!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
