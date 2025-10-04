'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function TeamLeaderSectionCustomize() {
  const [teamLeaderImage, setTeamLeaderImage] = useState('');
  const [teamLeaderTitle, setTeamLeaderTitle] = useState('');
  const [teamLeaderSubtitle, setTeamLeaderSubtitle] = useState('');
  const [teamLeaderAvatar, setTeamLeaderAvatar] = useState('');
  const [teamLeaderAuthor, setTeamLeaderAuthor] = useState('');
  const [teamLeaderRole, setTeamLeaderRole] = useState('');
  const [teamLeaderRating, setTeamLeaderRating] = useState(0);
  const [teamLeaderText, setTeamLeaderText] = useState('');
  const [teamLeaderVideoUrl, setTeamLeaderVideoUrl] = useState('');
  const [teamLeaderImageFile, setTeamLeaderImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/settings');
        if (settings) {
          setTeamLeaderImage(settings.teamLeaderImage || '');
          setTeamLeaderTitle(settings.teamLeaderTitle || '');
          setTeamLeaderSubtitle(settings.teamLeaderSubtitle || '');
          setTeamLeaderAvatar(settings.teamLeaderAvatar || '');
          setTeamLeaderAuthor(settings.teamLeaderAuthor || '');
          setTeamLeaderRole(settings.teamLeaderRole || '');
          setTeamLeaderRating(settings.teamLeaderRating || 0);
          setTeamLeaderText(settings.teamLeaderText || '');
          setTeamLeaderVideoUrl(settings.teamLeaderVideoUrl || '');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage('Failed to load settings.');
      }
    };
    fetchSettings();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeamLeaderImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    try {
      let newTeamLeaderImageUrl = teamLeaderImage;

      if (teamLeaderImageFile) {
        const formData = new FormData();
        formData.append('image', teamLeaderImageFile);
        const uploadResponse = await api.post('/uploads', formData, token, true);
        newTeamLeaderImageUrl = uploadResponse.imageUrl;
      }

      const currentSettings = await api.get('/settings', token);

      const updatedSettings = {
        ...currentSettings,
        teamLeaderImage: newTeamLeaderImageUrl,
        teamLeaderTitle,
        teamLeaderSubtitle,
        teamLeaderAvatar,
        teamLeaderAuthor,
        teamLeaderRole,
        teamLeaderRating,
        teamLeaderText,
        teamLeaderVideoUrl,
      };

      const response = await api.put('/settings', updatedSettings, token);

      if (response) {
        setMessage('Settings updated successfully!');
        setTeamLeaderImage(response.teamLeaderImage || '');
        setTeamLeaderTitle(response.teamLeaderTitle || '');
        setTeamLeaderSubtitle(response.teamLeaderSubtitle || '');
        setTeamLeaderAvatar(response.teamLeaderAvatar || '');
        setTeamLeaderAuthor(response.teamLeaderAuthor || '');
        setTeamLeaderRole(response.teamLeaderRole || '');
        setTeamLeaderRating(response.teamLeaderRating || 0);
        setTeamLeaderText(response.teamLeaderText || '');
        setTeamLeaderVideoUrl(response.teamLeaderVideoUrl || '');
        setTeamLeaderImageFile(null);
      } else {
        setMessage(response.msg || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Server error. Could not update settings.');
    }
  };

  return (
    <div id="team-leader-section-customize">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Team Leader Section</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="team-leader-image" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Image</label>
            <input
              type="file"
              id="team-leader-image"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleImageChange}
            />
            {teamLeaderImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current Image:</p>
                <img src={teamLeaderImage} alt="Team Leader Image" className="mt-1 w-24 h-auto object-contain border rounded p-1" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-title" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Title</label>
            <input
              type="text"
              id="team-leader-title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader title"
              value={teamLeaderTitle}
              onChange={(e) => setTeamLeaderTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-subtitle" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Subtitle</label>
            <input
              type="text"
              id="team-leader-subtitle"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader subtitle"
              value={teamLeaderSubtitle}
              onChange={(e) => setTeamLeaderSubtitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-avatar" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Avatar URL</label>
            <input
              type="text"
              id="team-leader-avatar"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader avatar URL"
              value={teamLeaderAvatar}
              onChange={(e) => setTeamLeaderAvatar(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-author" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Author</label>
            <input
              type="text"
              id="team-leader-author"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader author"
              value={teamLeaderAuthor}
              onChange={(e) => setTeamLeaderAuthor(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-role" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Role</label>
            <input
              type="text"
              id="team-leader-role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader role"
              value={teamLeaderRole}
              onChange={(e) => setTeamLeaderRole(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-rating" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Rating</label>
            <input
              type="number"
              id="team-leader-rating"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader rating"
              value={teamLeaderRating}
              onChange={(e) => setTeamLeaderRating(parseInt(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-text" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Text</label>
            <textarea
              id="team-leader-text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader text"
              value={teamLeaderText}
              onChange={(e) => setTeamLeaderText(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="team-leader-video-url" className="block text-gray-700 text-sm font-bold mb-2">Team Leader Video URL</label>
            <input
              type="text"
              id="team-leader-video-url"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter team leader video URL"
              value={teamLeaderVideoUrl}
              onChange={(e) => setTeamLeaderVideoUrl(e.target.value)}
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