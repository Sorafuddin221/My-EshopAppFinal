'use client';

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LatestBlogPostsSectionCustomize = () => {
  const [latestBlogPostsTitle, setLatestBlogPostsTitle] = useState('');
  const [latestBlogPostsDescription, setLatestBlogPostsDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const settings = await api.get('/settings', token);
        setLatestBlogPostsTitle(settings.latestBlogPostsTitle || '');
        setLatestBlogPostsDescription(settings.latestBlogPostsDescription || '');
      } catch (err) {
        console.error('Error fetching latest blog posts section settings:', err);
        toast.error('Failed to fetch latest blog posts section settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentSettings = await api.get('/settings', token);

      const updatedSettings = {
        ...currentSettings,
        latestBlogPostsTitle,
        latestBlogPostsDescription,
      };

      await api.put('/settings', updatedSettings, token);
      toast.success('Latest blog posts section settings updated successfully!');
    } catch (err) {
      console.error('Error updating latest blog posts section settings:', err);
      toast.error('Failed to update latest blog posts section settings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading latest blog posts section settings...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Customize Latest Blog Posts Section</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="mb-4">
          <label htmlFor="latestBlogPostsTitle" className="block text-gray-700 text-sm font-bold mb-2">
            Section Title:
          </label>
          <input
            type="text"
            id="latestBlogPostsTitle"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={latestBlogPostsTitle}
            onChange={(e) => setLatestBlogPostsTitle(e.target.value)}
            placeholder="Enter title for the latest blog posts section"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="latestBlogPostsDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Section Description:
          </label>
          <textarea
            id="latestBlogPostsDescription"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={latestBlogPostsDescription}
            onChange={(e) => setLatestBlogPostsDescription(e.target.value)}
            placeholder="Enter description for the latest blog posts section"
            rows={4}
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LatestBlogPostsSectionCustomize;
