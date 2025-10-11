
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DisclosurePage = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pages/disclosure`, { cache: 'no-store' });
  const data = await response.json();

  return (
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Disclosure</h1>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
      <Footer />
    </div>
  );
};

export default DisclosurePage;
