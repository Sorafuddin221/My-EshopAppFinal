'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string; };
  brand?: { _id: string; name: string; };
  imageUrl?: string;
  rating?: number;
}

export default function ProductListTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const data = await api.get('/products', token);
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setMessage(data.msg || 'Failed to fetch products.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Server error. Could not fetch products.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const response = await api.delete(`/products/${id}`, token);
      if (response.msg === 'Product removed') {
        setMessage('Product deleted successfully!');
        fetchProducts(); // Refresh the list
      } else {
        setMessage(response.msg || 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Server error. Could not delete product.');
    }
  };

  // TODO: Implement edit functionality (e.g., open a modal with pre-filled form)

  return (
    <div id="product-list-section">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Product List</h5>
        {message && <p className="text-sm mb-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Brand</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Rating</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">No Image</div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{product.name}</td>
                    <td className="py-2 px-4 border-b">{product.category ? product.category.name : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{product.brand ? product.brand.name : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{product.rating !== undefined ? product.rating.toFixed(1) : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => alert('Edit functionality not yet implemented')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
