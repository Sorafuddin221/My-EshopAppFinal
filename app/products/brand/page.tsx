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
    const [selectedBrand, setSelectedBrand] = useState('');
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

    const handleFilter = (query: string, brandId: string) => {
        setSearchQuery(query);
        setSelectedBrand(brandId);

        let currentFilteredProducts = products;

        if (brandId) {
            currentFilteredProducts = currentFilteredProducts.filter(product => product.brand && product.brand._id === brandId);
        }

        if (query) {
            currentFilteredProducts = currentFilteredProducts.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredProducts(currentFilteredProducts);
    };

    const handleBrandChange = (brandId: string) => {
        setSelectedBrand(brandId);
        handleFilter(searchQuery, brandId);
    };

    const selectedBrandName = selectedBrand ? brands.find(brand => brand._id === selectedBrand)?.name : '';

    return (
        <div className="font-sans">
            <Header />
            <Navbar />
            <ArchiveHeader
                title={settings?.brandsPageHeading || "Products by Brand"}
                subheadingText={settings?.brandsPageSubheading || "Discover products from your favorite brands."}
                category={selectedBrandName}
                categories={brands.map(brand => ({ _id: brand._id, name: brand.name }))} // Pass brands as categories for ArchiveHeader
                onSearch={handleFilter}
                onCategoryChange={handleBrandChange}
            />
            <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Brands</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <button
                        onClick={() => handleBrandChange('')}
                        className={`p-4 border rounded-lg text-center transition-all duration-200
                            ${selectedBrand === '' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        All Products
                    </button>
                    {brands.map((brand) => (
                        <button
                            key={brand._id}
                            onClick={() => handleBrandChange(brand._id)}
                            className={`p-4 border rounded-lg text-center transition-all duration-200
                                ${selectedBrand === brand._id ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {brand.name}
                        </button>
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
                            selectedBrand={selectedBrand}
                            onSelectBrand={handleBrandChange}
                            onSearch={(query) => handleFilter(query, selectedBrand)}
                            title="Brands"
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedBrandName ? `${selectedBrandName} Products` : 'All Products'}
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