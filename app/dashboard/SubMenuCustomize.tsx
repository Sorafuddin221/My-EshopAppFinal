'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface SubMenu {
  _id: string;
  title: string;
  url: string;
  parent?: {
    _id: string;
  } | null;
  parentType: string;
}

interface NavMenu {
  _id: string;
  title: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Page {
  path: string;
  url: string;
}

export default function SubMenuCustomize() {
  const [subMenus, setSubMenus] = useState<SubMenu[]>([]);
  const [newSubMenu, setNewSubMenu] = useState({ title: '', url: '', parent: '', parentType: '' });
  const [editingSubMenu, setEditingSubMenu] = useState(null);
  const [message, setMessage] = useState('');
  const [pages, setPages] = useState<Page[]>([]);
  const [navMenus, setNavMenus] = useState<NavMenu[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [menus, navMenusData, brandsData, categoriesData] = await Promise.all([
          api.get('/sub-menus'),
          api.get('/nav-menus'),
          api.get('/brands'),
          api.get('/categories')
        ]);
        setSubMenus(menus);
        setNavMenus(navMenusData);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setMessage('Failed to load data.');
      }
    };
    fetchAllData();

    const fetchPages = async () => {
      try {
        const pageData = [
          { "path": "app/products/page.tsx", "url": "/products" },
          { "path": "app/products-by-category/page.tsx", "url": "/products-by-category" },
          { "path": "app/products/brand/page.tsx", "url": "/products/brand" }
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
        if (name === 'parent') {
            const [parentId, parentType] = value.split(',');
            setNewSubMenu({ ...newSubMenu, parent: parentId, parentType: parentType });
        } else {
            setNewSubMenu({ ...newSubMenu, [name]: value });
        }
    } else {
        if (name === 'parent') {
            const [parentId, parentType] = value.split(',');
            let parentObject = null;
            if (parentType === 'NavMenu') {
                parentObject = navMenus.find(m => m._id === parentId);
            } else if (parentType === 'Brand') {
                parentObject = brands.find(b => b._id === parentId);
            } else if (parentType === 'Category') {
                parentObject = categories.find(c => c._id === parentId);
            }

            const updatedMenus = subMenus.map((menu) =>
                menu._id === menuId ? { ...menu, parent: parentObject, parentType: parentType } : menu
            );
            setSubMenus(updatedMenus);
        } else {
            const updatedMenus = subMenus.map((menu) =>
                menu._id === menuId ? { ...menu, [name]: value } : menu
            );
            setSubMenus(updatedMenus);
        }
    }
  };

  const handleAddSubMenu = async () => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    if (!newSubMenu.parent || !newSubMenu.parentType) {
      setMessage('Error: Please select a parent for the sub menu.');
      return;
    }

    try {
      const response = await api.post('/sub-menus', newSubMenu, token);
      setSubMenus([...subMenus, response]);
      setNewSubMenu({ title: '', url: '', parent: '', parentType: '' });
      setMessage('Sub menu added successfully!');
    } catch (error: any) {
      console.error('Error adding sub menu:', error);
      setMessage('Failed to add sub menu.');
    }
  };

  const handleUpdateSubMenu = async (menuId: string) => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    const menuToUpdate = subMenus.find((menu) => menu._id === menuId);

    if (!menuToUpdate) {
      setMessage('Error: Menu not found.');
      return;
    }

    const updateData = {
        ...menuToUpdate,
        parent: menuToUpdate.parent ? menuToUpdate.parent._id : null
    };

    try {
      const response = await api.put(`/sub-menus/${menuId}`, updateData, token);
      setMessage('Sub menu updated successfully!');
    } catch (error: any) {
      console.error('Error updating sub menu:', error);
      setMessage('Failed to update sub menu.');
    }
  };

  const handleDeleteSubMenu = async (menuId: string) => {
    if (!token) {
      setMessage('Error: Not authenticated.');
      return;
    }

    try {
      await api.delete(`/sub-menus/${menuId}`, token);
      const updatedMenus = subMenus.filter((menu) => menu._id !== menuId);
      setSubMenus(updatedMenus);
      setMessage('Sub menu deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting sub menu:', error);
      setMessage('Failed to delete sub menu.');
    }
  };

  return (
    <div id="submenu-customize">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Customize Sub Menu</h5>
        {message && <p className="text-sm mt-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}

        <div className="mb-4">
          <h6 className="text-md font-bold text-gray-800 mb-2">Add New Sub Menu</h6>
          <div className="flex items-center">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newSubMenu.title}
              onChange={(e) => handleInputChange(e, 'new')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <select
              name="url"
              value={newSubMenu.url}
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
              <select
                name="parent"
                value={`${newSubMenu.parent},${newSubMenu.parentType}`}
                onChange={(e) => handleInputChange(e, 'new')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              >
                <option value="">Select a parent</option>
                <optgroup label="Navigation Menus">
                  {navMenus.map((menu) => (
                    <option key={menu._id} value={`${menu._id},NavMenu`}>
                      {menu.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Brands">
                  {brands.map((brand) => (
                    <option key={brand._id} value={`${brand._id},Brand`}>
                      {brand.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Categories">
                  {categories.map((category) => (
                    <option key={category._id} value={`${category._id},Category`}>
                      {category.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            <button onClick={handleAddSubMenu} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add
            </button>
          </div>
        </div>

        <div>
          <h6 className="text-md font-bold text-gray-800 mb-2">Existing Sub Menus</h6>
          {subMenus.map((menu) => (
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
               <select
                name="parent"
                value={menu.parent ? `${menu.parent._id},${menu.parentType}` : ''}
                onChange={(e) => handleInputChange(e, menu._id)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                >
                <option value="">Select a parent</option>
                <optgroup label="Navigation Menus">
                  {navMenus.map((navMenu) => (
                      <option key={navMenu._id} value={`${navMenu._id},NavMenu`}>
                      {navMenu.title}
                      </option>
                  ))}
                </optgroup>
                <optgroup label="Brands">
                  {brands.map((brand) => (
                    <option key={brand._id} value={`${brand._id},Brand`}>
                      {brand.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Categories">
                  {categories.map((category) => (
                    <option key={category._id} value={`${category._id},Category`}>
                      {category.name}
                    </option>
                  ))}
                </optgroup>
                </select>
              <button onClick={() => handleUpdateSubMenu(menu._id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                Update
              </button>
              <button onClick={() => handleDeleteSubMenu(menu._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}