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
  onSelectCategory: (categoryName: string) => void;
  brands: any[]; // New prop for brands
  onSearch: (query: string) => void; // New prop for search handler
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

interface BlogPost {
    _id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

const Sidebar = ({ categories, selectedCategory, onSelectCategory, brands, onSearch, title }: SidebarProps) => {
    console.log('Sidebar title:', title);
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [archives, setArchives] = useState<Archive[]>([]);
    const [recentComments, setRecentComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const posts = await api.get('/blogposts');
                if (Array.isArray(posts)) {
                    const sortedPosts = posts.sort((a: BlogPost, b: BlogPost) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setRecentPosts(sortedPosts.slice(0, 5)); // Get latest 5 posts
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
        onSearch(searchQuery);
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
            <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Categories</h3>
    <select
        value={selectedCategory || ''}
        onChange={(e) => onSelectCategory(e.target.value)}
        className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
        <option value="">All Categories</option>
        {Array.isArray(categories) && categories.map((category) => (
            <option key={category._id} value={category.name}>
                {category.name}
            </option>
        ))}
    </select>
</div>

            {/* Brands */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4 border-b-2 border-red-500 pb-2 text-gray-800">Brands</h3>
                <ul className="space-y-3">
                    <li>
                        <a href="/products"
                           className="block text-gray-600 hover:text-red-500 transition-colors duration-200">
                            All Products
                        </a>
                    </li>
                    {Array.isArray(brands) && brands.map((brand) => (
                        <li key={brand._id}>
                            <a href={`/products/brand/${brand.name}`}
                               className="block text-gray-600 hover:text-red-500 transition-colors duration-200">
                                {brand.name}
                            </a>
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
                            <img src={product.imageUrl || "https://placehold.co/80x80?text=Product"} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                            <div>
                                <a href={`/single-product/${product._id}`} className="font-semibold text-gray-800 hover:text-red-500">{product.name}</a>
                                <p className="text-red-500 font-bold text-sm mt-1">{product.price ? `${product.price.toFixed(2)}` : 'Price not available'}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </aside>
    );
};

export default Sidebar;