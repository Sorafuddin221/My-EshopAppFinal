const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authorizeRoles } = require('../middleware/auth');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'public', 'uploads')); // Correct path to project root's public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage });

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin only)
router.post('/', auth, upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'thumbnailImage1', maxCount: 1 },
  { name: 'thumbnailImage2', maxCount: 1 }
]), async (req, res) => {
  console.log('Inside POST /products route.');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  try {
    const { name, description, price, category, brand, buyNowUrl, rating, metaDescription, metaKeywords } = req.body;
    const imageUrl = req.files && req.files['productImage'] ? `/uploads/${req.files['productImage'][0].filename}` : '';
    const thumbnailImage1Url = req.files && req.files['thumbnailImage1'] ? `/uploads/${req.files['thumbnailImage1'][0].filename}` : '';
    const thumbnailImage2Url = req.files && req.files['thumbnailImage2'] ? `/uploads/${req.files['thumbnailImage2'][0].filename}` : '';

    // Validate Category and Brand IDs
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ msg: 'Invalid Category ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).json({ msg: 'Invalid Brand ID' });
    }

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      imageUrl,
      thumbnailImage1Url,
      thumbnailImage2Url,
      buyNowUrl,
      rating: parseFloat(rating) || 0,
      metaDescription,
      metaKeywords,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).populate('brand').populate('category').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand').populate('category');
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/products/:id/view
// @desc    Increment product view count
// @access  Public
router.put('/:id/view', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    product.views = (product.views || 0) + 1;
    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product by ID
// @access  Private (Admin only)
router.put('/:id', auth, upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'thumbnailImage1', maxCount: 1 },
  { name: 'thumbnailImage2', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, buyNowUrl, rating, metaDescription, metaKeywords } = req.body;
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Build update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (price) updateFields.price = parseFloat(price);
    if (category) updateFields.category = category;
    if (brand) updateFields.brand = brand;
    if (stock) updateFields.stock = parseInt(stock);
    if (buyNowUrl) updateFields.buyNowUrl = buyNowUrl;
    if (rating) updateFields.rating = parseFloat(rating);
    if (metaDescription) updateFields.metaDescription = metaDescription;
    if (metaKeywords) updateFields.metaKeywords = metaKeywords;

    if (req.files && req.files['productImage']) {
      updateFields.imageUrl = `/uploads/${req.files['productImage'][0].filename}`;
    }
    if (req.files && req.files['thumbnailImage1']) {
      updateFields.thumbnailImage1Url = `/uploads/${req.files['thumbnailImage1'][0].filename}`;
    }
    if (req.files && req.files['thumbnailImage2']) {
      updateFields.thumbnailImage2Url = `/uploads/${req.files['thumbnailImage2'][0].filename}`;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
