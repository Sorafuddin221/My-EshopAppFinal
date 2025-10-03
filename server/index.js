require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-affiliate-eshop';

const path = require('path');

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const blogPostRoutes = require('./routes/blogPosts');
const brandRoutes = require('./routes/brands');
const categoryRoutes = require('./routes/categories');
const uploadRoutes = require('./routes/uploads');
const commentRoutes = require('./routes/comments');
const settingRoutes = require('./routes/settings');
const setupRoutes = require('./routes/setup');
const footerMenuRoutes = require('./routes/footerMenus');
const newsletterSubscriptionRoutes = require('./routes/newsletterSubscriptions');
const reviewRoutes = require('./routes/reviews');
const navMenuRoutes = require('./routes/navMenus');
const subMenuRoutes = require('./routes/subMenus');
const contactRoutes = require('./routes/contact');
const addressSettingsRoutes = require('./routes/addressSettings');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  credentials: true, // Allow cookies to be sent
}));

// Middleware to handle SameSite=None and Secure for cookies in development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const originalSetHeader = res.setHeader;
  res.setHeader = function (name, value) {
    if (name.toLowerCase() === 'set-cookie') {
      let cookies = Array.isArray(value) ? value : [value];
      cookies = cookies.map(cookie => {
        if (cookie.includes('SameSite=Lax') || cookie.includes('SameSite=Strict')) {
          // For development on localhost, we need to relax SameSite and Secure
          // In production, ensure Secure is true and SameSite is None for cross-site
          if (process.env.NODE_ENV === 'development') {
            return cookie.replace(/SameSite=(Lax|Strict)/g, 'SameSite=None; Secure');
          } else {
            // In production, ensure Secure is true and SameSite is None for cross-site
            return cookie.replace(/SameSite=(Lax|Strict)/g, 'SameSite=None; Secure');
          }
        }
        return cookie;
      });
      return originalSetHeader.call(this, name, cookies);
    }
    return originalSetHeader.call(this, name, value);
  };
  next();
});

app.use(express.json()); // Body parser for JSON requests
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/authors', require('./routes/authors'));
app.use('/api/footer-menus', footerMenuRoutes);
app.use('/api/newsletter-subscriptions', newsletterSubscriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/nav-menus', navMenuRoutes);
app.use('/api/sub-menus', subMenuRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/address-settings', addressSettingsRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Affiliate Eshop Backend API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});