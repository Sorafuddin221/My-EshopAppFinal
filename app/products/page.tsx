'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import BackToTopButton from "../components/BackToTopButton";
import ArchiveHeader from "./ArchiveHeader";
import ProductListing from "./ProductListing";
import Sidebar from "./Sidebar";
import api from "../../utils/api";

import { Product } from "@/app/types/Product";
import { Category } from "@/app/types/Category";

const ProductsPage = () => {
    const searchParams = useSearchParams();
    const initialSearchQuery = searchParams.get('search') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get('/products');
                if (Array.isArray(data)) {
                    setProducts(data);
                    // Apply initial search and category filter
                    handleSearch(initialSearchQuery, selectedCategory, data);
                } else {
                    console.error("Failed to fetch products: data is not an array", data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const data = await api.get('/categories');
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("Failed to fetch categories: data is not an array", data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        const fetchSettings = async () => {
            try {
                const data = await api.get('/settings');
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };

        fetchProducts();
        fetchCategories();
        fetchSettings();
    }, []);

    const handleSearch = (query: string, category: string, allProducts: Product[] = products) => {
        setSearchQuery(query);
        setSelectedCategory(category);

        let filtered = allProducts;

        if (category) {
            filtered = filtered.filter(product => product.category.name === category);
        }

        if (query) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        handleSearch(searchQuery, category);
    }

    return (
        <div className="font-sans">
            <Header />
            <Navbar />
            <ArchiveHeader
                title={settings?.productsPageHeading || "All Products"}
                subheadingText={settings?.productsPageSubheading || "Explore our wide range of high-quality products designed to meet your needs."}
                category={selectedCategory}
                categories={categories}
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
            />
            <main className="container mx-auto px-4 py-16 bg-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ProductListing products={filteredProducts} />
                    <Sidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategoryChange}
                        title="Categories"
                    />
                </div>
            </main>
            <Footer />
            <BackToTopButton />
        </div>
    );
};

export default ProductsPage;