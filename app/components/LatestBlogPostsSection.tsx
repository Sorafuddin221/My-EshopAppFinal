'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

import { BlogPost } from '../types/BlogPost';

interface LatestBlogPostsSectionProps {
    title?: string;
    description?: string;
}

const LatestBlogPostsSection = ({ title = "Latest Blog Posts", description = "Stay updated with our most recent articles and insights." }: LatestBlogPostsSectionProps) => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const data = await api.get('/blogposts');
                if (Array.isArray(data)) {
                    // Sort by createdAt in descending order and take the latest 4
                    const sortedPosts = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setBlogPosts(sortedPosts.slice(0, 4));
                } else {
                    setError(data.msg || 'Failed to fetch blog posts.');
                }
            } catch (err: any) {
                setError(err.message || 'Server error. Could not fetch blog posts.');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogPosts();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading latest blog posts...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">
                        <span className="text-red-500">{title.split(' ')[0]}</span> {title.split(' ').slice(1).join(' ')}
                    </h2>
                    <p className="text-gray-500 mt-2">{description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {blogPosts.length > 0 ? (
                        blogPosts.map((post) => (
                            <article key={post._id} className="bg-white rounded-xl shadow-lg blog-post-card">
                                <img className="w-full h-48 object-cover rounded-t-xl" src={post.imageUrl && (post.imageUrl.startsWith('http') || post.imageUrl.startsWith('https')) ? post.imageUrl : "https://placehold.co/600x400/1e293b/FFFFFF?text=Blog+Post"} alt={post.title} />
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-2">{post.category ? (typeof post.category === 'string' ? post.category : post.category.name) : 'Uncategorized'}</p>
                                    <h3 className="text-xl font-semibold text-gray-900 leading-tight">{post.title}</h3>
                                    <div className="flex items-center text-gray-500 text-sm mt-2 mb-4">
                                        <FontAwesomeIcon icon={faUserShield} className="text-red-500 mr-2" />
                                        By <span className="text-red-500 ml-1">{post.author}</span>
                                    </div>
                                    {/* Ratings are not in backend schema, keeping placeholder for now */}
                                    <div className="flex text-yellow-400 text-base mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <FontAwesomeIcon
                                                key={i}
                                                icon={i < 4 ? faStar : farStar} // Placeholder rating
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 line-clamp-3 mt-2">
                                        {post.content}
                                    </p>
                                    <Link href={`/single-blog/${post._id}`} className="mt-4 inline-block text-red-500 hover:text-red-700 font-medium">More Details &rarr;</Link>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">No blog posts found.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LatestBlogPostsSection;
