'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AuthModal from "../../components/AuthModal";
import BackToTopButton from "../../components/BackToTopButton";
import api from '../../../utils/api';
import { BlogPost } from '@/app/types/BlogPost';
import SingleBlogHeroSection from "../SingleBlogHeroSection";
import SingleBlogPostContent from "../SingleBlogPostContent";



const SingleBlogPostPage = () => {
    const params = useParams();
    const postId = params.id;
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (postId) {
            const fetchBlogPost = async () => {
                console.log('Fetching blog post with ID:', postId);
                try {
                    const data = await api.get(`/blogposts/${postId}`);
                    if (data._id) {
                        setBlogPost(data);
                    } else {
                        setError(data.msg || 'Blog post not found.');
                    }
                } catch (err: any) {
                    setError(err.message || 'Server error. Could not fetch blog post.');
                } finally {
                    setLoading(false);
                }
            };
            fetchBlogPost();
        }
    }, [postId]);

    if (loading) {
        return (
            <div className="font-sans bg-gray-100">
                <Header />
                <Navbar />
                <main className="container mx-auto px-4 py-12 text-center">
                    Loading blog post details...
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

    if (!blogPost) {
        return (
            <div className="font-sans bg-gray-100">
                <Header />
                <Navbar />
                <main className="container mx-auto px-4 py-12 text-center">
                    Blog post not found.
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
            <SingleBlogHeroSection title={blogPost.title} category={blogPost.category} />
            <main className="container mx-auto px-4 py-12">
                <SingleBlogPostContent blogPost={blogPost} />
            </main>
            <Footer />
            <BackToTopButton />
        </div>
    );
};

export default SingleBlogPostPage;
