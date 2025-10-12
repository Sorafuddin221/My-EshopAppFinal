'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons';
import api from '../../utils/api';

interface BlogPost {
    _id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

interface Category {
    _id: string;
    name: string;
}

interface BlogSidebarProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

const BlogSidebar = ({ selectedCategory, setSelectedCategory }: BlogSidebarProps) => {
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch recent posts
                const postsData = await api.get('/blogposts');
                if (Array.isArray(postsData)) {
                    const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setRecentPosts(sortedPosts.slice(0, 3)); // Get top 3 recent posts
                }

                // Fetch categories
                const categoriesData = await api.get('/categories');
                if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                }
            } catch (err: any) {
                setError(err.message || 'Server error. Could not fetch sidebar data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <aside className="space-y-8 text-center">Loading sidebar...</aside>;
    }

    if (error) {
        return <aside className="space-y-8 text-center text-red-500">Error: {error}</aside>;
    }

    return (
        <aside className="space-y-8">
            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Recent Posts</h3>
                <ul className="space-y-4">
                    {recentPosts.length > 0 ? (
                        recentPosts.map((post) => (
                            <li key={post._id} className="flex items-start space-x-4">
                                <img src={post.imageUrl && (post.imageUrl.startsWith('http') || post.imageUrl.startsWith('https')) ? post.imageUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${post.imageUrl}`} alt={post.title} className="w-16 h-16 rounded-md object-cover" style={{ display: 'block', width: '64px', height: '64px', opacity: '1' }} />
                                <div>
                                    <a href={`/single-blog/${post._id}`} className="font-semibold text-gray-800 hover:text-red-500">{post.title}</a>
                                    <div className="text-gray-500 text-sm mt-1">{new Date(post.createdAt).toLocaleDateString()}</div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No recent posts found.</p>
                    )}
                </ul>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Categories</h3>
                <ul className="space-y-3">
                    <li key="all-categories">
                        <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(''); }} className={`flex items-center text-gray-600 hover:text-red-500 transition-colors duration-200 ${selectedCategory === '' ? 'text-red-500' : ''}`}>
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs mr-2" />All Categories
                        </a>
                    </li>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <li key={category._id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(category._id); }} className={`flex items-center text-gray-600 hover:text-red-500 transition-colors duration-200 ${selectedCategory === category._id ? 'text-red-500' : ''}`}>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs mr-2" />{category.name}
                                </a>
                            </li>
                        ))
                    ) : (
                        <p>No categories found.</p>
                    )}
                </ul>
            </div>
        </aside>
    );
};

export default BlogSidebar;