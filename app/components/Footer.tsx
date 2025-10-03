'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faFacebookF, faPinterestP, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import api from '../../utils/api';

interface FooterMenu {
  _id: string;
  title: string;
  url: string;
}

interface RecentPost {
  _id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

export default function Footer() {
  const [footerAboutText, setFooterAboutText] = useState('');
  const [footerCopyrightText, setFooterCopyrightText] = useState('');
  const [footerSocialLinks, setFooterSocialLinks] = useState<{ platform: string; url: string; }[]>([]);
  const [footerPaymentImages, setFooterPaymentImages] = useState<string[]>([]);
  const [footerMenus, setFooterMenus] = useState<FooterMenu[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]); // Changed from reviews to recentPosts
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [navbarLogoUrl, setNavbarLogoUrl] = useState(''); // New state for logo URL
  const [navbarLogoText, setNavbarLogoText] = useState(''); // New state for logo text
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/settings');
        setFooterAboutText(settings.footerAboutText || 'Lorem ipsum dolor sit amet, anim id est adipsici vam aliquam qua anim id est laborum laborum. Perspoconsectetur, adipiscici vam aliquam qua anim id est laborum.');
        setFooterCopyrightText(settings.footerCopyrightText || 'Copyright &copy; ThemeIM 2025. All Right Reserved');
        setFooterSocialLinks(settings.footerSocialLinks || [
          { platform: 'twitter', url: '#' },
          { platform: 'facebook', url: '#' },
          { platform: 'pinterest', url: '#' },
          { platform: 'google-plus', url: '#' },
        ]);
        setFooterPaymentImages(settings.footerPaymentImages || []);
        setNavbarLogoUrl(settings.navbarLogoUrl || 'https://via.placeholder.com/40x40?text=Logo'); // Fetch logo URL
        setNavbarLogoText(settings.navbarLogoText || 'DEAL DIVERSify'); // Fetch logo text
      } catch (err) {
        console.error('Error fetching footer settings:', err);
        // Fallback to default values
        setFooterAboutText('Lorem ipsum dolor sit amet, anim id est adipsici vam aliquam qua anim id est laborum laborum. Perspoconsectetur, adipiscici vam aliquam qua anim id est laborum.');
        setFooterCopyrightText('Copyright &copy; ThemeIM 2025. All Right Reserved');
        setFooterSocialLinks([
          { platform: 'twitter', url: '#' },
          { platform: 'facebook', url: '#' },
          { platform: 'pinterest', url: '#' },
          { platform: 'google-plus', url: '#' },
        ]);
        setNavbarLogoUrl('https://via.placeholder.com/40x40?text=Logo'); // Fallback logo URL
        setNavbarLogoText('DEAL DIVERSify'); // Fallback logo text
      } finally {
        setLoading(false);
      }
    };

    const fetchFooterMenus = async () => {
      try {
        const menus = await api.get('/footer-menus');
        setFooterMenus(menus);
      } catch (error) {
        console.error('Error fetching footer menus:', error);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const posts = await api.get('/blogposts');
        setRecentPosts(posts.slice(0, 2)); // Get top 2 recent posts
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    fetchSettings();
    fetchFooterMenus();
    fetchRecentPosts();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/newsletter-subscriptions', { email: newsletterEmail });
      alert('Thank you for subscribing!');
      setNewsletterEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      alert('Failed to subscribe to newsletter.');
    }
  };

  if (loading) {
    return null; // Or a loading spinner/placeholder
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return faTwitter;
      case 'facebook': return faFacebookF;
      case 'pinterest': return faPinterestP;
      case 'google-plus': return faGooglePlusG;
      default: return null;
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <img src={navbarLogoUrl} alt={`${navbarLogoText} Logo`} className="h-10" />
             <span className="text-3xl font-bold text-orange-500">{navbarLogoText}</span>
          </div>
          <p className="text-sm mb-6">{footerAboutText}</p>
          <div className="flex space-x-4">
            {footerSocialLinks.map((link, index) => {
              const Icon = getSocialIcon(link.platform);
              return Icon ? (
                <a key={index} href={link.url} className="w-10 h-10 bg-gray-700 hover:bg-orange-500 text-white flex items-center justify-center rounded-full transition-colors duration-300">
                  <FontAwesomeIcon icon={Icon} />
                </a>
              ) : null;
            })}
          </div>
        </div>

        {/* Footer Menu */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Footer Menu</h3>
          <ul className="space-y-2 text-sm">
            {footerMenus.map((menu) => (
              <li key={menu._id}>
                <a href={menu.url} className="hover:text-orange-500 transition-colors duration-300">
                  {menu.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Post */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Recent Post</h3>
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post._id} className="flex items-start space-x-4">
                <img src={post.imageUrl ? `http://localhost:3001${post.imageUrl}` : "https://placehold.co/80x80/1e293b/FFFFFF?text=Blog+Post"} alt={post.title} className="w-16 h-16 rounded-md object-cover" style={{ display: 'block', width: '64px', height: '64px', opacity: '1' }} />
                <div>
                  <a href={`/single-blog/${post._id}`} className="font-semibold text-gray-100 hover:text-orange-500">{post.title}</a>
                  <div className="text-gray-500 text-sm mt-1">{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Newsletter Signup</h3>
          <p className="text-sm mb-4">By subcribing to our mailing list you will get 10% discount.</p>
          <form onSubmit={handleNewsletterSubmit}>
            <div className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Enter Your Email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                JOIN US
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-950 text-gray-500 mt-5 py-4 text-sm text-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>{footerCopyrightText}</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            {footerPaymentImages.map((imageUrl, index) => (
              imageUrl && imageUrl !== '' ? (
                <img key={index} src={imageUrl} alt={`Payment Logo ${index + 1}`} className="h-6" />
              ) : null
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}