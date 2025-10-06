import { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProfileSection from './ProfileSection';
import SettingsSection from './SettingsSection';
import AppearanceCustomizeSection from './AppearanceCustomizeSection';
import HeroSectionCustomize from './HeroSectionCustomize';
import ProductHeadingSectionCustomize from './ProductHeadingSectionCustomize';
import TeamLeaderSectionCustomize from './TeamLeaderSectionCustomize';
import LatestBlogPostsSectionCustomize from './LatestBlogPostsSectionCustomize';
import FooterCustomize from './FooterCustomize';
import FooterMenuCustomize from './FooterMenuCustomize';
import AddProductSection from './AddProductSection';
import ProductListTable from './ProductListTable';
import AddBlogPostSection from './AddBlogPostSection';
import BlogPostListTable from './BlogPostListTable';
import AddAuthorSection from './AddAuthorSection';
import AuthorListTable from './AuthorListTable';
import UserApprovalTable from './UserApprovalTable';
import ChartsAndTablesSection from './ChartsAndTablesSection';
import ContactInfoSection from './ContactInfoSection';
import AddressSettingsSection from './AddressSettingsSection';
import ShopSection from './ShopSection';
import WidgetsSection from './WidgetsSection';
import DashboardLayout from './DashboardLayout';

const DashboardClient = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const fetchedAuthors = await api.get('/authors');
        setAuthors(fetchedAuthors);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };
    fetchAuthors();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <SettingsSection />;
      case 'appearance-customize':
        return <AppearanceCustomizeSection />;

      case 'product-heading-section-customize':
        return <ProductHeadingSectionCustomize />;
      case 'team-leader-section-customize':
        return <TeamLeaderSectionCustomize />;
      case 'latest-blog-posts-section-customize':
        return <LatestBlogPostsSectionCustomize />;
      case 'footer-customize':
        return <FooterCustomize />;
      case 'footer-menu-customize':
        return <FooterMenuCustomize />;
      case 'add-product':
        return <AddProductSection />;
      case 'add-blog-post':
        return <AddBlogPostSection />; 



      case 'add-author':
        return <AddAuthorSection />;
      case 'author-list':
        return <AuthorListTable authors={authors} />;
      case 'user-approval':
        return <UserApprovalTable />;
      case 'authors':
        return (
          <>
            <AddAuthorSection />
            <AuthorListTable authors={authors} />
          </>
        );
      case 'charts-tables':
        return <ChartsAndTablesSection />;
      case 'contact-info':
        return <ContactInfoSection />;
      case 'address-settings':
        return <AddressSettingsSection />;
      case 'shop-section':
        return <ShopSection />;
      case 'widgets-section':
        return <WidgetsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </DashboardLayout>
  );
};

export default DashboardClient;