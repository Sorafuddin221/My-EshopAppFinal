'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import ProductHeadingSection from './components/ProductHeadingSection';
import ProductSection from './components/ProductSection';
import ReviewVideoSection from './components/ReviewVideoSection';
import LatestBlogPostsSection from './components/LatestBlogPostsSection';
import WorkflowSection from './components/WorkflowSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BackToTopButton from './components/BackToTopButton';
import api from '../utils/api'; // Adjust path if necessary

export default function Home() {
  const [brandsWithProducts, setBrandsWithProducts] = useState<any[]>([]);
  const [latestBlogPostsSectionSettings, setLatestBlogPostsSectionSettings] = useState({
    title: "Latest Blog Posts",
    description: "Stay updated with our most recent articles and insights."
  });
  const [productHeadingSectionSettings, setProductHeadingSectionSettings] = useState({
    title: "Our Products",
    subheading: "Explore our wide range of high-quality products designed to meet your needs."
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(true); // New state for Header visibility

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch all brands and all products
        const fetchedBrands = await api.get('/brands');
        const allProducts = await api.get('/products'); // Fetch all products

        // Prepare data for rendering: each brand with its associated products
        const brandsData = fetchedBrands.map((brand: any) => {
                    const productsForBrand = allProducts.filter((product: any) => product.brand._id === brand._id);
          return { brand, products: productsForBrand };
        });
        setBrandsWithProducts(brandsData);

        // Fetch latest blog posts section settings
        const settings = await api.get('/settings');
        setLatestBlogPostsSectionSettings({
          title: settings.latestBlogPostsTitle || "Latest Blog Posts",
          description: settings.latestBlogPostsDescription || "Stay updated with our most recent articles and insights."
        });

        // Load product heading section settings from localStorage
        const savedProductHeadingSettings = localStorage.getItem('productHeadingSettings');
        if (savedProductHeadingSettings) {
          try {
            setProductHeadingSectionSettings(JSON.parse(savedProductHeadingSettings));
          } catch (e) {
            console.error("Error parsing product heading settings from localStorage", e);
            // Fallback to default if parsing fails
            setProductHeadingSectionSettings({
              title: "Our Products",
              subheading: "Explore our wide range of high-quality products designed to meet your needs."
            });
          }
        }

      } catch (err: any) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    const handleScroll = () => {
      const headerHeight = 60; // Approximate height of the Header component
      if (window.scrollY > headerHeight) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="font-sans">
        <Header />
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">Loading products...</div>
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
        <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>
        <Footer />
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div className="font-sans">
      {showHeader && <Header />} {/* Conditionally render Header */}
      <Navbar />
      <HeroSection />
      <FeatureSection />

      <ProductHeadingSection
        title={productHeadingSectionSettings.title}
        subheading={productHeadingSectionSettings.subheading}
      />

      {brandsWithProducts.length > 0 ? (
        brandsWithProducts.map((data: any) => (
          data.products.length > 0 && (
            <ProductSection
              key={data.brand._id}
              title={data.brand.name}
              themeColor="orange" // You can make this dynamic if needed
              products={data.products} // Pass products directly
            />
          )
        ))
      ) : (
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          No brands or products found. Add some from the dashboard!
        </div>
      )}

      <ReviewVideoSection />
      <LatestBlogPostsSection title={latestBlogPostsSectionSettings.title} description={latestBlogPostsSectionSettings.description} />
      <WorkflowSection />
      
      <Footer />
      <BackToTopButton />
    </div>
  );
}