
'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import AuthorListTable from './AuthorListTable';

interface Author {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const AddAuthorSection = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('author');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const { token } = useAuth();

  const fetchAuthors = async () => {
    if (!token) {
      return;
    }
    try {
      const data = await api.get('/authors', token);
      if (Array.isArray(data)) {
        setAuthors(data);
      } else {
        setMessage(data.msg || 'Failed to fetch authors.');
      }
    } catch (error: any) {
      console.error('Error fetching authors:', error);
      setMessage('Server error. Could not fetch authors.');
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (file) {
      formData.append('profileImage', file);
    }

    try {
      await api.post('/authors', formData, token, true);
      setMessage('Author added successfully!');
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setFile(null);
      // Refresh authors list
      fetchAuthors();
    } catch (error: any) {
      setMessage(error.message || 'Server error. Could not add author.');
    }
  };

  return (
    <div id="add-author-section">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Add New Author</h5>
        {message && <p className="text-sm mb-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="user">Author</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Author
            </button>
          </div>
        </form>
      </div>
      <div className="mt-8">
        <AuthorListTable authors={authors} />
      </div>
    </div>
  );
};

export default AddAuthorSection;
