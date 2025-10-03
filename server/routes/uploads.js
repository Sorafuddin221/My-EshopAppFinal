const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const { auth } = require('../middleware/auth');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for memory storage
const storage = multer.memoryStorage();

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for Cloudinary uploads
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// @route   POST /api/uploads
// @desc    Upload an image
// @access  Private (Admin only)
router.post('/', auth, (req, res) => {
  upload(req, res, async (err) => { // Added 'async' here
    if (err) {
      return res.status(400).json({ msg: err });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'Error: No File Selected!' });
    }

    try {
      // Upload image to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });

      res.status(200).json({
        msg: 'File uploaded successfully!',
        imageUrl: result.secure_url, // Return Cloudinary secure URL
      });
    } catch (cloudinaryErr) {
      console.error('Cloudinary upload error:', cloudinaryErr);
      res.status(500).json({ msg: 'Cloudinary upload failed.' });
    }
  });
});

module.exports = router;
