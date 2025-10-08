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
  const [brands, setBrands] = useState<any[]>([]); // New state for brands
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null); // New state for selected brand
  const [products, setProducts] = useState<any[]>([]);
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          api.get('/categories'),
          api.get('/brands') // Fetch brands
        ]);

        if (Array.isArray(fetchedCategories)) {
            setCategories(fetchedCategories);
            if (fetchedCategories.length > 0) {
              setSelectedCategory(fetchedCategories[0]._id); // Select the first category by default
            }
        } else {
            setError('Failed to load categories.');
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

  // Fetch products when selectedCategory or selectedBrand changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      try {
        let url = `/products?category=${selectedCategory}`;
        if (selectedBrand) {
            url += `&brand=${selectedBrand}`;
        }
        const fetchedProducts = await api.get(url);
        if(Array.isArray(fetchedProducts)) {
            setProducts(fetchedProducts);
            setOriginalProducts(fetchedProducts);
            // Apply search query if present
            handleSearch(searchQuery, selectedCategory, selectedBrand, fetchedProducts);
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
    fetchProducts();
  }, [selectedCategory, selectedBrand]);

  const handleSearch = (query: string, category: string | null, brand: string | null, allProducts: any[] = originalProducts) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedBrand(brand);

    let filtered = allProducts;

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
    // When category changes, reset search query and brand filter
    handleSearch('', categoryId, null);
  };

  const handleBrandChange = (brandName: string) => {
    const brand = brands.find(b => b.name === brandName);
    if (brand) {
      setSelectedBrand(brand._id);
      // When brand changes, reset search query and category filter
      handleSearch('', selectedCategory, brand._id);
    } else {
      setSelectedBrand(null);
      handleSearch('', selectedCategory, null);
    }
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
              onSelectBrand={handleBrandChange}
              onSearch={(query) => handleSearch(query, selectedCategory, selectedBrand)}
            />
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