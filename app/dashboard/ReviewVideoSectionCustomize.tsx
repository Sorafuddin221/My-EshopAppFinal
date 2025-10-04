'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';


const ReviewVideoSectionCustomize = () => {
  const [reviewVideoUrl, setReviewVideoUrl] = useState('');
  const [reviewVideoTitle, setReviewVideoTitle] = useState('');
  const [reviewVideoDescription, setReviewVideoDescription] = useState('');
  const [reviewVideoPlaceholderImage, setReviewVideoPlaceholderImage] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchSettings = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const settings = await api.get('/settings', token);
      setReviewVideoUrl(settings.reviewVideoUrl || '');
      setReviewVideoTitle(settings.reviewVideoTitle || '');
      setReviewVideoDescription(settings.reviewVideoDescription || '');
      setReviewVideoPlaceholderImage(settings.reviewVideoPlaceholderImage || '');
    } catch (err) {
      console.error('Error fetching review video section settings:', err);
      toast.error('Failed to fetch review video section settings.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentSettings = await api.get('/settings', token);

      const updatedSettings = {
        ...currentSettings,
        reviewVideoUrl,
        reviewVideoTitle,
        reviewVideoDescription,
        reviewVideoPlaceholderImage,
      };

      await api.put('/settings', updatedSettings, token);
      toast.success('Review video section settings updated successfully!');
      await fetchSettings(); // Re-fetch settings to update UI with latest data
    } catch (err) {
      console.error('Error updating review video section settings:', err);
      toast.error('Failed to update review video section settings.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="text-center py-4">Loading review video section settings...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Customize Review Video Section</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="mb-4">
          <label htmlFor="reviewVideoUrl" className="block text-gray-700 text-sm font-bold mb-2">
            Review Video URL:
          </label>
          <input
            type="text"
            id="reviewVideoUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={reviewVideoUrl}
            onChange={(e) => setReviewVideoUrl(e.target.value)}
            placeholder="Enter video URL (e.g., YouTube embed link)"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reviewVideoTitle" className="block text-gray-700 text-sm font-bold mb-2">
            Review Video Title:
          </label>
          <input
            type="text"
            id="reviewVideoTitle"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={reviewVideoTitle}
            onChange={(e) => setReviewVideoTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reviewVideoDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Review Video Description:
          </label>
          <textarea
            id="reviewVideoDescription"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={reviewVideoDescription}
            onChange={(e) => setReviewVideoDescription(e.target.value)}
            placeholder="Enter video description"
            rows={4}
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="reviewVideoPlaceholderImage" className="block text-gray-700 text-sm font-bold mb-2">
            Review Video Placeholder Image URL:
          </label>
          <input
            type="text"
            id="reviewVideoPlaceholderImage"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={reviewVideoPlaceholderImage}
            onChange={(e) => setReviewVideoPlaceholderImage(e.target.value)}
            placeholder="Enter placeholder image URL"
          />
          {reviewVideoPlaceholderImage && (
            <div className="mt-4">
              <p className="block text-gray-700 text-sm font-bold mb-2">Image Preview:</p>
              <img src={reviewVideoPlaceholderImage} alt="Placeholder Preview" className="max-w-xs h-auto rounded-md shadow-md" />
            </div>
          )}
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

      <hr className="my-8" />

      
    </div>
  );
};

export default ReviewVideoSectionCustomize;
