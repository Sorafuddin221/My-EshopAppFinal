
'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api'; // Import the API utility
import { useAuth } from '../../context/AuthContext'; // Import useAuth

interface LegalPageContent {
  content: string;
}

const LegalPagesSection: React.FC = () => {
  const [termsContent, setTermsContent] = useState<string>('');
  const [privacyContent, setPrivacyContent] = useState<string>('');
  const [disclosureContent, setDisclosureContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuth(); // Get the authentication token

  useEffect(() => {
    const fetchPageContent = async (slug: string, setContent: React.Dispatch<React.SetStateAction<string>>) => {
      try {
        const data: LegalPageContent = await api.get(`/pages/${slug}`); // Use api.get
        setContent(data.content);
      } catch (error: any) {
        console.error(`Failed to fetch ${slug} content:`, error);
        toast.error(`Failed to fetch ${slug} content: ${error.message || 'Server error'}`);
      }
    };

    Promise.all([
      fetchPageContent('terms', setTermsContent),
      fetchPageContent('privacy-policy', setPrivacyContent),
      fetchPageContent('disclosure', setDisclosureContent),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSave = async (slug: string, content: string) => {
    if (!token) {
      toast.error('Authentication required to save content.');
      return;
    }
    console.log(`Attempting to save for slug: ${slug}`);
    console.log(`Content being sent:`, content);
    try {
      const response = await api.put(`/pages/${slug}`, { content }, token); // Use api.put

      if (response) { // api.put already handles response.ok and throws error for !ok
        toast.success(`${slug} content updated successfully!`);
      }
    } catch (error: any) {
      console.error(`Failed to save ${slug} content:`, error);
      toast.error(`Failed to save ${slug} content: ${error.message || 'Server error'}`);
    }
  };

  if (loading) {
    return <div className="p-4">Loading legal page content...</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Manage Legal Pages</h2>

      <div className="mb-6">
        <label htmlFor="termsContent" className="block text-lg font-medium text-gray-700 mb-2">Terms of Service</label>
        <textarea
          id="termsContent"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows={10}
          value={termsContent}
          onChange={(e) => setTermsContent(e.target.value)}
        ></textarea>
        <button
          onClick={() => handleSave('terms', termsContent)}
          className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Terms
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="privacyContent" className="block text-lg font-medium text-gray-700 mb-2">Privacy Policy</label>
        <textarea
          id="privacyContent"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows={10}
          value={privacyContent}
          onChange={(e) => setPrivacyContent(e.target.value)}
        ></textarea>
        <button
          onClick={() => handleSave('privacy-policy', privacyContent)}
          className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Privacy Policy
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="disclosureContent" className="block text-lg font-medium text-gray-700 mb-2">Disclosure</label>
        <textarea
          id="disclosureContent"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows={10}
          value={disclosureContent}
          onChange={(e) => setDisclosureContent(e.target.value)}
        ></textarea>
        <button
          onClick={() => handleSave('disclosure', disclosureContent)}
          className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Disclosure
        </button>
      </div>
    </div>
  );
};

export default LegalPagesSection;
