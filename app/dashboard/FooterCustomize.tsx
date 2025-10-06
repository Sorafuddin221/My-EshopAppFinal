'use client';

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const FooterCustomize = () => {
  const [footerAboutText, setFooterAboutText] = useState('');
  const [footerCopyrightText, setFooterCopyrightText] = useState('');
  const [footerPaymentImages, setFooterPaymentImages] = useState<string[]>([]);
  const [footerSocialLinks, setFooterSocialLinks] = useState<{ platform: string; url: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const supportedPlatforms = ['twitter', 'facebook', 'pinterest', 'google-plus'];

  const fetchSettings = async () => {
    if (!token) return;
    try {
      const settings = await api.get('/settings', token);
      setFooterAboutText(settings.footerAboutText || '');
      setFooterCopyrightText(settings.footerCopyrightText || '');
      setFooterSocialLinks(settings.footerSocialLinks || []);
      setFooterPaymentImages(settings.footerPaymentImages || []);
    } catch (err) {
      console.error('Error fetching footer settings:', err);
      toast.error('Failed to fetch footer settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleAddImage = () => {
    setFooterPaymentImages([...footerPaymentImages, '']);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = footerPaymentImages.filter((_, i) => i !== index);
    setFooterPaymentImages(newImages);
  };

  const handleAddSocialLink = () => {
    setFooterSocialLinks([...footerSocialLinks, { platform: '', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = footerSocialLinks.filter((_, i) => i !== index);
    setFooterSocialLinks(newLinks);
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...footerSocialLinks];
    newLinks[index][field] = value;
    setFooterSocialLinks(newLinks);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResponse = await api.post('/uploads', formData, token, true);
      if (uploadResponse.imageUrl) {
        const newImages = [...footerPaymentImages];
        newImages[index] = uploadResponse.imageUrl;
        setFooterPaymentImages(newImages);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Image upload failed: No image URL returned.');
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      toast.error(err.message || 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Fetch existing settings
      const existingSettings = await api.get('/settings', token);

      const updatedSettings = {
        ...existingSettings,
        footerAboutText,
        footerCopyrightText,
        footerPaymentImages,
        footerSocialLinks,
      };
      await api.put('/settings', updatedSettings, token);
      toast.success('Footer settings updated successfully!');
    } catch (err) {
      console.error('Error updating footer settings:', err);
      toast.error('Failed to update footer settings.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading footer settings...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Customize Footer</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="mb-4">
          <label htmlFor="footerAboutText" className="block text-gray-700 text-sm font-bold mb-2">
            About Text:
          </label>
          <textarea
            id="footerAboutText"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={footerAboutText}
            onChange={(e) => setFooterAboutText(e.target.value)}
            placeholder="Enter about text for the footer"
            rows={4}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="footerCopyrightText" className="block text-gray-700 text-sm font-bold mb-2">
            Copyright Text:
          </label>
          <input
            type="text"
            id="footerCopyrightText"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={footerCopyrightText}
            onChange={(e) => setFooterCopyrightText(e.target.value)}
            placeholder="Enter copyright text"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Payment Images</h3>
          {footerPaymentImages.map((image, index) => (
            <div key={index} className="flex items-end mb-4 p-2 border rounded-md">
              <div className="flex-grow mr-2">
                <label htmlFor={`paymentImageUpload-${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                  Image {index + 1}:
                </label>
                {image && image !== '' && (
                  <div className="mb-2">
                    <img src={image} alt={`Payment ${index + 1}`} className="max-w-xs h-auto border rounded" />
                  </div>
                )}
                <input
                  type="file"
                  id={`paymentImageUpload-${index}`}
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, index)}
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById(`paymentImageUpload-${index}`)?.click()}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Upload Image
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Add New Payment Image
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          {footerSocialLinks.map((link, index) => (
            <div key={index} className="flex items-end mb-4 p-2 border rounded-md">
              <div className="flex-grow mr-2">
                <label htmlFor={`platform-${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                  Platform:
                </label>
                <select
                  id={`platform-${index}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                >
                  <option value="">Select Platform</option>
                  {supportedPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-grow mr-2">
                <label htmlFor={`url-${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                  URL:
                </label>
                <input
                  type="text"
                  id={`url-${index}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder="Enter URL"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Add New Social Link
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default FooterCustomize;