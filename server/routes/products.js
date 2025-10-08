const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const { auth, authorizeRoles } = require('../middleware/auth');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage });

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  console.log('Inside POST /products route.');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  try {
    const { name, description, price, category, brand, stock, buyNowUrl, rating, metaDescription, metaKeywords, imageUrl, thumbnailImage1Url, thumbnailImage2Url, buttons } = req.body;

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
      stock: parseInt(stock),
      category,
      brand,
      imageUrl,
      thumbnailImage1Url,
      thumbnailImage2Url,
      buyNowUrl,
      rating: parseFloat(rating) || 0,
      metaDescription,
      metaKeywords,
      buttons,
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
      const brand = await Brand.findOne({ name: { $regex: new RegExp(`^${req.query.brand}$`, 'i') } });
      if (brand) {
        filter.brand = brand._id;
      } else {
        return res.json([]);
      }
    }
    if (req.query.category) {
      const category = await Category.findOne({ name: { $regex: new RegExp(`^${req.query.category}$`, 'i') } });
      if (category) {
        filter.category = category._id;
      } else {
        return res.json([]);
      }
    }

    console.log('Filter:', filter); // Log the filter object

    const products = await Product.find(filter).populate('brand').populate('category').sort({ createdAt: -1 });
    console.log('Products found:', products.length); // Log the number of products found
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err); // Log the full error
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
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, buyNowUrl, rating, metaDescription, metaKeywords, buttons } = req.body;
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
    if (buttons) updateFields.buttons = buttons;
    if (imageUrl) updateFields.imageUrl = imageUrl;
    if (thumbnailImage1Url) updateFields.thumbnailImage1Url = thumbnailImage1Url;
    if (thumbnailImage2Url) updateFields.thumbnailImage2Url = thumbnailImage2Url;

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
