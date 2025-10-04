'use client';


import HeroSectionCustomize from './HeroSectionCustomize';
import LatestBlogPostsSectionCustomize from './LatestBlogPostsSectionCustomize';

import TeamLeaderSectionCustomize from './TeamLeaderSectionCustomize';
import FooterCustomize from './FooterCustomize';
import MenuCustomize from './MenuCustomize';

const AppearanceCustomizeSection = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Customize Appearance</h2>
      <HeroSectionCustomize />
      <LatestBlogPostsSectionCustomize />

      <TeamLeaderSectionCustomize />
      <FooterCustomize />
      <MenuCustomize />
    </div>
  );
};

export default AppearanceCustomizeSection;