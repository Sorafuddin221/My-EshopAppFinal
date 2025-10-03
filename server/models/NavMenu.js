const mongoose = require('mongoose');

const NavMenuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('NavMenu', NavMenuSchema);
