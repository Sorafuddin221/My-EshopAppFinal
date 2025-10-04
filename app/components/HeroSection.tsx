"use client";

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function HeroSection() {
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroMainText, setHeroMainText] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('');
  const [heroButtonUrl, setHeroButtonUrl] = useState('');
  const [heroTextColor, setHeroTextColor] = useState('');
  const [heroOverlayColor, setHeroOverlayColor] = useState('');
  const [heroButtonBgColor, setHeroButtonBgColor] = useState('');
  const [heroButtonTextColor, setHeroButtonTextColor] = useState('');
  const [heroHeadingFontSize, setHeroHeadingFontSize] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/settings');
        setHeroImageUrl(settings.heroImageUrl || 'https://placehold.co/1500x500?text=Hero+Image');
        setHeroMainText(settings.heroMainText || 'Your Awesome Hero Title');
        setHeroButtonText(settings.heroButtonText || 'Shop Now');
        setHeroButtonUrl(settings.heroButtonUrl || '/products');
        setHeroTextColor(settings.heroTextColor || '#ffffff');
        setHeroOverlayColor(settings.heroOverlayColor || 'rgba(0,0,0,0.5)');
        setHeroButtonBgColor(settings.heroButtonBgColor || '#3b82f6');
        setHeroButtonTextColor(settings.heroButtonTextColor || '#ffffff');
        setHeroHeadingFontSize(settings.heroHeadingFontSize || '5xl');
      } catch (err) {
        console.error('Error fetching hero section settings:', err);
        // Fallback to default values if fetching fails
        setHeroImageUrl('https://via.placeholder.com/1500x500?text=Hero+Image');
        setHeroMainText('Your Awesome Hero Title');
        setHeroButtonText('Shop Now');
        setHeroButtonUrl('/products');
        setHeroTextColor('#ffffff');
        setHeroOverlayColor('rgba(0,0,0,0.5)');
        setHeroButtonBgColor('#3b82f6');
        setHeroButtonTextColor('#ffffff');
        setHeroHeadingFontSize('5xl');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return null; // Or a loading spinner/placeholder
  }

  const headingClasses = `text-3xl sm:text-4xl lg:text-${heroHeadingFontSize} font-bold tracking-tight`;

  return (
    <main
      className="hero-section relative flex items-center justify-between overflow-hidden"
      style={{
        backgroundImage: `url(${heroImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: heroTextColor, // Apply text color
      }}
    >
      <div className="container mx-auto mt-20 py-20 px-4 flex justify-between items-center">
        {/* Left content */}
        <div className="z-10 max-w-md">
          <h2 className={headingClasses}>{heroMainText.split(' ')[0]}</h2>
          <h1 className={`${headingClasses} mt-2`}>{heroMainText.split(' ').slice(1).join(' ')}</h1>
          <div className="h-1 w-24 bg-white my-6" style={{ backgroundColor: heroTextColor }}></div> {/* Use text color for line */}
          <p className="text-xl mt-4">Multivendor Store</p>
          <a
            href={heroButtonUrl}
            className="mt-8 inline-block font-bold py-3 px-6 rounded-md hover:opacity-80 transition duration-300"
            style={{ backgroundColor: heroButtonBgColor, color: heroButtonTextColor }} // Apply button colors
          >
            {heroButtonText}
          </a>
        </div>
        {/* Right Image - Removed as heroImageUrl is for background */}
        {/* <div className="z-10 mt-10 md:mt-0 flex-shrink-0">
          <img src="https://via.placeholder.com/600x400?text=Tablet+Image" alt="Surface Tablet" className="max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg" />
        </div> */}
      </div>
      {/* Background Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: heroOverlayColor }}></div>
    </main>
  );
}