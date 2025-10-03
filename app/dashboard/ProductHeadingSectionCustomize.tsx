import React, { useState, useEffect } from 'react';

const ProductHeadingSectionCustomize = () => {
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('productHeadingSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setTitle(parsedSettings.title || '');
        setSubheading(parsedSettings.subheading || '');
      } catch (e) {
        console.error("Error parsing product heading settings from localStorage", e);
        // Fallback to default if parsing fails
        setTitle('Our Featured Products');
        setSubheading('Discover a selection of our best-selling and most innovative products.');
      }
    } else {
      setTitle('Our Featured Products');
      setSubheading('Discover a selection of our best-selling and most innovative products.');
    }
  }, []);

  const handleSave = () => {
    const settingsToSave = { title, subheading };
    localStorage.setItem('productHeadingSettings', JSON.stringify(settingsToSave));
    alert('Product Heading Section settings saved!');
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">Customize Product Heading Section</h3>
      <div className="mb-4">
        <label htmlFor="headingTitle" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="headingTitle"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="headingSubheading" className="block text-sm font-medium text-gray-700">Subheading</label>
        <textarea
          id="headingSubheading"
          rows={2}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
        ></textarea>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProductHeadingSectionCustomize;
