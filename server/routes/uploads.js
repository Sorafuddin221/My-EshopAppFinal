const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for Cloudinary uploads
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

// Initialize upload for video
const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for Cloudinary uploads
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('video');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4|webm|ogg/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb('Error: Images or Videos Only!');
  }
}

// @route   POST /api/uploads
// @desc    Upload an image
// @access  Private (Admin only)
router.post('/', auth, (req, res) => {
  // Check if the request is for a video or image upload
  const isVideoUpload = req.body.type === 'video';
  const uploadMiddleware = isVideoUpload ? uploadVideo : uploadImage;

  uploadMiddleware(req, res, async (err) => { // Added 'async' here
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

      const response = {
        msg: 'File uploaded successfully!',
      };

      if (isVideoUpload) {
        response.videoUrl = result.secure_url;
      } else {
        response.imageUrl = result.secure_url;
      }

      res.status(200).json(response);
    } catch (cloudinaryErr) {
      console.error('Cloudinary upload error:', cloudinaryErr);
      res.status(500).json({ msg: 'Cloudinary upload failed.' });
    }
  });
});

module.exports = router;
