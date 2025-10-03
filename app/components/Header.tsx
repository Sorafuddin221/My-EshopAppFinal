'use client';

import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss, faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faPinterestP, faGooglePlusG } from '@fortawesome/free-brands-svg-icons'; // Added faGooglePlusG
import api from '../../utils/api'; // Import the API utility

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn');
  const [headerPromoText, setHeaderPromoText] = useState('UPTO 50% OFF TO ALL VIRTUAL PRODUCTS'); // Default value
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string; }[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
            try {
                const settings = await api.get('/settings');
                console.log('Fetched Header settings:', settings);
                if (settings) {
                    if (settings.headerPromoText) {
                        setHeaderPromoText(settings.headerPromoText);
                    }
                    if (settings.footerSocialLinks) {
                        setSocialLinks(settings.footerSocialLinks);
                        console.log('Fetched social links for header:', settings.footerSocialLinks);
                    }
                }
            } catch (error) {
                console.error('Error fetching header settings:', error);
            }
        };
    fetchSettings();
  }, []);

  const openModal = (tab: 'signIn' | 'signUp') => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return faTwitter;
      case 'facebook': return faFacebookF;
      case 'pinterest': return faPinterestP;
      case 'google-plus': return faGooglePlusG;
      case 'rss': return faRss; // Assuming RSS is also a social link
      default: return null;
    }
  };

  return (
    <>
      <header className="bg-gray-800 text-white py-2 px-5 flex justify-between items-center text-m">
        <div className="flex space-x-6">
          {socialLinks.map((link, index) => {
            const Icon = getSocialIcon(link.platform);
            return Icon ? (
              <a key={index} href={link.url} className="hover:text-gray-400">
                <FontAwesomeIcon icon={Icon} />
              </a>
            ) : null;
          })}
        </div>
        <div className="text-center font-bold">
          {headerPromoText}
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="flex items-center space-x-1 hover:text-gray-400" onClick={() => openModal('signIn')}>
            <FontAwesomeIcon icon={faUser} />
          </a>
          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-gray-400">
              <span>USD</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </button>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} onClose={closeModal} initialTab={activeTab} />
    </>
  );
}