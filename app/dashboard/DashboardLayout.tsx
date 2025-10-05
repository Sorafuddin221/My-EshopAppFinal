'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import LoginSection from './LoginSection';
import DashboardNavbar from './DashboardNavbar';
import WidgetsSection from './WidgetsSection';
import ChartsAndTablesSection from './ChartsAndTablesSection';
import ProductListTable from './ProductListTable';
import BlogPostListTable from './BlogPostListTable';
import AddBlogPostSection from './AddBlogPostSection';
import AddProductSection from './AddProductSection';
import ShopSection from './ShopSection';
import ProfileSection from './ProfileSection';
import SettingsSection from './SettingsSection';
import UserApprovalTable from './UserApprovalTable';
import AuthorListTable from './AuthorListTable';

export default function DashboardLayout({ children, activeSection, setActiveSection }: { children: React.ReactNode; activeSection: string; setActiveSection: (section: string) => void; }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
    if (success) {
      setActiveSection('dashboard'); // Show dashboard content after successful login
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onNavigate={setActiveSection} />

      <div className="ml-64 flex-grow p-8">
        {!isLoggedIn ? (
          <LoginSection onLogin={handleLogin} />
        ) : (
          <>
            <DashboardNavbar title={activeSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
            <div id="dashboard-content">
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
