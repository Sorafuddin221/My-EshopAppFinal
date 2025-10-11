
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../../utils/api'; // Import the api utility

const TermsPage = async () => {
  let data = { content: '<p>Failed to load terms of service. Please try again later.</p>' }; // Default error content
  try {
    data = await api.get('/pages/terms'); // Use the api utility
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    // data will remain the default error content
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
