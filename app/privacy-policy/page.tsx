
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage = async () => {
  let data = { content: '<p>Failed to load privacy policy. Please try again later.</p>' }; // Default error content
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pages/privacy-policy`, { cache: 'no-store' });

    if (!response.ok) {
      // If the response is not OK, it might still be JSON, or it might be HTML.
      // Try to parse as text to avoid SyntaxError if it's HTML.
      const errorText = await response.text();
      console.error('API response not OK:', response.status, errorText);
      throw new Error(`Failed to fetch privacy policy: ${response.status} ${response.statusText}`);
    }

    data = await response.json();
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    // data will remain the default error content
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
