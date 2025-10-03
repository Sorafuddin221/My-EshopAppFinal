'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AuthModal from "../../components/AuthModal";
import BackToTopButton from "../../components/BackToTopButton";
import SingleProductHeroSection from "../SingleProductHeroSection";
import ProductDetailsContent from "../ProductDetailsContent";
import RelatedItemsSection from "../RelatedItemsSection";
import api from '../../../utils/api';
import { Product } from '@/app/types/Product';


const SingleProductpostPage = () => {
    const params = useParams();
    const productId = params.id;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                try {
                    const data = await api.get(`/products/${productId}`);
                    if (data._id) {
                        setProduct(data);
                        // Increment view count
                        await api.put(`/products/${productId}/view`);
                    } else {
                        setError(data.msg || 'Product not found.');
                    }
                } catch (err: any) {
                    setError(err.message || 'Server error. Could not fetch product.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="font-sans bg-gray-100">
                <Header />
                <Navbar />
                <main className="container mx-auto px-4 py-12 text-center">
                    Loading product details...
                </main>
                <Footer />
                
                <BackToTopButton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="font-sans bg-gray-100">
                <Header />
                <Navbar />
                <main className="container mx-auto px-4 py-12 text-center text-red-500">
                    Error: {error}
                </main>
                <Footer />
                
                <BackToTopButton />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="font-sans bg-gray-100">
                <Header />
                <Navbar />
                <main className="container mx-auto px-4 py-12 text-center">
                    Product not found.
                </main>
                <Footer />
                
                <BackToTopButton />
            </div>
        );
    }

    return (
        <div className="font-sans bg-gray-100">
            <Header />
            <Navbar />
            <SingleProductHeroSection productName={product.name} />
            <main className="container mx-auto px-4 py-12">
                <ProductDetailsContent product={product} />
                <RelatedItemsSection
                    productId={product._id}
                    categoryId={product.category._id}
                    brandId={product.brand._id}
                />
            </main>
            <Footer />
            
            <BackToTopButton />
        </div>
    );
};

export default SingleProductpostPage;
