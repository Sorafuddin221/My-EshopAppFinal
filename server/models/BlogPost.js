const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  
  imageUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
});

blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
