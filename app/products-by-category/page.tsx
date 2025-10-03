'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import BackToTopButton from '../components/BackToTopButton';
import ArchiveHeader from '../products/ArchiveHeader';
import Sidebar from '../products/Sidebar';
import ProductCard from '../components/ProductCard';
import api from '../../utils/api';

const ProductsByCategoryPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await api.get('/categories');
        if (Array.isArray(fetchedCategories)) {
            setCategories(fetchedCategories);
            if (fetchedCategories.length > 0) {
              setSelectedCategory(fetchedCategories[0]._id); // Select the first category by default
            }
        } else {
            setError('Failed to load categories.');
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when selectedCategory changes
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      try {
        const fetchedProducts = await api.get(`/products?category=${selectedCategory}`);
        if(Array.isArray(fetchedProducts)) {
            setProducts(fetchedProducts);
            setOriginalProducts(fetchedProducts);
        } else {
            setError('Failed to load products for this category.');
        }
      } catch (err: any) {
        console.error('Error fetching products by category:', err);
        setError('Failed to load products for this category.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductsByCategory();
  }, [selectedCategory]);

  const handleSearch = (searchQuery: string, category: string) => {
    let filtered = originalProducts;

    if (searchQuery) {
        filtered = originalProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    setProducts(filtered);
  };

  const handleCategoryChange = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      setSelectedCategory(category._id);
    } else {
        setSelectedCategory(null);
    }
  };

  const selectedCategoryName = selectedCategory ? categories.find(cat => cat._id === selectedCategory)?.name : '';

  if (loading) {
    return (
      <div className="font-sans">
        <Header />
        <Navbar />
        <ArchiveHeader title="Product Category" category={selectedCategoryName} categories={categories} onSearch={handleSearch} onCategoryChange={handleCategoryChange} />
        <main className="container mx-auto px-4 py-16 bg-gray-100">
          <div className="text-center">Loading categories and products...</div>
        </main>
        <Footer />
        <BackToTopButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans">
        <Header />
        <Navbar />
        <ArchiveHeader title="Product Category " category={selectedCategoryName} categories={categories} onSearch={handleSearch} onCategoryChange={handleCategoryChange} />
        <main className="container mx-auto px-4 py-16 bg-gray-100">
          <div className="text-center text-red-500">Error: {error}</div>
        </main>
        <Footer />
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <Header />
      <Navbar />
      <ArchiveHeader title="Product Category" category={selectedCategoryName} categories={categories} onSearch={handleSearch} onCategoryChange={handleCategoryChange} />
      <main className="container mx-auto px-4 py-16 bg-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Sidebar categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              {selectedCategoryName} Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-gray-600">No products found for this category.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProductsByCategoryPage;