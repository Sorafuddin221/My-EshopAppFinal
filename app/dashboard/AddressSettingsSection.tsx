'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AddressSettingsSection() {
  const [address, setAddress] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [emails, setEmails] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/address-settings');
        if (settings) {
          setAddress(settings.address || '');
          setPhoneNumbers(settings.phoneNumbers.join(', ') || '');
          setEmails(settings.emails.join(', ') || '');
          setDescription(settings.description || '');
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
      const updatedSettings = {
        address,
        phoneNumbers: phoneNumbers.split(',').map(num => num.trim()),
        emails: emails.split(',').map(email => email.trim()),
        description,
      };

      const response = await api.post('/address-settings', updatedSettings, token);

      if (response) {
        setMessage('Settings updated successfully!');
        setAddress(response.address || '');
        setPhoneNumbers(response.phoneNumbers.join(', ') || '');
        setEmails(response.emails.join(', ') || '');
        setDescription(response.description || '');
      } else {
        setMessage(response.msg || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Server error. Could not update settings.');
    }
  };

  return (
    <div id="address-settings-section">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Address Settings</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
              type="text"
              id="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone-numbers" className="block text-gray-700 text-sm font-bold mb-2">Phone Numbers (comma-separated)</label>
            <input
              type="text"
              id="phone-numbers"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter phone numbers"
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="emails" className="block text-gray-700 text-sm font-bold mb-2">Emails (comma-separated)</label>
            <input
              type="text"
              id="emails"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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