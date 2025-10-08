'use client';

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BackToTopButton from "@/app/components/BackToTopButton";
import ArchiveHeader from "@/app/products/ArchiveHeader";
import ProductListing from "@/app/products/ProductListing";
import Sidebar from "@/app/products/Sidebar"; // Reusing Sidebar for brand filtering
import api from "@/utils/api";
import Link from "next/link";

import { Product } from "@/app/types/Product";

interface Brand {
    _id: string;
    name: string;
}

const BrandsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, brandsData, settingsData] = await Promise.all([
                    api.get('/products'),
                    api.get('/brands'),
                    api.get('/settings')
                ]);

                if (Array.isArray(productsData)) {
                    const formattedProducts = productsData.map(product => ({
                        ...product,
                        brand: product.brand || { _id: null, name: '' } // Ensure brand object exists with _id
                    }));
                    setProducts(formattedProducts);
                    setFilteredProducts(formattedProducts);
                } else {
                    console.error("Failed to fetch products: data is not an array", productsData);
                }

                if (Array.isArray(brandsData)) {
                    const brandsWithProducts = brandsData.filter((brand: Brand) =>
                        productsData.some((product: Product) => product.brand && product.brand._id === brand._id)
                    );
                    setBrands(brandsWithProducts);
                } else {
                    console.error("Failed to fetch brands: data is not an array", brandsData);
                }
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, []);

    const handleFilter = (query: string, category: string) => {
        setSearchQuery(query);

        let currentFilteredProducts = products;

        if (category) {
            currentFilteredProducts = currentFilteredProducts.filter(product => product.category.name === category);
        }

        if (query) {
            currentFilteredProducts = currentFilteredProducts.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredProducts(currentFilteredProducts);
    };



    return (
        <div className="font-sans">
            <Header />
            <Navbar />
            <ArchiveHeader
                title={settings?.brandsPageHeading || "Products by Brand"}
                subheadingText={settings?.brandsPageSubheading || "Discover products from your favorite brands."}
                category={''}
                categories={[]}
                onSearch={(query) => handleFilter(query, '')}
                onCategoryChange={(category) => handleFilter('', category)}
            />
            <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Brands</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Link
                        href="/products"
                        className={`p-4 border rounded-lg text-center transition-all duration-200
                            ${'' === '' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        All Products
                    </Link>
                    {brands.map((brand) => (
                        <Link
                            key={brand._id}
                            href={`/products/brand/${brand.name}`}
                            className={`p-4 border rounded-lg text-center transition-all duration-200
                                ${'' === brand._id ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {brand.name}
                        </Link>
                    ))}
                </div>
            </div>
            <main className="container mx-auto px-4 py-16 bg-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Sidebar
                            categories={[]} // No categories needed for brand page sidebar
                            selectedCategory={null} // No categories needed for brand page sidebar
                            onSelectCategory={() => {}} // No categories needed for brand page sidebar
                            brands={brands}
                            onSearch={(query) => handleFilter(query, '')}
                            title="Brands"
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold mb-4">
                            All Products
                        </h2>
                        <ProductListing products={filteredProducts} />
                    </div>
                </div>
            </main>
            <Footer />
            <BackToTopButton />
        </div>
    );
};

export default BrandsPage;