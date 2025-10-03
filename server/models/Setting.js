const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  headerPromoText: {
    type: String,
    default: 'UPTO 50% OFF TO ALL VIRTUAL PRODUCTS',
  },
  navbarLogoUrl: {
    type: String,
    default: 'https://via.placeholder.com/40x40?text=Logo',
  },
  navbarLogoText: {
    type: String,
    default: 'Blurb',
  },
  isLogoTextVisible: {
    type: Boolean,
    default: true,
  },
  heroImageUrl: {
    type: String,
    default: 'https://via.placeholder.com/1500x500?text=Hero+Image',
  },
  heroMainText: {
    type: String,
    default: 'Your Awesome Hero Title',
  },
  heroButtonText: {
    type: String,
    default: 'Shop Now',
  },
  heroButtonUrl: {
    type: String,
    default: '/products',
  },
  heroTextColor: {
    type: String,
    default: '#ffffff',
  },
  heroOverlayColor: {
    type: String,
    default: 'rgba(0,0,0,0.5)',
  },
  heroButtonBgColor: {
    type: String,
    default: '#3b82f6', // Corresponds to Tailwind's blue-500
  },
  heroButtonTextColor: {
    type: String,
    default: '#ffffff',
  },
  heroHeadingFontSize: {
    type: String,
    default: '5xl',
  },
  reviewVideoUrl: {
    type: String,
    default: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default YouTube embed URL
  },
  reviewVideoTitle: {
    type: String,
    default: 'Watch Our Product Review',
  },
  reviewVideoDescription: {
    type: String,
    default: 'See what our customers are saying about our amazing products.',
  },
  reviewVideoPlaceholderImage: {
    type: String,
    default: 'https://via.placeholder.com/600x400?text=Video+Placeholder',
  },
  teamLeaderImage: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=Phone+Image',
  },
  teamLeaderTitle: {
    type: String,
    default: 'DISCOVER PRO',
  },
  teamLeaderSubtitle: {
    type: String,
    default: 'ULTIMATE MULTITASKING',
  },
  teamLeaderAvatar: {
    type: String,
    default: 'https://via.placeholder.com/60x60?text=Avatar',
  },
  teamLeaderAuthor: {
    type: String,
    default: 'ThemeIM',
  },
  teamLeaderRole: {
    type: String,
    default: 'Team Leader',
  },
  teamLeaderRating: {
    type: Number,
    default: 4,
  },
  teamLeaderText: {
    type: String,
    default: 'Lorem Ipsum is simply dummy text of the printing and type setting industry. The Lorem Ipsum has been the industry.',
  },
  footerAboutText: {
    type: String,
    default: 'Lorem ipsum dolor sit amet, anim id est adipsici vam aliquam qua anim id est laborum laborum. Perspoconsectetur, adipiscici vam aliquam qua anim id est laborum.',
  },
  footerSocialLinks: [
    {
      platform: { type: String, default: 'twitter' },
      url: { type: String, default: '#' },
    },
    {
      platform: { type: String, default: 'facebook' },
      url: { type: String, default: '#' },
    },
    {
      platform: { type: String, default: 'pinterest' },
      url: { type: String, default: '#' },
    },
    {
      platform: { type: String, default: 'google-plus' },
      url: { type: String, default: '#' },
    },
  ],
  footerCopyrightText: {
    type: String,
    default: 'Copyright &copy; ThemeIM 2025. All Right Reserved',
  },
  footerPaymentImages: { // Changed to array
    type: [String], // Array of strings
    default: [], // Default to empty array
  },
  metaTitle: {
    type: String,
    default: 'My Affiliate Eshop',
  },
  metaLogoUrl: {
    type: String,
    default: '/favicon.ico',
  },
  productsPageHeading: {
    type: String,
    default: 'All Products',
  },
  productsPageSubheading: {
    type: String,
    default: 'Explore our wide range of high-quality products designed to meet your needs.',
  },
  brandsPageHeading: {
    type: String,
    default: 'Products by Brand',
  },
  brandsPageSubheading: {
    type: String,
    default: 'Discover products from your favorite brands.',
  },
  categoriesPageHeading: {
    type: String,
    default: 'Products by Category',
  },
  categoriesPageSubheading: {
    type: String,
    default: 'Browse products across various categories.',
  },
  blogPageHeading: {
    type: String,
    default: 'Search Product Review & Discover',
  },
  blogPageSubheading: {
    type: String,
    default: 'Read reviews. Write reviews. Deal smarter.',
  },
});

module.exports = mongoose.model('Setting', settingSchema);