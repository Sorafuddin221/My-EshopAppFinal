
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Define DATA_DIR relative to the server directory
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

function getFilePath(slug) {
  return path.join(DATA_DIR, `${slug}.json`);
}

// GET route to retrieve page content
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const filePath = getFilePath(slug);

  console.log(`[Backend API] GET request for slug: ${slug}`);
  console.log(`[Backend API] Checking file path: ${filePath}`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log(`[Backend API] File found for ${slug}. Returning content.`);
    return res.json(data);
  } catch (error) {
    console.error(`[Backend API] Error reading file for ${slug}:`, error);
    // Return default content if file not found or error
    let defaultContent = '';
    if (slug === 'terms') {
      defaultContent = '<h2>Terms of Service</h2><p>These are our terms and conditions.</p>';
    } else if (slug === 'privacy-policy') {
      defaultContent = '<h2>Privacy Policy</h2><p>This is our privacy policy.</p>';
    } else if (slug === 'disclosure') {
      defaultContent = '<h2>Disclosure</h2><p>This is our disclosure statement.</p>';
    }
    console.log(`[Backend API] File not found or error for ${slug}. Returning default content.`);
    return res.json({ content: defaultContent });
  }
});

// PUT route to update page content
router.put('/:slug', async (req, res) => {
  const { slug } = req.params;
  const filePath = getFilePath(slug);
  const { content } = req.body;

  console.log(`[Backend API] PUT request for slug: ${slug}`);

  try {
    fs.writeFileSync(filePath, JSON.stringify({ content }), 'utf-8');
    console.log(`[Backend API] Content for ${slug} updated successfully.`);
    return res.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error(`[Backend API] Failed to update content for ${slug}:`, error);
    let errorMessage = 'Failed to update content';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: 'Failed to update content', error: errorMessage });
  }
});

module.exports = router;
