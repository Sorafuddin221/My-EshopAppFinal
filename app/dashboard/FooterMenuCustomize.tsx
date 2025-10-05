'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface FooterMenu {
  _id: string;
  title: string;
  url: string;
}

export default function FooterMenuCustomize() {
  const [footerMenus, setFooterMenus] = useState<FooterMenu[]>([]);
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuUrl, setNewMenuUrl] = useState('');
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editingMenuTitle, setEditingMenuTitle] = useState('');
  const [editingMenuUrl, setEditingMenuUrl] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchFooterMenus();
  }, []);

  const fetchFooterMenus = async () => {
    try {
      const menus = await api.get('/footer-menus');
      if (Array.isArray(menus)) {
        setFooterMenus(menus);
      } else {
        console.error('API returned non-array for footer menus:', menus);
        setFooterMenus([]);
      }
    } catch (error) {
      console.error('Error fetching footer menus:', error);
      setMessage('Failed to load footer menus.');
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    if (!newMenuTitle || !newMenuUrl) {
      setMessage('Please enter both title and URL for the new menu item.');
      return;
    }

    try {
      const response = await api.post('/footer-menus', { title: newMenuTitle, url: newMenuUrl }, token);
      if (response) {
        setMessage('Menu item added successfully!');
        setNewMenuTitle('');
        setNewMenuUrl('');
        fetchFooterMenus(); // Refresh the list
      } else {
        setMessage('Failed to add menu item.');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      setMessage('Server error. Could not add menu item.');
    }
  };

  const handleEditClick = (menu: FooterMenu) => {
    setEditingMenuId(menu._id);
    setEditingMenuTitle(menu.title);
    setEditingMenuUrl(menu.url);
  };

  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    if (!editingMenuId || !editingMenuTitle || !editingMenuUrl) {
      setMessage('Please enter both title and URL for the edited menu item.');
      return;
    }

    try {
      const response = await api.put(`/footer-menus/${editingMenuId}`, { title: editingMenuTitle, url: editingMenuUrl }, token);
      if (response) {
        setMessage('Menu item updated successfully!');
        setEditingMenuId(null);
        setEditingMenuTitle('');
        setEditingMenuUrl('');
        fetchFooterMenus(); // Refresh the list
      } else {
        setMessage('Failed to update menu item.');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      setMessage('Server error. Could not update menu item.');
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    setMessage('');
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await api.delete(`/footer-menus/${menuId}`, token);
      setMessage('Menu item deleted successfully!');
      fetchFooterMenus(); // Refresh the list
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setMessage('Server error. Could not delete menu item.');
    }
  };

  return (
    <div id="footer-menu-customize">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Footer Menus</h5>

        {/* Add New Menu Item Form */}
        <form onSubmit={handleAddMenu} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h6 className="font-semibold text-gray-700 mb-3">Add New Footer Menu Item</h6>
          <div className="mb-4">
            <label htmlFor="new-menu-title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              id="new-menu-title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., About Us"
              value={newMenuTitle}
              onChange={(e) => setNewMenuTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-menu-url" className="block text-gray-700 text-sm font-bold mb-2">URL</label>
            <input
              type="text"
              id="new-menu-url"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., /about-us"
              value={newMenuUrl}
              onChange={(e) => setNewMenuUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add Menu Item
          </button>
        </form>

        {/* Existing Menu Items List */}
        <h6 className="font-semibold text-gray-700 mb-3">Existing Footer Menu Items</h6>
        {footerMenus.length === 0 ? (
          <p className="text-gray-600">No footer menu items found. Add some above!</p>
        ) : (
          <ul className="space-y-4">
            {footerMenus.map((menu) => (
              <li key={menu._id} className="p-4 border rounded-lg bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
                {editingMenuId === menu._id ? (
                  <form onSubmit={handleUpdateMenu} className="w-full flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1 mb-2 md:mb-0">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={editingMenuTitle}
                        onChange={(e) => setEditingMenuTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 mb-2 md:mb-0">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={editingMenuUrl}
                        onChange={(e) => setEditingMenuUrl(e.target.value)}
                      />
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingMenuId(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1 mb-2 md:mb-0">
                      <p className="font-semibold text-gray-800">{menu.title}</p>
                      <p className="text-sm text-gray-600">{menu.url}</p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <button onClick={() => handleEditClick(menu)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteMenu(menu._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {message && <p className="text-sm mt-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
      </div>
    </div>
  );
}
