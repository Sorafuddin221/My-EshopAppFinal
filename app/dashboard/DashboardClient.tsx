import FooterMenuCustomize from './FooterMenuCustomize';
import FooterMenuCustomize from './FooterMenuCustomize';
// ... other imports

const DashboardClient = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <SettingsSection />;
      case 'appearance-customize':
        return <AppearanceCustomizeSection />;
      case 'hero-section-customize':
        return <HeroSectionCustomize />;
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
      case 'product-list':
        return <ProductListTable />;
      case 'add-blog-post':
        return <AddBlogPostSection />;
      case 'blog-post-list':
        return <BlogPostListTable />;
      case 'add-author':
        return <AddAuthorSection />;
      case 'author-list':
        return <AuthorListTable />;
      case 'user-approval':
        return <UserApprovalTable />;
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