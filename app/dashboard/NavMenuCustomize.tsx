'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface NavMenu {
  _id: string;
  title: string;
  url: string;
}

interface Page {
  path: string;
  url: string;
}

export default function NavMenuCustomize() {
  const [navMenus, setNavMenus] = useState<NavMenu[]>([]);
  const [newMenu, setNewMenu] = useState({ title: '', url: '' });
  const [editingMenu, setEditingMenu] = useState(null);
  const [message, setMessage] = useState('');
  const [pages, setPages] = useState<Page[]>([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchNavMenus = async () => {
      try {
        const menus = await api.get('/nav-menus');
        setNavMenus(menus);
      } catch (error: any) {
        console.error('Error fetching nav menus:', error);
        setMessage('Failed to load nav menus.');
      }
    };
    fetchNavMenus();

    const fetchPages = async () => {
      try {
        // This is a placeholder for fetching pages. 
        // In a real application, you would have an API endpoint to get the pages.
        const pageData = [
          {
            "path": "app/blog-posts/page.tsx",
            "url": "/blog-posts"
          },
          {
            "path": "app/products/page.tsx",
            "url": "/products"
          },
          {
            "path": "app/page.tsx",
            "url": "/"
          },
          {
            "path": "app/contact/page.tsx",
            "url": "/contact"
          },
          {
            "path": "app/dashboard/page.tsx",
            "url": "/dashboard"
          },
          {
            "path": "app/products-by-category/page.tsx",
            "url": "/products-by-category"
          },
          {
            "path": "app/single-blog/page.tsx",
            "url": "/single-blog"
          },
          {
            "path": "app/single-product/page.tsx",
            "url": "/single-product"
          }
        ];
        setPages(pageData);
      } catch (error: any) {
        console.error('Error fetching pages:', error);
      }
    };
    fetchPages();

  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, menuId: string) => {
    const { name, value } = e.target;
    if (menuId === 'new') {
      setNewMenu({ ...newMenu, [name]: value });
    } else {
      const updatedMenus = navMenus.map((menu) =>
        menu._id === menuId ? { ...menu, [name]: value } : menu
      );
      setNavMenus(updatedMenus);
    }
  };

  const handleAddMenu = async () => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    try {
      const response = await api.post('/nav-menus', newMenu, token);
      setNavMenus([...navMenus, response]);
      setNewMenu({ title: '', url: '' });
      setMessage('Nav menu added successfully!');
    } catch (error: any) {
      console.error('Error adding nav menu:', error);
      setMessage('Failed to add nav menu.');
    }
  };

  const handleUpdateMenu = async (menuId: string) => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    const menuToUpdate = navMenus.find((menu) => menu._id === menuId);

    try {
      const response = await api.put(`/nav-menus/${menuId}`, menuToUpdate, token);
      setMessage('Nav menu updated successfully!');
    } catch (error: any) {
      console.error('Error updating nav menu:', error);
      setMessage('Failed to update nav menu.');
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    try {
      await api.delete(`/nav-menus/${menuId}`, token);
      const updatedMenus = navMenus.filter((menu) => menu._id !== menuId);
      setNavMenus(updatedMenus);
      setMessage('Nav menu deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting nav menu:', error);
      setMessage('Failed to delete nav menu.');
    }
  };

  return (
    <div id="menu-customize">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Nav Menu</h5>
        {message && <p className="text-sm mt-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}

        <div className="mb-4">
          <h6 className="text-md font-bold text-gray-800 mb-2">Add New Menu</h6>
          <div className="flex items-center">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newMenu.title}
              onChange={(e) => handleInputChange(e, 'new')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <select
              name="url"
              value={newMenu.url}
              onChange={(e) => handleInputChange(e, 'new')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            >
              <option value="">Select a page</option>
              {pages.map((page) => (
                <option key={page.path} value={page.url}>
                  {page.path}
                </option>
              ))}
            </select>
            <button onClick={handleAddMenu} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add
            </button>
          </div>
        </div>

        <div>
          <h6 className="text-md font-bold text-gray-800 mb-2">Existing Menus</h6>
          {navMenus.map((menu) => (
            <div key={menu._id} className="flex items-center mb-2">
              <input
                type="text"
                name="title"
                value={menu.title}
                onChange={(e) => handleInputChange(e, menu._id)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <input
                type="text"
                name="url"
                value={menu.url}
                onChange={(e) => handleInputChange(e, menu._id)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <button onClick={() => handleUpdateMenu(menu._id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                Update
              </button>
              <button onClick={() => handleDeleteMenu(menu._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}