const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    default: 'Untitled Page', // Default title to prevent null duplicates
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Page', pageSchema);
