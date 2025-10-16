'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import api from '../../utils/api'; // Assuming this path is correct
import { useAuth } from '../../context/AuthContext'; // Assuming this path is correct

interface ProductDetailsContentProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: { _id: string; name: string; }; // Updated to object
    brand: { _id: string; name: string; }; // Added brand object
    imageUrl?: string;
    thumbnailImage1Url?: string; // New thumbnail image 1 URL
    thumbnailImage2Url?: string; // New thumbnail image 2 URL
    buyNowUrl?: string; // Added buyNowUrl
    views?: number; // Added views count
    rating?: number; // Added rating property
    buttons?: { url: string; buttonText: string; regularPrice: number; salePrice: number; }[];
  };
}

const ProductDetailsContent = ({ product }: ProductDetailsContentProps) => {
    const [mainImage, setMainImage] = useState(product.imageUrl || "https://placehold.co/400x600/1e293b/FFFFFF?text=No+Image");
    const [currentProduct, setCurrentProduct] = useState(product); // State to hold product data including dynamic views
    const { token } = useAuth(); // Get token from AuthContext

    useEffect(() => {
        const incrementView = async () => {
            try {
                // No token needed for view increment as per products.js PUT /:id/view route
                await api.put(`/products/${product._id}/view`);
                // Fetch updated product data to get the latest view count
                const updatedProduct = await api.get(`/products/${product._id}`);
                setCurrentProduct(updatedProduct);
            } catch (error) {
                console.error('Error incrementing view or fetching product:', error);
            }
        };

        incrementView();

        const tabs = document.querySelectorAll('.tab-button');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and hide all content
                tabs.forEach(t => {
                    t.classList.remove('active');
                });
                contents.forEach(c => {
                    c.classList.add('hidden');
                });

                // Add active class to the clicked tab
                tab.classList.add('active');

                // Show the corresponding content
                const tabId = (tab as HTMLElement).dataset.tab;
                const contentElement = document.getElementById(tabId + '-content');
                if (contentElement) {
                    contentElement.classList.remove('hidden');
                }
            });
        });
    }, []);

    const handleBuyNowClick = () => {
      if (product.buyNowUrl) {
        window.open(product.buyNowUrl, '_blank');
      }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left Column: Product Image */}
            <div className="flex flex-col items-center">
                <img src={mainImage} alt={product.name} className="w-full max-w-sm rounded-lg shadow-md mb-4" />
                {/* Thumbnails - can be made dynamic if product has multiple images */}
                <div className="flex space-x-2">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={`${product.name} main thumbnail`}
                        className="w-16 h-16 rounded-md object-cover border-2 border-gray-300 hover:border-red-500 cursor-pointer"
                        onClick={() => setMainImage(product.imageUrl || "https://placehold.co/400x600/1e293b/FFFFFF?text=No+Image")}
                      />
                    )}
                    {product.thumbnailImage1Url && (
                      <img
                        src={product.thumbnailImage1Url}
                        alt={`${product.name} thumbnail 1`}
                        className="w-16 h-16 rounded-md object-cover border-2 border-gray-300 hover:border-red-500 cursor-pointer"
                        onClick={() => setMainImage(product.thumbnailImage1Url || "https://placehold.co/400x600/1e293b/FFFFFF?text=No+Image")}
                      />
                    )}
                    {product.thumbnailImage2Url && (
                      <img
                        src={product.thumbnailImage2Url}
                        alt={`${product.name} thumbnail 2`}
                        className="w-16 h-16 rounded-md object-cover border-2 border-gray-300 hover:border-red-500 cursor-pointer"
                        onClick={() => setMainImage(product.thumbnailImage2Url || "https://placehold.co/400x600/1e293b/FFFFFF?text=No+Image")}
                      />
                    )}
                </div>
            </div>

            {/* Right Column: Product Details */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>

                {/* Ratings Section */}
                <div className="flex items-center text-gray-500 mb-4">
                    <div className="flex text-yellow-400 text-lg mr-2">
                        {[...Array(5)].map((_, i) => {
                            const ratingValue = i + 1;
                            return (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={ratingValue <= (currentProduct.rating || 0) ? faStar : (ratingValue - 0.5 === (currentProduct.rating || 0) ? faStarHalfAlt : farStar)}
                                />
                            );
                        })}
                    </div>
                    <span className="mr-4">{currentProduct.rating ? currentProduct.rating.toFixed(1) : '0'}/5 - 1 Ratings</span>
                    <span><FontAwesomeIcon icon={faEye} /> {currentProduct.views ? `${(currentProduct.views / 1000).toFixed(1)}K+` : '0'} Views</span>
                </div>

                {/* Description */}
                <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />

                <p className="text-gray-500 mb-2">Category: <span className="text-red-500 font-semibold">{product.category.name}</span></p>
                <p className="text-gray-500 mb-6">Brand: <span className="text-red-500 font-semibold">{product.brand.name}</span></p>
                <p className="text-red-500 font-bold text-2xl mb-4">${product.price.toFixed(2)}</p>

                {/* Vendor Comparison Table (can be made dynamic if needed) */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-t-lg font-bold text-gray-700 border-b border-gray-200">
                        <span className="w-1/3">Vendor</span>
                        <span className="w-1/3 text-center">Price</span>
                        <span className="w-1/3 text-right">Action</span>
                    </div>
                    {/* Vendor 1 */}
                    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200">
                        <span className="w-1/3 flex items-center">
                            <span className="font-bold text-red-500 mr-2">BEST</span>
                            <span className="font-bold text-lg text-black">Export</span>
                        </span>
                        <span className="w-1/3 text-center text-gray-800 font-semibold">${product.price.toFixed(2)}</span>
                        <div className="w-1/3 flex justify-end items-center space-x-4">
                            <span className="text-green-500 font-semibold hidden md:block">In Stock</span>
                            {product.buyNowUrl && (
                              <button
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                                onClick={handleBuyNowClick}
                              >
                                Buy Now
                              </button>
                            )}
                        </div>
                    </div>
                    {/* Vendor 2 */}
                    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200">
                        <span className="w-1/3 font-bold text-lg text-black">Natural</span>
                        <span className="w-1/3 text-center text-gray-800 font-semibold">${(product.price * 1.1).toFixed(2)}</span> {/* Example: 10% higher */}
                        <div className="w-1/3 flex justify-end items-center space-x-4">
                            <span className="text-green-500 font-semibold hidden md:block">In Stock</span>
                            {product.buyNowUrl && (
                              <button
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                                onClick={handleBuyNowClick}
                              >
                                Buy Now
                              </button>
                            )}
                        </div>
                    </div>
                    {product.buttons && product.buttons.map((button, index) => (
                        <div key={index} className="flex items-center justify-between py-4 px-6 border-b border-gray-200">
                            <span className="w-1/3 font-bold text-lg">{button.buttonText}</span>
                            <span className="w-1/3 text-center text-gray-800 font-semibold">
                                <span className="line-through mr-2">${button.regularPrice}</span>
                                <span className="text-red-500 font-bold">${button.salePrice}</span>
                            </span>
                            <div className="w-1/3 flex justify-end items-center space-x-4">
                                <span className="text-green-500 font-semibold hidden md:block">In Stock</span>
                                <a
                                    href={button.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                                >
                                    Buy Now
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsContent;
