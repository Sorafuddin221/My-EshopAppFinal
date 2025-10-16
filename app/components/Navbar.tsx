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
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState<string | null>(null);

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
      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-orange-500 focus:outline-none">
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 bg-opacity-75 absolute top-0 left-0 w-full h-screen z-50">
          <div className="bg-white w-4/5 h-screen p-5">
            <div className="flex justify-between items-center mb-5">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <img src={navbarLogoUrl} alt={`${navbarLogoText} Logo`} className="h-10" />
                  {isLogoTextVisible && <span className="text-xl font-bold text-orange-500">{navbarLogoText}</span>}
                </div>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-orange-500 focus:outline-none">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <ul>
              {navMenus.map((menu) => (
                <li key={menu._id} className="border-b border-gray-200">
                  <div className="flex justify-between items-center py-3">
                    <Link href={menu.url} className="flex-grow hover:text-orange-500">
                      {menu.title}
                    </Link>
                    {menu.subMenus && menu.subMenus.length > 0 && (
                      <button
                        onClick={() => setActiveMobileSubMenu(activeMobileSubMenu === menu._id ? null : menu._id)}
                        className="px-3 py-1 text-gray-500"
                      >
                        <FontAwesomeIcon icon={activeMobileSubMenu === menu._id ? faChevronDown : faChevronRight} />
                      </button>
                    )}
                  </div>
                  {menu.subMenus && menu.subMenus.length > 0 && activeMobileSubMenu === menu._id && (
                    <ul className="pl-4 pb-3">
                      {menu.subMenus.map((subMenu) => (
                        <li key={subMenu._id} className="py-1">
                          <Link href={subMenu.url} className="block hover:text-orange-500">
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
        </div>
      )}

      {/* Secondary Menu Bar */}
      <div className="hidden md:flex bg-white shadow-sm border-b border-gray-200">
        <div className="hidden md:flex container mx-auto px-4 py-5 justify-between items-center text-m font-semibold text-gray-700">
          <div className="hidden md:relative md:group" onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
            <button className="flex items-center space-x-2 pt-1.5 pb-1.5 pr-3 pl-3 hover:text-orange-500 border-b border-gray-400">
              <span>ALL DEPARTMENT</span>
            </button>
            {isMegaMenuOpen && (
                <div className="absolute left-0 mt-0 w-max bg-white shadow-lg rounded-b-lg block z-50">
                    <div className="flex">
                        <div className="w-64 border-r border-gray-200">
                            <h3 className="font-bold px-4 text-lg mb-4 border-b-2 border-red-500 pb-2">NAVIGATION</h3>
                            <ul>
                                {navMenus.map((menu) => (
                                    <li 
                                        key={menu._id} 
                                        className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseEnter={() => setActiveSubMenu(menu._id)}
                                    >
                                        <Link href={menu.url} className="flex items-center justify-between">
                                            <span>{menu.title}</span>
                                            {menu.subMenus && menu.subMenus.length > 0 && (
                                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-64 p-4">
                            {navMenus.map((menu) => (
                                <div key={menu._id} className={`${activeSubMenu === menu._id ? 'block' : 'hidden'}`}>
                                    <h3 className="font-bold text-lg mb-4">{menu.title}</h3>
                                    <ul>
                                        {menu.subMenus && menu.subMenus.map((subMenu) => (
                                            <li key={subMenu._id} className="mb-2">
                                                <Link href={subMenu.url} className="hover:text-red-500">
                                                    {subMenu.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
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