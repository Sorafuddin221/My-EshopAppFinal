'use client';

import { useEffect, useState } from 'react';
import './dashboard.css';
import AddProductSection from './AddProductSection';
import AddBlogPostSection from './AddBlogPostSection';
import AddAuthorSection from './AddAuthorSection';

import BlogPostListTable from './BlogPostListTable';
import UserApprovalTable from './UserApprovalTable';
import SettingsSection from './SettingsSection';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import AppearanceCustomizeSection from './AppearanceCustomizeSection';
import ContactInfoSection from './ContactInfoSection';
import AddressSettingsSection from './AddressSettingsSection';
import ProductHeadingSectionCustomize from './ProductHeadingSectionCustomize';
import FooterMenuCustomize from './FooterMenuCustomize';

const DashboardClient = () => {
    const [activeSection, setActiveSection] = useState('dashboard'); // Default active section
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        chartScript.async = true;
        document.body.appendChild(chartScript);

        

        return () => {
            document.body.removeChild(chartScript);
            
        };
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/'); // Redirect to home page after logout
    };

    return (
        <div className="bg-gray-100">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="bg-white shadow-md w-64 fixed top-0 bottom-0 left-0 z-20 overflow-y-auto">
                    <div className="text-center py-8">
                        <span className="text-2xl font-bold text-blue-600">Dashboard</span>
                    </div>
                    <ul className="flex flex-col">
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'dashboard' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('dashboard')}>
                                <i className="bi bi-grid-fill mr-2"></i>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'profile' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('profile')}>
                                <i className="bi bi-person-circle mr-2"></i>
                                <span>Profile</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'contact-info' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('contact-info')}>
                                <i className="bi bi-envelope-fill mr-2"></i>
                                <span>Contact Info</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'addProduct' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('addProduct')}>
                                <i className="bi bi-cart-fill mr-2"></i>
                                <span>Add Product</span>
                            </a>
                        </li>
                        
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'addAuthor' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('addAuthor')}>
                                <i className="bi bi-person-plus-fill mr-2"></i>
                                <span>Add Author</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'addPost' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('addPost')}>
                                <i className="bi bi-file-earmark-plus mr-2"></i>
                                <span>Add Post</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'viewPosts' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('viewPosts')}>
                                <i className="bi bi-journal-text mr-2"></i>
                                <span>View Posts</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'userApproval' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('userApproval')}>
                                <i className="bi bi-person-check mr-2"></i>
                                <span>User Approval</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'customizeAppearance' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('customizeAppearance')}>
                                <i className="bi bi-palette-fill mr-2"></i>
                                <span>Customize Appearance</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'customizeProductHeading' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('customizeProductHeading')}>
                                <i className="bi bi-card-heading mr-2"></i>
                                <span>Customize Product Heading</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'address-settings' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('address-settings')}>
                                <i className="bi bi-geo-alt-fill mr-2"></i>
                                <span>Address Settings</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className={`flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer ${activeSection === 'settings' ? 'bg-gray-200 text-blue-600' : ''}`}
                                onClick={() => setActiveSection('settings')}>
                                <i className="bi bi-gear-fill mr-2"></i>
                                <span>Settings</span>
                            </a>
                        </li>
                        <li className="px-4 py-2">
                            <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2 cursor-pointer" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-left mr-2"></i>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="ml-64 flex-grow p-8">
                    {activeSection === 'dashboard' && (
                        <>
                            {/* Top Navbar */}
                            <nav className="bg-white shadow rounded-lg flex justify-between items-center p-4 mb-8 hidden" id="dashboard-navbar">
                                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                                <a href="index.html" className="text-blue-500 hover:underline">Back to Site</a>
                                <div className="flex items-center">
                                    <div className="relative mr-4">
                                        <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                        <input type="text" className="bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none" placeholder="Search..." />
                                    </div>
                                    <a href="#" className="mr-4 text-gray-500"><i className="bi bi-bell-fill text-lg"></i></a>
                                    <a href="#" className="flex items-center border border-gray-300 rounded-full px-4 py-2 text-gray-600 hover:bg-gray-100">
                                        <i className="bi bi-person-fill mr-2"></i> Account
                                    </a>
                                </div>
                            </nav>

                            {/* Widgets Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="bg-blue-500 text-white rounded-full p-4 mr-4"><i className="bi bi-currency-dollar text-3xl"></i></div>
                                        <div>
                                            <h5 className="text-gray-500 mb-1">Total Sales</h5>
                                            <h3 className="text-2xl font-bold text-gray-800">$2,345</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="bg-green-500 text-white rounded-full p-4 mr-4"><i className="bi bi-graph-up text-3xl"></i></div>
                                        <div>
                                            <h5 className="text-gray-500 mb-1">Revenue</h5>
                                            <h3 className="text-2xl font-bold text-gray-800">$1,234</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="bg-yellow-500 text-white rounded-full p-4 mr-4"><i className="bi bi-cart-fill text-3xl"></i></div>
                                        <div>
                                            <h5 className="text-gray-500 mb-1">Orders</h5>
                                            <h3 className="text-2xl font-bold text-gray-800">128</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="bg-indigo-500 text-white rounded-full p-4 mr-4"><i className="bi bi-people-fill text-3xl"></i></div>
                                        <div>
                                            <h5 className="text-gray-500 mb-1">New Users</h5>
                                            <h3 className="text-2xl font-bold text-gray-800">54</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts and Tables Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="main-dashboard-content">
                                <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
                                    <h5 className="text-lg font-bold text-gray-800 mb-4">Sales Overview</h5>
                                    <canvas id="salesChart"></canvas>
                                </div>
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <h5 className="text-lg font-bold text-gray-800 mb-4">Revenue by Category</h5>
                                    <canvas id="revenueChart"></canvas>
                                </div>
                                <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
                                    <h5 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h5>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="py-3 px-4">#</th>
                                                    <th className="py-3 px-4">Product</th>
                                                    <th className="py-3 px-4">Customer</th>
                                                    <th className="py-3 px-4">Date</th>
                                                    <th className="py-3 px-4">Amount</th>
                                                    <th className="py-3 px-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">1</td>
                                                    <td className="py-3 px-4">Laptop Pro</td>
                                                    <td className="py-3 px-4">John Doe</td>
                                                    <td className="py-3 px-4">2023-08-01</td>
                                                    <td className="py-3 px-4">$1,200</td>
                                                    <td className="py-3 px-4"><span className="bg-green-200 text-green-800 rounded-full px-3 py-1 text-sm">Completed</span></td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">2</td>
                                                    <td className="py-3 px-4">Wireless Mouse</td>
                                                    <td className="py-3 px-4">Jane Smith</td>
                                                    <td className="py-3 px-4">2023-07-31</td>
                                                    <td className="py-3 px-4">$45</td>
                                                    <td className="py-3 px-4"><span className="bg-yellow-200 text-yellow-800 rounded-full px-3 py-1 text-sm">Pending</span></td>
                                                </tr>
                                                <tr className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">3</td>
                                                    <td className="py-3 px-4">Mechanical Keyboard</td>
                                                    <td className="py-3 px-4">Peter Jones</td>
                                                    <td className="py-3 px-4">2023-07-30</td>
                                                    <td className="py-3 px-4">$150</td>
                                                    <td className="py-3 px-4"><span className="bg-red-200 text-red-800 rounded-full px-3 py-1 text-sm">Cancelled</span></td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="py-3 px-4">4</td>
                                                    <td className="py-3 px-4">Gaming Monitor</td>
                                                    <td className="py-3 px-4">Sarah Lee</td>
                                                    <td className="py-3 px-4">2023-07-29</td>
                                                    <td className="py-3 px-4">$450</td>
                                                    <td className="py-3 px-4"><span className="bg-green-200 text-green-800 rounded-full px-3 py-1 text-sm">Completed</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'addProduct' && (
                        <AddProductSection />
                    )}

                    

                    {activeSection === 'addPost' && (
                        <AddBlogPostSection />
                    )}

                    {activeSection === 'addAuthor' && (
                        <AddAuthorSection />
                    )}

                    {activeSection === 'viewPosts' && (
                        <BlogPostListTable />
                    )}

                                        {activeSection === 'userApproval' && user && user.role === 'admin' && (
                        <UserApprovalTable />
                    )}

                    {activeSection === 'contact-info' && (
                        <ContactInfoSection />
                    )}

                    {activeSection === 'address-settings' && (
                        <AddressSettingsSection />
                    )}

                    {/* Profile Section (Hidden by default) */}
                    {activeSection === 'profile' && (
                        <div id="profile-section">
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h5 className="text-lg font-bold text-gray-800 mb-4">Profile Section</h5>
                                <p>This is the profile section.</p>
                            </div>
                        </div>
                    )}

                    {/* Customize Appearance Section */}
                    {activeSection === 'customizeAppearance' && (
                        <AppearanceCustomizeSection />
                    )}

                    {activeSection === 'customizeProductHeading' && (
                        <ProductHeadingSectionCustomize />
                    )}

                    {activeSection === 'footer-menu-customize' && (
                        <FooterMenuCustomize />
                    )}

                    {/* Settings Section (Hidden by default) */}
                    {activeSection === 'settings' && (
                        <SettingsSection />
                    )}

                    {/* Posts Section (Hidden by default) */}
                    {activeSection === 'posts' && (
                        <div id="posts-section">
                            <div className="bg-white shadow-lg rounded-lg p-6">
                                <h5 className="text-lg font-bold text-gray-800 mb-4">Posts Section</h5>
                                <p>This is the posts section.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardClient;