'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function HeroSectionCustomize() {
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroMainText, setHeroMainText] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('');
  const [heroButtonUrl, setHeroButtonUrl] = useState('');
  const [heroTextColor, setHeroTextColor] = useState('');
  const [heroOverlayColor, setHeroOverlayColor] = useState('');
  const [heroOverlayOpacity, setHeroOverlayOpacity] = useState(1); // New state for opacity, default to 1 (fully opaque)
  const [heroButtonBgColor, setHeroButtonBgColor] = useState('');
  const [heroButtonTextColor, setHeroButtonTextColor] = useState('');
  const [heroHeadingFontSize, setHeroHeadingFontSize] = useState('');
  const [message, setMessage] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/settings');
        if (settings) {
          setHeroImageUrl(settings.heroImageUrl || '');
          setHeroMainText(settings.heroMainText || '');
          setHeroButtonText(settings.heroButtonText || '');
          setHeroButtonUrl(settings.heroButtonUrl || '');
          setHeroTextColor(settings.heroTextColor || '');
          // Parse heroOverlayColor to extract color and opacity
          if (settings.heroOverlayColor && settings.heroOverlayColor.startsWith('rgba')) {
            const parts = settings.heroOverlayColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d\.]+)\)/);
            if (parts && parts.length === 5) {
              const r = parseInt(parts[1]).toString(16).padStart(2, '0');
              const g = parseInt(parts[2]).toString(16).padStart(2, '0');
              const b = parseInt(parts[3]).toString(16).padStart(2, '0');
              setHeroOverlayColor(`#${r}${g}${b}`);
              setHeroOverlayOpacity(parseFloat(parts[4]));
            } else {
              setHeroOverlayColor(settings.heroOverlayColor || '');
              setHeroOverlayOpacity(1);
            }
          } else {
            setHeroOverlayColor(settings.heroOverlayColor || '');
            setHeroOverlayOpacity(1);
          }
          setHeroButtonBgColor(settings.heroButtonBgColor || '');
          setHeroButtonTextColor(settings.heroButtonTextColor || '');
          setHeroHeadingFontSize(settings.heroHeadingFontSize || '');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage('Failed to load settings.');
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    try {
      const currentSettings = await api.get('/settings', token);

      const updatedSettings = {
        ...currentSettings,
        heroImageUrl,
        heroMainText,
        heroButtonText,
        heroButtonUrl,
        heroTextColor,
        heroOverlayColor: heroOverlayColor.startsWith('rgba') ? heroOverlayColor : `rgba(${parseInt(heroOverlayColor.slice(1, 3), 16)}, ${parseInt(heroOverlayColor.slice(3, 5), 16)}, ${parseInt(heroOverlayColor.slice(5, 7), 16)}, ${heroOverlayOpacity})`,
        heroButtonBgColor,
        heroButtonTextColor,
        heroHeadingFontSize,
      };

      const response = await api.put('/settings', updatedSettings, token);

      if (response) {
        setMessage('Settings updated successfully!');
        setHeroImageUrl(response.heroImageUrl || '');
        setHeroMainText(response.heroMainText || '');
        setHeroButtonText(response.heroButtonText || '');
        setHeroButtonUrl(response.heroButtonUrl || '');
        setHeroTextColor(response.heroTextColor || '');
        setHeroOverlayColor(response.heroOverlayColor || '');
        setHeroButtonBgColor(response.heroButtonBgColor || '');
        setHeroButtonTextColor(response.heroButtonTextColor || '');
        setHeroHeadingFontSize(response.heroHeadingFontSize || '');
      } else {
        setMessage(response.msg || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Server error. Could not update settings.');
    }
  };

  return (
    <div id="hero-section-customize">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Hero Section</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="hero-image-url" className="block text-gray-700 text-sm font-bold mb-2">Hero Image URL</label>
            <input
              type="text"
              id="hero-image-url"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter hero image URL"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-main-text" className="block text-gray-700 text-sm font-bold mb-2">Hero Main Text</label>
            <input
              type="text"
              id="hero-main-text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter hero main text"
              value={heroMainText}
              onChange={(e) => setHeroMainText(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-button-text" className="block text-gray-700 text-sm font-bold mb-2">Hero Button Text</label>
            <input
              type="text"
              id="hero-button-text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter hero button text"
              value={heroButtonText}
              onChange={(e) => setHeroButtonText(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-button-url" className="block text-gray-700 text-sm font-bold mb-2">Hero Button URL</label>
            <input
              type="text"
              id="hero-button-url"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter hero button URL"
              value={heroButtonUrl}
              onChange={(e) => setHeroButtonUrl(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-text-color" className="block text-gray-700 text-sm font-bold mb-2">Hero Text Color</label>
            <input
              type="color"
              id="hero-text-color"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={heroTextColor}
              onChange={(e) => setHeroTextColor(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-overlay-color" className="block text-gray-700 text-sm font-bold mb-2">Hero Overlay Color</label>
            <input
              type="color"
              id="hero-overlay-color"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={heroOverlayColor.startsWith('rgba') ? heroOverlayColor.substring(0, heroOverlayColor.lastIndexOf(',')).replace('rgba(', '#') : heroOverlayColor}
              onChange={(e) => {
                const color = e.target.value;
                const opacity = heroOverlayOpacity;
                setHeroOverlayColor(`rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`);
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-overlay-opacity" className="block text-gray-700 text-sm font-bold mb-2">Hero Overlay Opacity</label>
            <input
              type="range"
              id="hero-overlay-opacity"
              min="0"
              max="1"
              step="0.01"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={heroOverlayOpacity}
              onChange={(e) => {
                const opacity = parseFloat(e.target.value);
                setHeroOverlayOpacity(opacity);
                // Update the RGBA string with new opacity
                if (heroOverlayColor.startsWith('rgba')) {
                  const parts = heroOverlayColor.split(',');
                  setHeroOverlayColor(`rgba(${parts[0].split('(')[1]}, ${parts[1]}, ${parts[2]}, ${opacity})`);
                }
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-button-bg-color" className="block text-gray-700 text-sm font-bold mb-2">Hero Button Background Color</label>
            <input
              type="color"
              id="hero-button-bg-color"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={heroButtonBgColor}
              onChange={(e) => setHeroButtonBgColor(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-button-text-color" className="block text-gray-700 text-sm font-bold mb-2">Hero Button Text Color</label>
            <input
              type="color"
              id="hero-button-text-color"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={heroButtonTextColor}
              onChange={(e) => setHeroButtonTextColor(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="hero-heading-font-size" className="block text-gray-700 text-sm font-bold mb-2">Hero Heading Font Size</label>
            <input
              type="text"
              id="hero-heading-font-size"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter hero heading font size (e.g., 5xl)"
              value={heroHeadingFontSize}
              onChange={(e) => setHeroHeadingFontSize(e.target.value)}
            />
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
