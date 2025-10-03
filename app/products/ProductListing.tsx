"use client";
import ProductCard from '../components/ProductCard';

import { Product } from '@/app/types/Product';

interface ProductListingProps {
    products: Product[];
}

const ProductListing = ({ products }: ProductListingProps) => {
    return (
        <div className="lg:col-span-2">
            {/* Section Header */}
            <div className="flex justify-between items-end mb-8">
                <div className="relative">
                    <h2 className="text-3xl font-bold text-gray-800">
                        <span className="text-red-500">Products</span> Collection
                    </h2>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-full"></div>
                </div>
                {/* Navigation Arrows */}
                <div className="flex space-x-4 text-gray-500">
                    {/* Add pagination or filtering controls here if needed */}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">No products found.</div>
                )}
            </div>
        </div>
    );
};

export default ProductListing;
