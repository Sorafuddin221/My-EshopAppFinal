
const express = require('express');
const router = express.Router();
const Page = require('../models/Page'); // Import the Page model

// GET route to retrieve page content
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  console.log(`[Backend API] GET request for slug: ${slug}`);

  try {
    const page = await Page.findOne({ slug });
    if (page) {
      console.log(`[Backend API] Page found for ${slug}. Returning content.`);
      return res.json({ content: page.content });
    } else {
      console.log(`[Backend API] Page not found for ${slug}. Returning default content.`);
      // Return default content if page not found in DB
      let defaultContent = '';
      if (slug === 'terms') {
        defaultContent = '<h2>Terms of Service</h2><p>These are our terms and conditions.</p>';
      } else if (slug === 'privacy-policy') {
        defaultContent = '<h2>Privacy Policy</h2><p>This is our privacy policy.</p>';
      } else if (slug === 'disclosure') {
        defaultContent = '<h2>Disclosure</h2><p>This is our disclosure statement.</p>';
      }
      return res.json({ content: defaultContent });
    }
  } catch (error) {
    console.error(`[Backend API] Error fetching page for ${slug}:`, error);
    return res.status(500).json({ message: 'Failed to fetch page content', error: error.message });
  }
});

// PUT route to update page content
router.put('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { content, title } = req.body; // Destructure title from req.body

  console.log(`[Backend API] PUT request for slug: ${slug}`);

  try {
    let pageTitle = title;
    if (!pageTitle) {
      // Generate title from slug if not provided
      pageTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const page = await Page.findOneAndUpdate(
      { slug },
      { content, title: pageTitle }, // Include title in the update/upsert
      { new: true, upsert: true } // Create if not exists, return new document
    );
    console.log(`[Backend API] Content for ${slug} updated successfully.`);
    return res.json({ message: 'Content updated successfully', page });
  } catch (error) {
    console.error(`[Backend API] Failed to update content for ${slug}:`, error);
    return res.status(500).json({ message: 'Failed to update content', error: error.message });
  }
});

module.exports = router;
