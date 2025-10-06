"use client";
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface BlogHeroSectionProps {
    headingText: string;
    subheadingText: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

interface Category {
    _id: string;
    name: string;
}

const BlogHeroSection = ({ headingText, subheadingText, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: BlogHeroSectionProps) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = () => {
        // Implement your search logic here
        console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    };

    return (
        <section className="hero-section text-light relative flex items-center justify-between overflow-hidden" style={{ backgroundColor: 'rgb(239 68 68 / var(--tw-bg-opacity, 1))' }}>
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">{headingText}</h1>
                <p className="text-lg sm:text-xl text-gray-200 mb-8">{subheadingText}</p>
                
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-1">
                        <select 
                            className="w-full h-12 rounded-md border-0 bg-white text-gray-700 shadow-sm pr-10 focus:ring-2 focus:ring-orange-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {Array.isArray(categories) && categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Search review" 
                            className="w-full h-12 rounded-md border-0 bg-white text-gray-700 shadow-sm pl-4 pr-10 focus:ring-2 focus:ring-orange-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        className="w-full sm:w-auto px-8 py-3 bg-red-500 text-white font-bold rounded-md shadow-md hover:bg-red-600 transition-colors duration-300"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogHeroSection;