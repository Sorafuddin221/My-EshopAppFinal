'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrip, faUserCircle, faBasketShopping, faCartShopping, faGear, faPencilSquare, faPalette, faArrowRightFromBracket, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  onNavigate: (section: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="bg-white shadow-md w-64 fixed top-0 bottom-0 left-0 z-20 overflow-y-auto">
      <div className="text-center py-8 flex items-center justify-center">
        <img src="https://placehold.co/40x40/1e293b/FFFFFF?text=Logo" alt="Logo" className="h-10 w-10 mr-3" />
        <span className="text-2xl font-bold text-blue-600">Admin Panel</span>
      </div>
      <ul className="flex flex-col">
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#dashboard" onClick={() => onNavigate('dashboard')}>
            <FontAwesomeIcon icon={faGrip} className="mr-2" />
            <span>Dashboard</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#profile" onClick={() => onNavigate('profile')}>
            <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
            <span>Profile</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#contact-info" onClick={() => onNavigate('contact-info')}>
            <FontAwesomeIcon icon={faBasketShopping} className="mr-2" />
            <span>Contact Info</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#products" onClick={() => onNavigate('products')}>
            <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
            <span>Products</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#add-product" onClick={() => onNavigate('add-product')}>
            <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
            <span>Add Product</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#settings" onClick={() => onNavigate('settings')}>
            <FontAwesomeIcon icon={faGear} className="mr-2" />
            <span>Settings</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#user-approval" onClick={() => onNavigate('user-approval')}>
            <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
            <span>User Approval</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#authors" onClick={() => onNavigate('authors')}>
            <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
            <span>Authors</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#posts" onClick={() => onNavigate('posts')}>
            <FontAwesomeIcon icon={faPencilSquare} className="mr-2" />
            <span>Blog Posts</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#add-blog-post" onClick={() => onNavigate('add-blog-post')}>
            <FontAwesomeIcon icon={faPencilSquare} className="mr-2" />
            <span>Add Blog Post</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#customize" onClick={() => onNavigate('customize')}>
            <FontAwesomeIcon icon={faPalette} className="mr-2" />
            <span>Customize</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#hero-customize" onClick={() => onNavigate('hero-customize')}>
            <FontAwesomeIcon icon={faPalette} className="mr-2" />
            <span>Hero Section Customize</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#address-settings" onClick={() => onNavigate('address-settings')}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <span>Address Settings</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#menu-customize" onClick={() => onNavigate('menu-customize')}>
            <FontAwesomeIcon icon={faPalette} className="mr-2" />
            <span>Menu Customize</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#nav-menu-management" onClick={() => onNavigate('nav-menu-management')}>
            <FontAwesomeIcon icon={faPalette} className="mr-2" /> {/* Using faPalette as a placeholder icon */}
            <span>Navigation Menus</span>
          </a>
        </li>
        <li className="px-4 py-2">
          <a className="flex items-center text-gray-700 hover:bg-gray-200 hover:text-blue-600 rounded-lg p-2" href="#">
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
