const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { auth, authorizeRoles } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get current settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // If no settings exist, create a default one
      settings = new Setting();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private (Admin only)
router.put('/', auth, async (req, res) => {
  try {
    const { headerPromoText, navbarLogoUrl, navbarLogoText, isLogoTextVisible, heroImageUrl, heroMainText, heroButtonText, heroButtonUrl, heroTextColor, heroOverlayColor, heroButtonBgColor, heroButtonTextColor, heroHeadingFontSize, reviewVideoUrl, reviewVideoTitle, reviewVideoDescription, reviewVideoPlaceholderImage, teamLeaderImage, teamLeaderTitle, teamLeaderSubtitle, teamLeaderAvatar, teamLeaderAuthor, teamLeaderRole, teamLeaderRating, teamLeaderText, footerAboutText, footerSocialLinks, footerCopyrightText, footerPaymentImages, metaTitle, metaLogoUrl, productsPageHeading, productsPageSubheading, brandsPageHeading, brandsPageSubheading, categoriesPageHeading, categoriesPageSubheading, blogPageHeading, blogPageSubheading } = req.body;

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting({ headerPromoText, navbarLogoUrl, navbarLogoText, isLogoTextVisible, heroImageUrl, heroMainText, heroButtonText, heroButtonUrl, heroTextColor, heroOverlayColor, heroButtonBgColor, heroButtonTextColor, heroHeadingFontSize, reviewVideoUrl, reviewVideoTitle, reviewVideoDescription, reviewVideoPlaceholderImage, teamLeaderImage, teamLeaderTitle, teamLeaderSubtitle, teamLeaderAvatar, teamLeaderAuthor, teamLeaderRole, teamLeaderRating, teamLeaderText, footerAboutText, footerSocialLinks, footerCopyrightText, productsPageHeading, productsPageSubheading, brandsPageHeading, brandsPageSubheading, categoriesPageHeading, categoriesPageSubheading, blogPageHeading, blogPageSubheading });
    } else {
      setting.headerPromoText = headerPromoText;
      setting.navbarLogoUrl = navbarLogoUrl;
      setting.navbarLogoText = navbarLogoText;
      setting.isLogoTextVisible = isLogoTextVisible;
      setting.heroImageUrl = heroImageUrl;
      setting.heroMainText = heroMainText;
      setting.heroButtonText = heroButtonText;
      setting.heroButtonUrl = heroButtonUrl;
      setting.heroTextColor = heroTextColor;
      setting.heroOverlayColor = heroOverlayColor;
      setting.heroButtonBgColor = heroButtonBgColor;
      setting.heroButtonTextColor = heroButtonTextColor;
      setting.heroHeadingFontSize = heroHeadingFontSize;
      setting.reviewVideoUrl = reviewVideoUrl;
      setting.reviewVideoTitle = reviewVideoTitle;
      setting.reviewVideoDescription = reviewVideoDescription;
      setting.reviewVideoPlaceholderImage = reviewVideoPlaceholderImage;
      setting.teamLeaderImage = teamLeaderImage;
      setting.teamLeaderTitle = teamLeaderTitle;
      setting.teamLeaderSubtitle = teamLeaderSubtitle;
      setting.teamLeaderAvatar = teamLeaderAvatar;
      setting.teamLeaderAuthor = teamLeaderAuthor;
      setting.teamLeaderRole = teamLeaderRole;
      setting.teamLeaderRating = teamLeaderRating;
      setting.teamLeaderText = teamLeaderText;
      setting.footerAboutText = footerAboutText;
      setting.footerSocialLinks = footerSocialLinks;
      setting.footerCopyrightText = footerCopyrightText;
      setting.footerPaymentImages = footerPaymentImages;
      setting.metaTitle = metaTitle;
      setting.metaLogoUrl = metaLogoUrl;
      setting.productsPageHeading = productsPageHeading;
      setting.productsPageSubheading = productsPageSubheading;
      setting.brandsPageHeading = brandsPageHeading;
      setting.brandsPageSubheading = brandsPageSubheading;
      setting.categoriesPageHeading = categoriesPageHeading;
      setting.categoriesPageSubheading = categoriesPageSubheading;
      setting.blogPageHeading = blogPageHeading;
      setting.blogPageSubheading = blogPageSubheading;
    }
    const updatedSetting = await setting.save();
    res.json(updatedSetting);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: 'Server error. Could not update settings.' });
  }
});

module.exports = router;