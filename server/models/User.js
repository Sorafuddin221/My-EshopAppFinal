const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    
  },
  username: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  mfaEnabled: {
    type: Boolean,
    default: false,
  },
  mfaSecret: String,
  mfaSecretExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
