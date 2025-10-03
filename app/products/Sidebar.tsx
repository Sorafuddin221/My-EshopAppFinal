'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faFacebookF, faPinterestP, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import api from '../../utils/api';

interface SidebarProps {
  categories: any[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  title?: string;
}

interface Archive {
    month: string;
    year: number;
    count?: number;
}

interface Comment {
    _id: string;
    author: string;
    content: string;
    createdAt: string;
    blogPostTitle: string;
    blogPostId: string;
}

const Sidebar = ({ categories, selectedCategory, onSelectCategory, title }: SidebarProps) => {
    console.log('Sidebar title:', title);
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [archives, setArchives] = useState<Archive[]>([]);
    const [recentComments, setRecentComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const posts = await api.get('/blogposts');
                if (Array.isArray(posts)) {
                    setRecentPosts(posts.slice(0, 5)); // Get latest 5 posts
                }
            } catch (error: any) {
                console.error("Failed to fetch recent posts", error);
            }
        };

        const fetchRecentProducts = async () => {
            try {
                const products = await api.get('/products');
                if (Array.isArray(products)) {
                    setRecentProducts(products.slice(0, 2)); // Get latest 2 products
                }
            } catch (error: any) {
                console.error("Failed to fetch recent products", error);
            }
        };

        const fetchArchives = async () => {
            try {
                const posts = await api.get('/blogposts'); // Re-using blogposts to generate archives
                if (Array.isArray(posts)) {
                    const archiveMap = new Map<string, { month: string, year: number, count: number }>();
                    posts.forEach((post: any) => {
                        const date = new Date(post.createdAt);
                        const month = date.toLocaleString('default', { month: 'long' });
                        const year = date.getFullYear();
                        const key = `${month} ${year}`;
                        if (archiveMap.has(key)) {
                            archiveMap.get(key)!.count++;
                        } else {
                            archiveMap.set(key, { month, year, count: 1 });
                        }
                    });
                    const sortedArchives = Array.from(archiveMap.values()).sort((a, b) => {
                        if (a.year !== b.year) return b.year - a.year;
                        return new Date(b.month + ' 1, ' + b.year).getMonth() - new Date(a.month + ' 1, ' + a.year).getMonth();
                    });
                    setArchives(sortedArchives);
                }
            } catch (error: any) {
                console.error("Failed to fetch archives", error);
            }
        };

        const fetchRecentComments = async () => {
            try {
                const comments = await api.get('/comments/recent');
                if (Array.isArray(comments)) {
                    setRecentComments(comments);
                }
            } catch (error: any) {
                console.error("Failed to fetch recent comments", error);
            }
        };

        fetchRecentPosts();
        fetchRecentProducts();
        fetchArchives();
        fetchRecentComments();
    }, []);

    const handleSearch = () => {
        // This search is local to the sidebar, we can decide what to do with it.
        // For now, let's just log it.
        console.log("Sidebar search:", searchQuery);
    }

    return (
        <aside className="space-y-8">
            {/* Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>
            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">{title || "Categories"}</h3>
                <ul className="space-y-3">
                    <li>
                        <button
                            onClick={() => onSelectCategory('')}
                            className={`block text-left w-full ${selectedCategory === '' ? 'text-red-500 font-bold' : 'text-gray-600 hover:text-red-500'} transition-colors duration-200`}
                        >
                            All Products
                        </button>
                    </li>
                    {Array.isArray(categories) && categories.map((cat) => (
                        <li key={cat._id}>
                            <button
                                onClick={() => onSelectCategory(cat._id)}
                                className={`block text-left w-full ${selectedCategory === cat._id ? 'text-red-500 font-bold' : 'text-gray-600 hover:text-red-500'} transition-colors duration-200`}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Recent Posts</h3>
                <ul className="space-y-3">
                    {recentPosts.map(post => (
                        <li key={post._id}><a href={`/single-blog/${post._id}`} className="block text-gray-600 hover:text-red-500 transition-colors duration-200">{post.title}</a></li>
                    ))}
                </ul>
            </div>

            {/* Recent Comments */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Recent Comments</h3>
                <ul className="space-y-3">
                    {recentComments.length > 0 ? (
                        recentComments.map((comment) => (
                            <li key={comment._id}>
                                <a href={`/single-blog/${comment.blogPostId}`} className="block text-gray-600 hover:text-red-500 transition-colors duration-200">
                                    {comment.author} on {comment.blogPostTitle}
                                </a>
                            </li>
                        ))
                    ) : (
                        <p>No recent comments found.</p>
                    )}
                </ul>
            </div>

            {/* Archives */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Archives</h3>
                <ul className="space-y-3">
                    {archives.length > 0 ? (
                        archives.map((archive) => (
                            <li key={`${archive.month}-${archive.year}`}>
                                <a href={`/blog-posts?month=${archive.month}&year=${archive.year}`} className="block text-gray-600 hover:text-red-500 transition-colors duration-200">
                                    {archive.month} {archive.year} {archive.count ? `(${archive.count})` : ''}
                                </a>
                            </li>
                        ))
                    ) : (
                        <p>No archives found.</p>
                    )}
                </ul>
            </div>



            {/* Recent Products */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Recent Products</h3>
                <ul className="space-y-4">
                    {recentProducts.map(product => (
                        <li key={product._id} className="flex items-start space-x-4">
                            <img src={product.imageUrl || "https://via.placeholder.com/80x80?text=Product"} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                            <div>
                                <a href={`/single-product/${product._id}`} className="font-semibold text-gray-800 hover:text-red-500">{product.name}</a>
                                <p className="text-red-500 font-bold text-sm mt-1">{product.price ? `${product.price.toFixed(2)}` : 'Price not available'}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>



            {/* Our Social Link */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Our Social Link</h3>
                <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 text-white flex items-center justify-center rounded-full transition-colors duration-300">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 text-white flex items-center justify-center rounded-full transition-colors duration-300">
                        <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 text-white flex items-center justify-center rounded-full transition-colors duration-300">
                        <FontAwesomeIcon icon={faPinterestP} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 text-white flex items-center justify-center rounded-full transition-colors duration-300">
                        <FontAwesomeIcon icon={faGooglePlusG} />
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;