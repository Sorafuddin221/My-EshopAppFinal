
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from "next";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import BackToTopButton from "../components/BackToTopButton";
import BlogHeroSection from "./BlogHeroSection";
import BlogPostListing from "./BlogPostListing";
import BlogSidebar from "./BlogSidebar";
import api from '@/utils/api';


const BlogPostsPage = () => {
    const [settings, setSettings] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await api.get('/settings');
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="font-sans bg-gray-100">
            <Header />
            <Navbar />
            <BlogHeroSection 
                headingText={settings?.blogPageHeading || "Search Product Review & Discover"}
                subheadingText={settings?.blogPageSubheading || "Read reviews. Write reviews. Deal smarter."}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <BlogPostListing
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                    />
                    <BlogSidebar
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                </div>
            </main>
            <Footer />
            <BackToTopButton />
        </div>
    );
};

export default BlogPostsPage;
