'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface Author {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthorListTableProps {
  authors: Author[];
}

export default function AuthorListTable({ authors: initialAuthors }: AuthorListTableProps) {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    setAuthors(initialAuthors);
  }, [initialAuthors]);

  const fetchAuthors = async () => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const data = await api.get('/authors', token);
      if (Array.isArray(data)) {
        setAuthors(data);
      } else {
        setMessage(data.msg || 'Failed to fetch authors.');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setMessage('Server error. Could not fetch authors.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const response = await api.delete(`/authors/${id}`, token);
      if (response.msg === 'User deleted') {
        setMessage('Author deleted successfully!');
        fetchAuthors(); // Refresh the list
      } else {
        setMessage(response.msg || 'Failed to delete author.');
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      setMessage('Server error. Could not delete author.');
    }
  };

  return (
    <div id="author-list-section">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Author List</h5>
                                        {message && <p className="text-sm mb-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Date Joined</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.length > 0 ? (
                authors.map((author) => (
                  <tr key={author._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{author.username}</td>
                    <td className="py-2 px-4 border-b">{author.email}</td>
                    <td className="py-2 px-4 border-b">{author.role}</td>
                    <td className="py-2 px-4 border-b">{new Date(author.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => alert('Edit functionality not yet implemented')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(author._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">No authors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
