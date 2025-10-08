'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface Category {
    _id: string;
    name: string;
}

interface ArchiveHeaderProps {
    title: string;
    category?: string;
    categories: Category[];
    onSearch: (searchQuery: string, category: string) => void;
    onCategoryChange: (category: string) => void; // New prop
    subheadingText?: string;
}

const ArchiveHeader = ({ title, category, categories, onSearch, onCategoryChange, subheadingText }: ArchiveHeaderProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery, category || '');
    };

    return (
        <section className="hero-section text-light relative py-20 overflow-hidden" style={{ backgroundColor: 'rgb(239 68 68 / var(--tw-bg-opacity, 1))' }}>
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
                {subheadingText && <p className="text-lg sm:text-xl text-gray-200 mb-8">{subheadingText}</p>}
                
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-1">
                        <select 
                            className="w-full h-12 rounded-md border-0 bg-gray-800 text-white shadow-sm pr-10 focus:ring-2 focus:ring-orange-500"
                            value={category}
                            onChange={(e) => onCategoryChange(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {Array.isArray(categories) && categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full h-12 rounded-md border-0 bg-gray-800 text-white shadow-sm pl-4 pr-10 focus:ring-2 focus:ring-orange-500"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                onSearch(e.target.value, category || '');
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArchiveHeader;