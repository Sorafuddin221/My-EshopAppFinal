'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { _id: string; name: string; };
  brand: { _id: string; name: string; };
  imageUrl?: string;
  rating?: number;
  buyNowUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
  thumbnailImage1Url?: string;
  thumbnailImage2Url?: string;
}

export default function AddProductSection() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productRating, setProductRating] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [thumbnailImage1, setThumbnailImage1] = useState<File | null>(null);
  const [thumbnailImage2, setThumbnailImage2] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); // State for all products

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [buyNowUrl, setBuyNowUrl] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const [editingProduct, setEditingProduct] = useState<any | null>(null); // State for product being edited

  const { token } = useAuth();

  const fetchCategoriesAndBrands = async () => {
    if (!token) return;
    try {
      const fetchedCategories = await api.get('/categories', token);
      setCategories(fetchedCategories);
      const fetchedBrands = await api.get('/brands', token);
      setBrands(fetchedBrands);
    } catch (error) {
      console.error('Error fetching categories or brands:', error);
      setMessage('Failed to load categories or brands.');
    }
  };

  const fetchProducts = async () => {
    if (!token) return;
    try {
      const fetchedProducts = await api.get('/products', token);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Failed to load products.');
    }
  };

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchCategoriesAndBrands = async () => {
      if (!token) return;
      try {
        const fetchedCategories = await api.get('/categories', token);
        if (isMounted) {
          setCategories(fetchedCategories);
        }
        const fetchedBrands = await api.get('/brands', token);
        if (isMounted) {
          setBrands(fetchedBrands);
        }
      } catch (error) {
        console.error('Error fetching categories or brands:', error);
        if (isMounted) {
          setMessage('Failed to load categories or brands.');
        }
      }
    };

    const fetchProducts = async () => {
      if (!token) return;
      try {
        const fetchedProducts = await api.get('/products', token);
        if (isMounted) {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isMounted) {
          setMessage('Failed to load products.');
        }
      }
    };

    fetchCategoriesAndBrands();
    fetchProducts();

    return () => {
      isMounted = false; // Set flag to false when component unmounts
    };
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
        fetchCategoriesAndBrands(); // Re-fetch to update dropdown
      } else {
        setMessage(response.msg || 'Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage('Server error. Could not add category.');
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setMessage('Brand name cannot be empty.');
      return;
    }
    try {
      const response = await api.post('/brands', { name: newBrandName }, token);
      if (response._id) {
        setMessage('Brand added successfully!');
        setNewBrandName('');
        setShowNewBrandInput(false);
        fetchCategoriesAndBrands(); // Re-fetch to update dropdown
      } else {
        setMessage(response.msg || 'Failed to add brand.');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      setMessage('Server error. Could not add brand.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await api.delete(`/products/${productId}`, token);
      if (response.msg === 'Product removed') {
        setMessage('Product deleted successfully!');
        fetchProducts();
      } else {
        setMessage(response.error || 'Server error. Could not delete product.');
      } // Re-fetch products after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Server error. Could not delete product.');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductName(product.name || '');
    setProductDescription(product.description || '');
    setProductPrice(product.price !== undefined && product.price !== null ? String(product.price) : ''); // Convert to string for input
    setProductStock(product.stock !== undefined && product.stock !== null ? String(product.stock) : '');
    setProductRating(product.rating !== undefined && product.rating !== null ? String(product.rating) : '');
    setSelectedCategory(product.category ? product.category._id : '');
    setSelectedBrand(product.brand ? product.brand._id : '');
    setBuyNowUrl(product.buyNowUrl || '');
    setMetaDescription(product.metaDescription || '');
    setMetaKeywords(product.metaKeywords || '');
    // Note: Image cannot be pre-filled for security reasons, user will re-upload if needed
    setMessage(''); // Clear any previous messages
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/uploads', formData, token, true);
    return res.imageUrl;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    if (!selectedCategory || !selectedBrand) {
      setMessage('Error: Please select a category and a brand.');
      return;
    }

    try {
      let imageUrl = editingProduct ? editingProduct.imageUrl : '';
      let thumbnail1Url = editingProduct ? editingProduct.thumbnailImage1Url : '';
      let thumbnail2Url = editingProduct ? editingProduct.thumbnailImage2Url : '';

      if (productImage) {
        imageUrl = await uploadImage(productImage);
      }
      if (thumbnailImage1) {
        thumbnail1Url = await uploadImage(thumbnailImage1);
      }
      if (thumbnailImage2) {
        thumbnail2Url = await uploadImage(thumbnailImage2);
      }

      const productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        stock: productStock,
        category: selectedCategory,
        brand: selectedBrand,
        buyNowUrl,
        rating: productRating,
        metaDescription,
        metaKeywords,
        imageUrl,
        thumbnailImage1Url: thumbnail1Url,
        thumbnailImage2Url: thumbnail2Url,
      };

      let response;
      if (editingProduct) {
        // Update existing product
        response = await api.put(`/products/${editingProduct._id}`, productData, token);
      } else {
        // Add new product
        response = await api.post('/products', productData, token);
      }

      if (response._id) {
        setMessage(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
        // Clear form
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setProductStock('');
        setSelectedCategory('');
        setSelectedBrand('');
        setProductImage(null);
        setThumbnailImage1(null);
        setThumbnailImage2(null);
        setBuyNowUrl('');
        setMetaDescription('');
        setMetaKeywords('');
        setEditingProduct(null); // Exit editing mode
        fetchProducts(); // Re-fetch products
      } else {
        setMessage(response.msg || `Failed to ${editingProduct ? 'update' : 'add'} product.`);
      }
    } catch (error) {
      console.error(`Error ${editingProduct ? 'updating' : 'adding'} product:`, error);
      setMessage(`Server error. Could not ${editingProduct ? 'update' : 'add'} product.`);
    }  };

  return (
    <div id="add-product-section">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label htmlFor="product-name" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
              <input
                type="text"
                id="product-name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="product-price" className="block text-gray-700 text-sm font-bold mb-2">Product Price</label>
              <input
                type="number"
                id="product-price"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="product-stock" className="block text-gray-700 text-sm font-bold mb-2">Product Stock</label>
              <input
                type="number"
                id="product-stock"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product stock"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="product-rating" className="block text-gray-700 text-sm font-bold mb-2">Product Rating (0-5)</label>
              <input
                type="number"
                id="product-rating"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product rating"
                value={productRating}
                onChange={(e) => setProductRating(e.target.value)}
                min="0" max="5" step="0.1"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="product-description" className="block text-gray-700 text-sm font-bold mb-2">Product Description</label>
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
              value={productDescription}
              onEditorChange={(content, editor) => setProductDescription(content)}
            />
          </div>

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label htmlFor="product-category" className="block text-gray-700 text-sm font-bold mb-2">Product Category</label>
              <div className="flex">
                <select
                  id="product-category"
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
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="product-brand" className="block text-gray-700 text-sm font-bold mb-2">Product Brand</label>
              <div className="flex">
                <select
                  id="product-brand"
                  className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  required
                >
                  <option value="">Select a Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewBrandInput(!showNewBrandInput)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                >
                  {showNewBrandInput ? 'Cancel' : 'Add New'}
                </button>
              </div>
              {showNewBrandInput && (
                <div className="flex mt-2">
                  <input
                    type="text"
                    className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="New Brand Name"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddBrand}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="product-image" className="block text-gray-700 text-sm font-bold mb-2">Product Image</label>
            <input
              type="file"
              id="product-image"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="thumbnail-image-1" className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Image 1</label>
            <input
              type="file"
              id="thumbnail-image-1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setThumbnailImage1(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="thumbnail-image-2" className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Image 2</label>
            <input
              type="file"
              id="thumbnail-image-2"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setThumbnailImage2(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="buy-now-url" className="block text-gray-700 text-sm font-bold mb-2">Buy Now URL</label>
            <input
              type="url"
              id="buy-now-url"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter external URL for 'Buy Now' button"
              value={buyNowUrl}
              onChange={(e) => setBuyNowUrl(e.target.value)}
            />
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
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setProductName('');
                setProductDescription('');
                setProductPrice('');
                setProductStock('');
                setSelectedCategory('');
                setSelectedBrand('');
                setProductImage(null);
                setBuyNowUrl('');
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

      {/* Product List Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Existing Products</h5>
        {products.length === 0 ? (
          <p className="text-gray-600">No products added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{product.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                      {product.price !== undefined && product.price !== null ? `${product.price.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{product.category ? product.category.name : 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{product.brand ? product.brand.name : 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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