'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    metaTitle: '',
    metaLogoUrl: '',
    headerPromoText: '',
    navbarLogoUrl: '',
    navbarLogoText: '',
    isLogoTextVisible: true,
    productsPageHeading: '',
    productsPageSubheading: '',
    brandsPageHeading: '',
    brandsPageSubheading: '',
    categoriesPageHeading: '',
    categoriesPageSubheading: '',
    blogPageHeading: '',
    blogPageSubheading: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [metaLogoFile, setMetaLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const fetchedSettings = await api.get('/settings');
        if (fetchedSettings) {
          setSettings({
            ...fetchedSettings,
            isLogoTextVisible: fetchedSettings.isLogoTextVisible !== false, // Ensure it's true by default if not set
            productsPageHeading: fetchedSettings.productsPageHeading || '',
            productsPageSubheading: fetchedSettings.productsPageSubheading || '',
            brandsPageHeading: fetchedSettings.brandsPageHeading || '',
            brandsPageSubheading: fetchedSettings.brandsPageSubheading || '',
            categoriesPageHeading: fetchedSettings.categoriesPageHeading || '',
            categoriesPageSubheading: fetchedSettings.categoriesPageSubheading || '',
            blogPageHeading: fetchedSettings.blogPageHeading || '',
            blogPageSubheading: fetchedSettings.blogPageSubheading || '',
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage('Failed to load settings.');
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/x-icon'];
      const maxSize = 1 * 1024 * 1024; // 1MB

      if (!allowedTypes.includes(file.type)) {
        setMessage('Error: Only JPEG, PNG, GIF, and ICO images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        setMessage('Error: Image size cannot exceed 1MB.');
        return;
      }

      if (fileType === 'logo') {
        setLogoFile(file);
      } else if (fileType === 'metaLogo') {
        setMetaLogoFile(file);
      }
      setMessage(''); // Clear previous messages
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    let newNavbarLogoUrl = settings.navbarLogoUrl;
    let newMetaLogoUrl = settings.metaLogoUrl;

    try {
      if (logoFile) {
        const formData = new FormData();
        formData.append('image', logoFile);
        const uploadResponse = await api.post('/uploads', formData, token, true);
        console.log('Upload Response for Navbar Logo:', uploadResponse);
        newNavbarLogoUrl = uploadResponse.imageUrl;
      }

      if (metaLogoFile) {
        const formData = new FormData();
        formData.append('image', metaLogoFile);
        const uploadResponse = await api.post('/uploads', formData, token, true);
        console.log('Upload Response for Meta Logo:', uploadResponse);
        newMetaLogoUrl = `http://localhost:3001${uploadResponse.imageUrl}`;
        console.log('Constructed newMetaLogoUrl:', newMetaLogoUrl);
      }

      const updatedSettings = {
        ...settings,
        navbarLogoUrl: newNavbarLogoUrl,
        metaLogoUrl: newMetaLogoUrl,
        isLogoTextVisible: settings.isLogoTextVisible,
        productsPageHeading: settings.productsPageHeading,
        productsPageSubheading: settings.productsPageSubheading,
        brandsPageHeading: settings.brandsPageHeading,
        brandsPageSubheading: settings.brandsPageSubheading,
        categoriesPageHeading: settings.categoriesPageHeading,
        categoriesPageSubheading: settings.categoriesPageSubheading,
        blogPageHeading: settings.blogPageHeading,
        blogPageSubheading: settings.blogPageSubheading,
      };

      console.log('Settings being sent to backend:', updatedSettings);

      const response = await api.put('/settings', updatedSettings, token);

      if (response) {
        setMessage('Settings updated successfully!');
        setSettings(response);
        setLogoFile(null);
        setMetaLogoFile(null);
      } else {
        setMessage(response.msg || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Server error. Could not update settings.');
    }
  };

  return (
    <div id="settings-section">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Settings</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="meta-title" className="block text-gray-700 text-sm font-bold mb-2">Meta Title</label>
            <input
              type="text"
              id="meta-title"
              name="metaTitle"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter meta title"
              value={settings.metaTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="meta-logo-upload" className="block text-gray-700 text-sm font-bold mb-2">Upload New Meta Logo</label>
            <input
              type="file"
              id="meta-logo-upload"
              onChange={(e) => handleFileChange(e, 'metaLogo')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {settings.metaLogoUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current Meta Logo:</p>
                <img src={settings.metaLogoUrl} alt="Current Meta Logo" className="mt-1 w-24 h-auto object-contain border rounded p-1" />
                <p className="text-xs text-gray-500">URL: {settings.metaLogoUrl}</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="header-promo-text" className="block text-gray-700 text-sm font-bold mb-2">Header Promotional Text</label>
            <input
              type="text"
              id="header-promo-text"
              name="headerPromoText"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter promotional text for the top header"
              value={settings.headerPromoText}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="navbar-logo-text" className="block text-gray-700 text-sm font-bold mb-2">Navbar Logo Text</label>
            <input
              type="text"
              id="navbar-logo-text"
              name="navbarLogoText"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter text next to the logo (e.g., Blurb)"
              value={settings.navbarLogoText}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="logo-text-visible" className="flex items-center text-gray-700 text-sm font-bold">
              <input
                type="checkbox"
                id="logo-text-visible"
                name="isLogoTextVisible"
                className="mr-2"
                checked={settings.isLogoTextVisible}
                onChange={(e) => setSettings({ ...settings, isLogoTextVisible: e.target.checked })}
              />
              Show Logo Text
            </label>
          </div>

          {/* Products Page Hero Section Settings */}
          <h6 className="text-md font-bold text-gray-800 mb-2 mt-6">Products Page Hero Section</h6>
          <div className="mb-4">
            <label htmlFor="products-page-heading" className="block text-gray-700 text-sm font-bold mb-2">Heading Text</label>
            <input
              type="text"
              id="products-page-heading"
              name="productsPageHeading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter heading for products page"
              value={settings.productsPageHeading}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="products-page-subheading" className="block text-gray-700 text-sm font-bold mb-2">Subheading Text</label>
            <input
              type="text"
              id="products-page-subheading"
              name="productsPageSubheading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter subheading for products page"
              value={settings.productsPageSubheading}
              onChange={handleInputChange}
            />
          </div>

          {/* Brands Page Hero Section Settings */}
          <h6 className="text-md font-bold text-gray-800 mb-2 mt-6">Brands Page Hero Section</h6>
          <div className="mb-4">
            <label htmlFor="brands-page-heading" className="block text-gray-700 text-sm font-bold mb-2">Heading Text</label>
            <input
              type="text"
              id="brands-page-heading"
              name="brandsPageHeading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter heading for brands page"
              value={settings.brandsPageHeading}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="brands-page-subheading" className="block text-gray-700 text-sm font-bold mb-2">Subheading Text</label>
            <input
              type="text"
              id="brands-page-subheading"
              name="brandsPageSubheading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter subheading for brands page"
              value={settings.brandsPageSubheading}
              onChange={handleInputChange}
            />
          </div>

          {/* Categories Page Hero Section Settings */}
          <h6 className="text-md font-bold text-gray-800 mb-2 mt-6">Categories Page Hero Section</h6>
          <div className="mb-4">
            <label htmlFor="categories-page-heading" className="block text-gray-700 text-sm font-bold mb-2">Heading Text</label>
            <input
              type="text"
              id="categories-page-heading"
              name="categoriesPageHeading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter heading for categories page"
              value={settings.categoriesPageHeading}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="categories-page-subheading" className="block text-gray-700 text-sm font-bold mb-2">Subheading Text</label>
            <input
              type="text"
              id="categories-page-subheading"
              name="categoriesPageSubheading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter subheading for categories page"
              value={settings.categoriesPageSubheading}
              onChange={handleInputChange}
            />
          </div>

          {/* Blog Page Hero Section Settings */}
          <h6 className="text-md font-bold text-gray-800 mb-2 mt-6">Blog Page Hero Section</h6>
          <div className="mb-4">
            <label htmlFor="blog-page-heading" className="block text-gray-700 text-sm font-bold mb-2">Heading Text</label>
            <input
              type="text"
              id="blog-page-heading"
              name="blogPageHeading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter heading for blog page"
              value={settings.blogPageHeading}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="blog-page-subheading" className="block text-gray-700 text-sm font-bold mb-2">Subheading Text</label>
            <input
              type="text"
              id="blog-page-subheading"
              name="blogPageSubheading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter subheading for blog page"
              value={settings.blogPageSubheading}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="navbar-logo-upload" className="block text-gray-700 text-sm font-bold mb-2">Upload New Navbar Logo Image</label>
            <input
              type="file"
              id="navbar-logo-upload"
              onChange={(e) => handleFileChange(e, 'logo')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {settings.navbarLogoUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current Navbar Logo:</p>
                <img src={settings.navbarLogoUrl} alt="Current Navbar Logo" className="mt-1 w-24 h-auto object-contain border rounded p-1" />
                <p className="text-xs text-gray-500">URL: {settings.navbarLogoUrl}</p>
              </div>
            )}
          </div>

          {message && <p className="text-sm mt-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}