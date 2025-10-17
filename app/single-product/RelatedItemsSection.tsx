'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../components/ProductCard'; // Assuming ProductCard exists
import api from '../../utils/api';

interface RelatedItemsSectionProps {
  productId: string;
  categoryId?: string;
  brandId?: string;
}

const RelatedItemsSection = ({ productId, categoryId, brandId }: RelatedItemsSectionProps) => {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        let fetchedProducts = [];
        console.log('RelatedItemsSection: productId, categoryId, brandId', productId, categoryId, brandId);

        if (categoryId) {
            const categoryUrl = `/products?limit=4&category=${categoryId}`;
            console.log('RelatedItemsSection: Fetching by category URL:', categoryUrl);
            fetchedProducts = await api.get(categoryUrl);
            console.log('RelatedItemsSection: Fetched by category:', fetchedProducts);
        }

        // If no products found by category, try by brand
        if (fetchedProducts.length === 0 && brandId) {
            const brandUrl = `/products?limit=4&brand=${brandId}`;
            console.log('RelatedItemsSection: Fetching by brand URL (category returned no results):', brandUrl);
            fetchedProducts = await api.get(brandUrl);
            console.log('RelatedItemsSection: Fetched by brand:', fetchedProducts);
        }

        // Filter out the current product if it's included
        const filteredProducts = fetchedProducts.filter((p: any) => p._id !== productId);
        console.log('RelatedItemsSection: Filtered products (excluding current):', filteredProducts);
        setRelatedProducts(filteredProducts);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching related products:', err);
        setError(err);
        setLoading(false);
      }
    };
    fetchRelatedProducts();
  }, [productId, categoryId, brandId]);

  if (loading) {
    return <section className="py-12 text-center">Loading related items...</section>;
  }

  if (error) {
    return <section className="py-12 text-center text-red-500">Error loading related items.</section>;
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Related Items</h2>
        <div className="flex space-x-2">
          <button className="w-10 h-10 border border-gray-300 text-gray-500 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className="w-10 h-10 border border-gray-300 text-gray-500 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200">
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No related products found.</p>
        )}
      </div>
    </section>
  );
};

export default RelatedItemsSection;
