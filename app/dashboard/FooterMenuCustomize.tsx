'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import FooterCustomize from './FooterCustomize';

interface FooterMenu {
  _id: string;
  title: string;
  url: string;
}

export default function FooterMenuCustomize() {
  const [footerMenus, setFooterMenus] = useState<FooterMenu[]>([]);
  const [newMenu, setNewMenu] = useState({ title: '', url: '' });
  const [editingMenu, setEditingMenu] = useState(null);
  const [message, setMessage] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    const fetchFooterMenus = async () => {
      try {
        const menus = await api.get('/footer-menus');
        setFooterMenus(menus);
      } catch (error: any) {
        console.error('Error fetching footer menus:', error);
        setMessage('Failed to load footer menus.');
      }
    };
    fetchFooterMenus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, menuId: string) => {
    const { name, value } = e.target;
    if (menuId === 'new') {
      setNewMenu({ ...newMenu, [name]: value });
    } else {
      const updatedMenus = footerMenus.map((menu) =>
        menu._id === menuId ? { ...menu, [name]: value } : menu
      );
      setFooterMenus(updatedMenus);
    }
  };

  const handleAddMenu = async () => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    try {
      const response = await api.post('/footer-menus', newMenu, token);
      setFooterMenus([...footerMenus, response]);
      setNewMenu({ title: '', url: '' });
      setMessage('Footer menu added successfully!');
    } catch (error: any) {
      console.error('Error adding footer menu:', error);
      setMessage('Failed to add footer menu.');
    }
  };

  const handleUpdateMenu = async (menuId: string) => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    const menuToUpdate = footerMenus.find((menu) => menu._id === menuId);

    try {
      const response = await api.put(`/footer-menus/${menuId}`, menuToUpdate, token);
      setMessage('Footer menu updated successfully!');
    } catch (error: any) {
      console.error('Error updating footer menu:', error);
      setMessage('Failed to update footer menu.');
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    try {
      await api.delete(`/footer-menus/${menuId}`, token);
      const updatedMenus = footerMenus.filter((menu) => menu._id !== menuId);
      setFooterMenus(updatedMenus);
      setMessage('Footer menu deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting footer menu:', error);
      setMessage('Failed to delete footer menu.');
    }
  };

  return (
    <div id="footer-menu-customize">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Footer Menu</h5>
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
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={newMenu.url}
              onChange={(e) => handleInputChange(e, 'new')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button onClick={handleAddMenu} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add
            </button>
          </div>
        </div>

        <div>
          <h6 className="text-md font-bold text-gray-800 mb-2">Existing Menus</h6>
          {footerMenus.map((menu) => (
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
      <FooterCustomize />
    </div>
  );
}