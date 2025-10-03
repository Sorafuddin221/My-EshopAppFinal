'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function HeaderCustomize() {
  const [headerPromoText, setHeaderPromoText] = useState('');
  const [navbarLogoUrl, setNavbarLogoUrl] = useState('');
  const [navbarLogoText, setNavbarLogoText] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/settings');
        if (settings) {
          setHeaderPromoText(settings.headerPromoText || '');
          setNavbarLogoUrl(settings.navbarLogoUrl || '');
          setNavbarLogoText(settings.navbarLogoText || '');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage('Failed to load settings.');
      }
    };
    fetchSettings();
  }, []);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 1 * 1024 * 1024; // 1MB

      if (!allowedTypes.includes(file.type)) {
        setMessage('Error: Only JPEG, PNG, and GIF images are allowed.');
        setLogoFile(null);
        return;
      }

      if (file.size > maxSize) {
        setMessage('Error: Image size cannot exceed 1MB.');
        setLogoFile(null);
        return;
      }

      setLogoFile(file);
      setMessage(''); // Clear previous messages
    }
     else {
      setLogoFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    let newNavbarLogoUrl = navbarLogoUrl;

    try {
      // Fetch current settings first
      const currentSettings = await api.get('/settings', token);

      if (logoFile) {
        const formData = new FormData();
        formData.append('image', logoFile);
        const uploadResponse = await api.post('/uploads', formData, token, true);
        newNavbarLogoUrl = uploadResponse.imageUrl; // Update URL with uploaded image
      }

      // Merge current settings with changes from this component
      const updatedSettings = {
        ...currentSettings, // Preserve existing settings
        headerPromoText,
        navbarLogoUrl: newNavbarLogoUrl,
        navbarLogoText,
      };

      const response = await api.put('/settings', updatedSettings, token); // Send merged object

      if (response) {
        setMessage('Settings updated successfully!');
        // Update local state with response from server to ensure consistency
        setHeaderPromoText(response.headerPromoText || '');
        setNavbarLogoUrl(response.navbarLogoUrl || '');
        setNavbarLogoText(response.navbarLogoText || '');
        setLogoFile(null); // Clear file input
      } else {
        setMessage(response.msg || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Server error. Could not update settings.');
    }
  };

  return (
    <div id="header-customize">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Header</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="header-promo-text" className="block text-gray-700 text-sm font-bold mb-2">Header Promotional Text</label>
            <input
              type="text"
              id="header-promo-text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter promotional text for the top header"
              value={headerPromoText}
              onChange={(e) => setHeaderPromoText(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="navbar-logo-text" className="block text-gray-700 text-sm font-bold mb-2">Navbar Logo Text</label>
            <input
              type="text"
              id="navbar-logo-text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter text next to the logo (e.g., Blurb)"
              value={navbarLogoText}
              onChange={(e) => setNavbarLogoText(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="navbar-logo-upload" className="block text-gray-700 text-sm font-bold mb-2">Upload New Navbar Logo Image</label>
            <input
              type="file"
              id="navbar-logo-upload"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleLogoFileChange}
            />
            {navbarLogoUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current Logo:</p>
                <img src={navbarLogoUrl} alt="Current Navbar Logo" className="mt-1 w-24 h-auto object-contain border rounded p-1" />
                <p className="text-xs text-gray-500">URL: {navbarLogoUrl}</p>
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
