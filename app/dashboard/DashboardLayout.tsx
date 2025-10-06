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

export default function DashboardLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
    if (success) {
      setActiveSection('dashboard'); // Show dashboard content after successful login
    }
  };

  const handleNavigation = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onNavigate={handleNavigation} />

      <div className="ml-64 flex-grow p-8">
        {!isLoggedIn ? (
          <LoginSection onLogin={handleLogin} />
        ) : (
          <>
            <DashboardNavbar title={activeSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
            <div id="dashboard-content">
              {activeSection === 'dashboard' && <WidgetsSection />}
              {activeSection === 'dashboard' && <ChartsAndTablesSection />}
              {activeSection === 'add-product' && <AddProductSection />}
              {activeSection === 'products' && <ProductListTable />}
              {activeSection === 'shop' && <ShopSection />}
              {activeSection === 'profile' && <ProfileSection />}
              {activeSection === 'settings' && <SettingsSection />}
              {activeSection === 'add-blog-post' && <AddBlogPostSection />}
              {activeSection === 'posts' && <BlogPostListTable />}
              {activeSection === 'user-approval' && <UserApprovalTable />}
              {activeSection === 'authors' && <AuthorListTable authors={[]} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
