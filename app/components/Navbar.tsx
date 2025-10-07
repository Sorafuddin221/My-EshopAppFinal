'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faBars, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import api from '../../utils/api'; // Import the API utility
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

interface SubMenu {
  _id: string;
  title: string;
  url: string;
  parent: {
    _id: string;
  };
}

interface NavMenu {
  _id: string;
  title: string;
  url: string;
  subMenus?: SubMenu[];
}

interface Brand {
  _id: string;
  name: string;
}

export default function Navbar() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]); // State to store brands
  const [navMenus, setNavMenus] = useState<NavMenu[]>([]);
  const [navbarLogoUrl, setNavbarLogoUrl] = useState('https://placehold.co/40x40?text=Logo'); // Default
  const [navbarLogoText, setNavbarLogoText] = useState('DEAL DIVERSify'); // Default
  const [isLogoTextVisible, setIsLogoTextVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false); // New state for sticky behavior
  const { user, token } = useAuth(); // Get user and token from AuthContext

  // Fetch brands and settings on component mount
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [fetchedNavMenus, fetchedSubMenus] = await Promise.all([
          api.get('/nav-menus'),
          api.get('/sub-menus')
        ]);

        const menusWithSubMenus = fetchedNavMenus.map((navMenu: NavMenu) => ({
          ...navMenu,
          subMenus: fetchedSubMenus.filter((subMenu: SubMenu) => subMenu.parent._id === navMenu._id)
        }));

        console.log('menusWithSubMenus', menusWithSubMenus);
        setNavMenus(menusWithSubMenus);

        const fetchedBrands = await api.get('/brands');
        setBrands(fetchedBrands);

        const settings = await api.get('/settings');
        console.log('Fetched Navbar settings:', settings);
        if (settings) {
          setNavbarLogoUrl(settings.navbarLogoUrl || navbarLogoUrl);
          setNavbarLogoText(settings.navbarLogoText || navbarLogoText);
          setIsLogoTextVisible(settings.isLogoTextVisible !== false);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchMenus();

    const handleScroll = () => {
      const headerHeight = 60;
      if (window.scrollY > headerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={`bg-white shadow-md pt-0 ${isSticky ? 'fixed top-0 w-full z-50' : ''}`}>
      {!isSticky && (
      <div className="container mx-auto px-5 py-3 flex justify-between items-center">        
          <Link href="/">
            <div className="flex items-center space-x-2">
              <img src={navbarLogoUrl} alt={`${navbarLogoText} Logo`} className="h-20" />
              {isLogoTextVisible && <span className="text-3xl font-bold text-orange-500">{navbarLogoText}</span>}
            </div>
          </Link>
        

        {/* Search Bar */}
        
          <form onSubmit={handleSearchSubmit} className="flex-grow mx-10 max-w-lg relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        
        

        {/* Icons */}
        
          <div className="flex items-center space-x-6 text-gray-700">
              <Link href="#" className="relative hover:text-orange-500">
                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </Link>
          </div>
        
    </div>
    )}

      {/* Secondary Menu Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center text-m font-semibold text-gray-700">
          <div className="relative group" onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
            <button className="flex items-center space-x-2 pt-1.5 pb-1.5 pr-3 pl-3 hover:text-orange-500 border-b border-gray-400">
              <FontAwesomeIcon icon={faBars} />
              <span>ALL DEPARTMENT</span>
            </button>
            {isMegaMenuOpen && (
                <div className="absolute   left-0 mt-0 w-max bg-white shadow-lg rounded-b-lg block z-50">
                      <h3 className="font-bold px-2  text-lg mb-4 border-b-2 border-red-500 pb-2">NAVIGATION</h3>
                      <ul>
                        {navMenus.map((menu) => (
                          <li key={menu._id} className="relative group my-4 -5 mx-6">
                            <Link href={menu.url} className="hover:text-red-500 flex items-center transition-colors duration-200">
                              <FontAwesomeIcon icon={faChevronRight} className="text-xs mr-2" />
                              {menu.title}
                              {menu.subMenus && menu.subMenus.length > 0 && (
                                <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-auto" />
                              )}
                            </Link>
                            {menu.subMenus && menu.subMenus.length > 0 && (
                              <ul className="absolute left-full top-0 mt-0 w-48 bg-white shadow-lg rounded-md py-2 z-50 hidden group-hover:block">
                                {menu.subMenus.map((subMenu) => (
                                  <li key={subMenu._id}>
                                    <Link href={subMenu.url} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                      {subMenu.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
              )}
          </div>
          <div className="hidden md:flex space-x-8">
            {navMenus.map((menu) => (
              <div key={menu._id} className="relative group">
                <Link href={menu.url} className="py-2 hover:text-orange-500 flex items-center space-x-1">
                  <span>{menu.title}</span>
                  {menu.subMenus && menu.subMenus.length > 0 && (
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  )}
                </Link>
                {menu.subMenus && menu.subMenus.length > 0 && (
                  <div className="absolute left-0 w-48 bg-white shadow-lg rounded-md py-2 z-50 hidden group-hover:block top-full">
                    {menu.subMenus.map((subMenu) => (
                      <Link key={subMenu._id} href={subMenu.url} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {subMenu.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}