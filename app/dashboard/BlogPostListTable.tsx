'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function BlogPostListTable() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchBlogPosts();
  }, [token]);

  const fetchBlogPosts = async () => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const data = await api.get('/blogposts', token);
      if (Array.isArray(data)) {
        setBlogPosts(data);
      } else {
        setMessage(data.msg || 'Failed to fetch blog posts.');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setMessage('Server error. Could not fetch blog posts.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const response = await api.delete(`/blogposts/${id}`, token);
      if (response.msg === 'Blog post removed') {
        setMessage('Blog post deleted successfully!');
        fetchBlogPosts(); // Refresh the list
      } else {
        setMessage(response.msg || 'Failed to delete blog post.');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setMessage('Server error. Could not delete blog post.');
    }
  };

  // TODO: Implement edit functionality (e.g., open a modal with pre-filled form)

  return (
    <div id="blog-post-list-section">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Blog Post List</h5>
        {message && <p className="text-sm mb-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Author</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">No Image</div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{post.title}</td>
                    <td className="py-2 px-4 border-b">{post.author}</td>
                    <td className="py-2 px-4 border-b">{post.category || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => alert('Edit functionality not yet implemented')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">No blog posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
