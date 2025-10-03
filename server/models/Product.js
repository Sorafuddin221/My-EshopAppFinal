const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  thumbnailImage1Url: {
    type: String,
    default: '',
  },
  thumbnailImage2Url: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  buyNowUrl: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Product', productSchema);
