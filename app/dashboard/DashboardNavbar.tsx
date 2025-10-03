'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

interface DashboardNavbarProps {
    title?: string;
}

export default function DashboardNavbar({ title = 'Dashboard' }: DashboardNavbarProps) {
  return (
    <nav className="bg-white shadow rounded-lg flex justify-between items-center p-4 mb-8" id="dashboard-navbar">
        <div className="flex items-center">
            <img src="https://placehold.co/40x40/1e293b/FFFFFF?text=Logo" alt="Logo" className="h-8 w-8 mr-4" />
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </div>
      <Link href="/" className="text-blue-500 hover:underline">Back to Site</Link>
      <div className="flex items-center">
        <div className="relative mr-4">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input type="text" className="bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none" placeholder="Search..." />
        </div>
        <a href="#" className="mr-4 text-gray-500"><FontAwesomeIcon icon={faBell} className="text-lg" /></a>
        <a href="#" className="flex items-center border border-gray-300 rounded-full px-4 py-2 text-gray-600 hover:bg-gray-100">
          <FontAwesomeIcon icon={faUser} className="mr-2" /> Account
        </a>
      </div>
    </nav>
  );
}
