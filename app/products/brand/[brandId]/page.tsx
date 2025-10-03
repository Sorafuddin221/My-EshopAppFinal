'use client';

import React, { useState, useEffect, use } from 'react';
import Header from '@/app/components/Header';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AuthModal from '@/app/components/AuthModal';
import BackToTopButton from '@/app/components/BackToTopButton';
import ArchiveHeader from '@/app/products/ArchiveHeader';
import ProductCard from '@/app/components/ProductCard';
import api from '@/utils/api';

const ProductsByBrandPage = ({ params }: { params: Promise<{ brandId: string }> }) => {
  const { brandId } = use(params);
  const [brandName, setBrandName] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandAndProducts = async () => {
      try {
        // Fetch brand details
        console.log(`Fetching brand details for ID: ${brandId}`);
        const fetchedBrand = await api.get(`/brands/${brandId}`);
        console.log('Fetched brand response:', fetchedBrand);
        if (fetchedBrand && fetchedBrand.name) {
          setBrandName(fetchedBrand.name);
        } else {
          setError('Brand not found.');
          setLoading(false);
          return;
        }

        // Fetch products by brand
        console.log(`Fetching products for brand ID: ${brandId}`);
        const fetchedProducts = await api.get(`/products?brand=${brandId}`);
        console.log('Fetched products response:', fetchedProducts);
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        } else {
          setError('Failed to load products for this brand.');
        }
      } catch (err: any) {
        console.error('Error fetching brand or products:', err);
        setError('Failed to load data for this brand.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrandAndProducts();
  }, [brandId]);

  if (loading) {
    return (
      <div className="font-sans">
        <Header />
        <Navbar />
        <ArchiveHeader title="Products by Brand" category="" categories={[]} onSearch={() => {}} onCategoryChange={() => {}} />
        <main className="container mx-auto px-4 py-16 bg-gray-100">
          <div className="text-center">Loading products...</div>
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
        <ArchiveHeader title="Products by Brand" category="" categories={[]} onSearch={() => {}} onCategoryChange={() => {}} />
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
      <ArchiveHeader title="Products by Brand" category={brandName} categories={[]} onSearch={() => {}} onCategoryChange={() => {}} />
      <main className="container mx-auto px-4 py-16 bg-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* No sidebar for now, products will take full width of the main content area */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-4">
              {brandName} Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-gray-600">No products found for this brand.</p>
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

export default ProductsByBrandPage;