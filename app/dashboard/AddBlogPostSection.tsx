'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AddBlogPostSection() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const { token } = useAuth();

  const fetchBlogPosts = async () => {
    if (!token) return;
    try {
      const fetchedPosts = await api.get('/blogposts', token);
      setBlogPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setMessage('Failed to load blog posts.');
    }
  };

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const fetchedCategories = await api.get('/categories', token);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Failed to load categories.');
    }
  };

  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, [token]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setMessage('Category name cannot be empty.');
      return;
    }
    try {
      const response = await api.post('/categories', { name: newCategoryName }, token);
      if (response._id) {
        setMessage('Category added successfully!');
        setNewCategoryName('');
        setShowNewCategoryInput(false);
        fetchCategories(); // Re-fetch to update dropdown
      } else {
        setMessage(response.msg || 'Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage('Server error. Could not add category.');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const response = await api.delete(`/blogposts/${postId}`, token);
      if (response.msg === 'Blog post removed') {
        setMessage('Blog post deleted successfully!');
        fetchBlogPosts();
      } else {
        setMessage(response.error || 'Server error. Could not delete blog post.');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setMessage('Server error. Could not delete blog post.');
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title || '');
    setContent(post.content || '');
    setAuthor(post.author || '');
    setSelectedCategory(post.category ? post.category._id : '');
    setImageUrl(post.imageUrl || '');
    setMetaDescription(post.metaDescription || '');
    setMetaKeywords(post.metaKeywords || '');
    setMessage('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 1 * 1024 * 1024; // 1MB

      if (!allowedTypes.includes(file.type)) {
        setMessage('Error: Only JPEG, PNG, and GIF images are allowed.');
        setImage(null);
        return;
      }

      if (file.size > maxSize) {
        setMessage('Error: Image size cannot exceed 1MB.');
        setImage(null);
        return;
      }

      setImage(file);
      setMessage(''); // Clear previous messages
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    if (!selectedCategory) {
      setMessage('Error: Please select a category.');
      return;
    }

    if (!editingPost && !image) {
      setMessage('Please select an image for the blog post.');
      return;
    }

    try {
        let imageUrlToSave = editingPost ? imageUrl : '';

        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            const uploadResponse = await api.post('/uploads', formData, token, true);
            if (uploadResponse.imageUrl) {
                imageUrlToSave = uploadResponse.imageUrl;
            } else {
                setMessage('Image upload failed. Please try again.');
                return;
            }
        }

        const blogPostData = {
            title,
            content,
            author,
            category: selectedCategory,
            imageUrl: imageUrlToSave,
            metaDescription,
            metaKeywords,
        };

        let response;
        if (editingPost) {
            response = await api.put(`/blogposts/${editingPost._id}`, blogPostData, token);
        } else {
            response = await api.post('/blogposts', blogPostData, token);
        }

        if (response._id) {
            setMessage(`Blog post ${editingPost ? 'updated' : 'added'} successfully!`);
            setTitle('');
            setContent('');
            setAuthor('');
            setSelectedCategory('');
            setImage(null);
            setImageUrl('');
            setMetaDescription('');
            setMetaKeywords('');
            setEditingPost(null);
            fetchBlogPosts();
        } else {
            setMessage(response.msg || `Failed to ${editingPost ? 'update' : 'add'} blog post.`);
        }
    } catch (error) {
        console.error(`Error ${editingPost ? 'updating' : 'adding'} blog post:`, error);
        setMessage(`Server error. Could not ${editingPost ? 'update' : 'add'} blog post.`);
    }
  };

  return (
    <div id="add-blog-post-section">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="blog-post-title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              id="blog-post-title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter blog post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="blog-post-content" className="block text-gray-700 text-sm font-bold mb-2">Content</label>
            <Editor
              apiKey="jinv9suq53hvoazfy9dayv42ue9u5c5371jn9rbsoggawqx3" // Replace with your TinyMCE API key
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                  'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help'
              }}
              value={content}
              onEditorChange={(content, editor) => setContent(content)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="blog-post-author" className="block text-gray-700 text-sm font-bold mb-2">Author</label>
            <input
              type="text"
              id="blog-post-author"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="blog-post-category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <div className="flex">
                <select
                id="blog-post-category"
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
                </select>
                <button
                type="button"
                onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                >
                {showNewCategoryInput ? 'Cancel' : 'Add New'}
                </button>
            </div>
            {showNewCategoryInput && (
                <div className="flex mt-2">
                <input
                    type="text"
                    className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="New Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                >
                    Save
                </button>
                </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="blog-post-image" className="block text-gray-700 text-sm font-bold mb-2">Blog Post Image</label>
            <input
              type="file"
              id="blog-post-image"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleImageChange}
            />
            {editingPost && imageUrl && (
                <p className="text-sm text-gray-500 mt-1">Current image: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl.split('/').pop()}</a></p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="meta-description" className="block text-gray-700 text-sm font-bold mb-2">Meta Description</label>
            <textarea
              id="meta-description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter meta description for SEO"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="meta-keywords" className="block text-gray-700 text-sm font-bold mb-2">Meta Keywords</label>
            <input
              type="text"
              id="meta-keywords"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter meta keywords, separated by commas"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
            />
          </div>
          {message && <p className="text-sm mt-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {editingPost ? 'Update Blog Post' : 'Add Blog Post'}
          </button>
          {editingPost && (
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setTitle('');
                setContent('');
                setAuthor('');
                setSelectedCategory('');
                setImage(null);
                setImageUrl('');
                setMetaDescription('');
                setMetaKeywords('');
                setMessage('');
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Existing Blog Posts</h5>
        {blogPosts.length === 0 ? (
          <p className="text-gray-600">No blog posts added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr key={post._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{post.title}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{post.category}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{post.author}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}