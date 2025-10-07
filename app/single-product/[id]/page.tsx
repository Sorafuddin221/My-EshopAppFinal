import { Metadata, ResolvingMetadata } from 'next';
import api from '../../../utils/api'; // Adjust path as needed
import { Product } from '@/app/types/Product'; // Corrected import

import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AuthModal from "../../components/AuthModal";
import BackToTopButton from "../../components/BackToTopButton";
import ProductDetailsContent from '../ProductDetailsContent';
import RelatedItemsSection from '../RelatedItemsSection';
import SingleProductHeroSection from '../SingleProductHeroSection';


type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productId = params.id;
  try {
    const product = await api.get(`/products/${productId}`);
    return {
      title: product.name,
      description: product.metaDescription,
      keywords: product.metaKeywords,
    };
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return {
      title: 'Product Not Found',
    };
  }
}

const SingleProductPage = async ({ params }: { params: { id: string } }) => {
    const productId = params.id;
    let product: Product | null = null;
    let error: string | null = null;

    try {
        const data = await api.get(`/products/${productId}`);
        if (data._id) {
            product = data;
            // Increment view count
            await api.put(`/products/${productId}/view`);
        } else {
            error = data.msg || 'Product not found.';
        }
    } catch (err: any) {
        error = err.message || 'Server error. Could not fetch product.';
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

export default SingleProductPage;