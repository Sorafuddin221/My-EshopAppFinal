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
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedBrands, fetchedProducts] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
          api.get('/products')
        ]);

        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
          setOriginalProducts(fetchedProducts);

          if (Array.isArray(fetchedCategories)) {
            const categoriesWithProducts = fetchedCategories.filter(category => 
              fetchedProducts.some(product => product.category._id === category._id)
            );
            setCategories(categoriesWithProducts);
          } else {
            setError('Failed to load categories.');
          }

        } else {
          setError('Failed to load products.');
        }

        if (Array.isArray(fetchedBrands)) {
          setBrands(fetchedBrands);
        } else {
          setError('Failed to load brands.');
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query: string, category: string | null, brand: string | null) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedBrand(brand);

    let filtered = originalProducts;

    if (category) {
      filtered = filtered.filter(product => product.category._id === category);
    }

    if (brand) {
      filtered = filtered.filter(product => product.brand && product.brand._id === brand);
    }

    if (query) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    setProducts(filtered);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleSearch(searchQuery, categoryId, selectedBrand);
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    handleSearch(searchQuery, selectedCategory, brandId);
  };

  const selectedCategoryName = selectedCategory ? categories.find(cat => cat._id === selectedCategory)?.name : '';
  const selectedBrandName = selectedBrand ? brands.find(brand => brand._id === selectedBrand)?.name : '';

  if (loading) {
    return (
      <div className="font-sans">
        <Header />
        <Navbar />
        <ArchiveHeader title="Product Category" category={selectedCategoryName} categories={categories} onSearch={(query, cat) => handleSearch(query, cat, selectedBrand)} onCategoryChange={handleCategoryChange} />
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
        <ArchiveHeader title="Product Category " category={selectedCategoryName} categories={categories} onSearch={(query, cat) => handleSearch(query, cat, selectedBrand)} onCategoryChange={handleCategoryChange} />
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
      <ArchiveHeader title="Product Category" category={selectedCategoryName} categories={categories} onSearch={(query, cat) => handleSearch(query, cat, selectedBrand)} onCategoryChange={handleCategoryChange} />
      <main className="container mx-auto px-4 py-16 bg-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategoryName}
              onSelectCategory={(categoryName) => handleCategoryChange(categoryName === '' ? '' : categories.find(cat => cat.name === categoryName)?._id || '')}
              brands={brands}
              selectedBrand={selectedBrandName}
              onSelectBrand={(brandName) => {
                const brand = brands.find(b => b.name === brandName);
                if (brand) {
                  handleBrandChange(brand._id);
                } else {
                  handleBrandChange('');
                }
              }}
              onSearch={(query) => handleSearch(query, selectedCategory, selectedBrand)}
            />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              {selectedCategoryName || selectedBrandName} Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-gray-600">No products found for this selection.</p>
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