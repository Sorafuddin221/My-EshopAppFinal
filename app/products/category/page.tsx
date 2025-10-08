'use client';

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BackToTopButton from "@/app/components/BackToTopButton";
import ArchiveHeader from "@/app/products/ArchiveHeader";
import ProductListing from "@/app/products/ProductListing";
import Sidebar from "@/app/products/Sidebar";
import api from "@/utils/api";
import Link from "next/link";

import { Product } from "@/app/types/Product";
import { Category } from "@/app/types/Category";

interface Brand {
    _id: string;
    name: string;
}

const CategoriesPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]); // New state for brands
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(''); // New state for selected brand
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData, brandsData, settingsData] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories'),
                    api.get('/brands'), // Fetch brands
                    api.get('/settings')
                ]);

                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                    setFilteredProducts(productsData);
                } else {
                    console.error("Failed to fetch products: data is not an array", productsData);
                }

                if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                }

                if (Array.isArray(brandsData)) {
                    setBrands(brandsData);
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

    const handleFilter = (query: string, categoryId: string, brandId: string) => {
        setSearchQuery(query);
        setSelectedCategory(categoryId);
        setSelectedBrand(brandId);

        let currentFilteredProducts = products;

        if (categoryId) {
            currentFilteredProducts = currentFilteredProducts.filter(product => product.category._id === categoryId);
        }

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

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        handleFilter(searchQuery, categoryId, selectedBrand);
    };

    const handleBrandChange = (brandId: string) => {
        setSelectedBrand(brandId);
        handleFilter(searchQuery, selectedCategory, brandId);
    };

    const selectedCategoryName = selectedCategory ? categories.find(category => category._id === selectedCategory)?.name : '';
    const selectedBrandName = selectedBrand ? brands.find(brand => brand._id === selectedBrand)?.name : '';

    return (
        <div className="font-sans">
            <Header />
            <Navbar />
            <ArchiveHeader
                title={settings?.categoriesPageHeading || "Products by Category"}
                subheadingText={settings?.categoriesPageSubheading || "Browse products across various categories."}
                category={selectedCategoryName}
                categories={categories}
                onSearch={(query, cat) => handleFilter(query, cat, selectedBrand)}
                onCategoryChange={handleCategoryChange}
            />
            <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <button
                        onClick={() => handleCategoryChange('')}
                        className={`p-4 border rounded-lg text-center transition-all duration-200
                            ${selectedCategory === '' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        All Products
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => handleCategoryChange(category._id)}
                            className={`p-4 border rounded-lg text-center transition-all duration-200
                                ${selectedCategory === category._id ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
            <main className="container mx-auto px-4 py-16 bg-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Sidebar
                            categories={categories}
                            selectedCategory={selectedCategoryName}
                            onSelectCategory={(categoryName) => handleCategoryChange(categoryName === '' ? '' : categories.find(cat => cat.name === categoryName)?._id || '')}
                            brands={brands}
                            selectedBrand={selectedBrandName}
                            onSelectBrand={handleBrandChange}
                            onSearch={(query) => handleFilter(query, selectedCategory, selectedBrand)}
                            title="Categories"
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedCategoryName ? `${selectedCategoryName} Products` : 'All Products'}
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

export default CategoriesPage;