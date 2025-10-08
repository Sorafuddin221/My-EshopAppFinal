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
    const [brands, setBrands] = useState<any[]>([]); // New state for brands
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(''); // New state for selected brand
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
                    handleSearch(initialSearchQuery, selectedCategory, selectedBrand, productsData);
                } else {
                    console.error("Failed to fetch products: data is not an array", productsData);
                }

                if (Array.isArray(categoriesData)) {
                    const categoriesWithProducts = categoriesData.filter((category: Category) =>
                        productsData.some((product: Product) => product.category && product.category._id === category._id)
                    );
                    setCategories(categoriesWithProducts);
                } else {
                    console.error("Failed to fetch categories: data is not an array", categoriesData);
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

    const handleSearch = (query: string, category: string, brand: string, allProducts: Product[] = products) => {
        setSearchQuery(query);
        setSelectedCategory(category);
        setSelectedBrand(brand);

        let filtered = allProducts;

        if (category) {
            filtered = filtered.filter(product => product.category.name === category);
        }

        if (brand) {
            filtered = filtered.filter(product => product.brand && product.brand.name === brand);
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
        handleSearch(searchQuery, category, selectedBrand);
    }

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        handleSearch(searchQuery, selectedCategory, brand);
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
                onSearch={(query: string, category: string) => handleSearch(query, category, selectedBrand)}
                onCategoryChange={handleCategoryChange}
            />
            <main className="container mx-auto px-4 py-16 bg-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ProductListing products={filteredProducts} />
                    <Sidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategoryChange}
                        brands={brands} // Pass brands to Sidebar
                        selectedBrand={selectedBrand} // Pass selectedBrand to Sidebar
                        onSelectBrand={handleBrandChange} // Pass onSelectBrand to Sidebar
                        onSearch={(query: string) => handleSearch(query, selectedCategory, selectedBrand)} // Pass search handler to Sidebar
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