const mongoose = require('mongoose');

const SubMenuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'parentType'
  },
  parentType: {
    type: String,
    required: true,
    enum: ['NavMenu', 'Brand', 'Category']
  },
});

module.exports = mongoose.model('SubMenu', SubMenuSchema);
