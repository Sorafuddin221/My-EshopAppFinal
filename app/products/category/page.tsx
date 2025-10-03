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

const CategoriesPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData, settingsData] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories'),
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
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, []);

    const handleFilter = (query: string, categoryId: string) => {
        setSearchQuery(query);
        setSelectedCategory(categoryId);

        let currentFilteredProducts = products;

        if (categoryId) {
            currentFilteredProducts = currentFilteredProducts.filter(product => product.category._id === categoryId);
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
        handleFilter(searchQuery, categoryId);
    };

    const selectedCategoryName = selectedCategory ? categories.find(category => category._id === selectedCategory)?.name : '';

    return (
        <div className="font-sans">
            <Header />
            <Navbar />
            <ArchiveHeader
                title={settings?.categoriesPageHeading || "Products by Category"}
                subheadingText={settings?.categoriesPageSubheading || "Browse products across various categories."}
                category={selectedCategoryName}
                categories={categories.map(category => ({ _id: category._id, name: category.name }))} // Pass categories for ArchiveHeader
                onSearch={handleFilter}
                onCategoryChange={handleCategoryChange}
            />
            <main className="container mx-auto px-4 py-16 bg-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Sidebar
                            categories={categories.map(category => ({ _id: category._id, name: category.name }))} // Pass categories for Sidebar
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleCategoryChange}
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