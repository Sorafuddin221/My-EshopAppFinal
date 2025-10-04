'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faStar, faStarHalfAlt, faListUl, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

import { BlogPost } from '../types/BlogPost';

const BlogPostListing = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('default');

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const data = await api.get('/blogposts');
                if (Array.isArray(data)) {
                    setBlogPosts(data);
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

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
        let sortedPosts = [...blogPosts];
        if (e.target.value === 'latest') {
            sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (e.target.value === 'oldest') {
            sortedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
        setBlogPosts(sortedPosts);
    };

    if (loading) {
        return <div className="lg:col-span-2 text-center py-8">Loading blog posts...</div>;
    }

    if (error) {
        return <div className="lg:col-span-2 text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="lg:col-span-2">
            {/* Breadcrumbs */}
            <nav className="text-sm text-gray-500 mb-6">
                <Link href="#" className="hover:text-red-500">Home</Link> /
                <Link href="#" className="hover:text-red-500">Blog Posts</Link>
            </nav>

            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="text-gray-700">
                    Showing {blogPosts.length} results
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Sort by</span>
                    <select className="rounded-md border border-gray-300 py-1 px-3 text-gray-700" onChange={handleSortChange} value={sortOrder}>
                        <option value="default">Default</option>
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                    <button className="text-gray-500 hover:text-red-500">
                        <FontAwesomeIcon icon={faListUl} />
                    </button>
                    <button className="text-red-500 hover:text-red-500">
                        <FontAwesomeIcon icon={faThLarge} />
                    </button>
                </div>
            </div>

            {/* Blog Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                        <article key={post._id} className="bg-white rounded-xl shadow-lg blog-post-card ring-1 ring-transparent hover:ring-blue-500 ring-offset-2 ring-offset-white transition-all duration-300 ease-in-out">
                            <img className="w-full h-56 object-cover rounded-t-xl" src={post.imageUrl && (post.imageUrl.startsWith('http') || post.imageUrl.startsWith('https')) ? post.imageUrl : "https://placehold.co/600x400/1e293b/FFFFFF?text=Blog+Post"} alt={post.title} />
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-2">{post.category ? post.category.name : 'Uncategorized'}</p>
                                <h2 className="text-2xl font-semibold text-gray-900 leading-tight">{post.title}</h2>
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
    );
};

export default BlogPostListing;