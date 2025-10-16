import React from 'react';

interface ProductHeadingSectionProps {
  title: string;
  subheading: string;
}

const ProductHeadingSection: React.FC<ProductHeadingSectionProps> = ({ title, subheading }) => {
  return (
    <section className="bg-gray-100 pt-16 pb-1">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-center text-gray-600 mb-8">
          {title.split(' ').map((word, index) => (
            <span key={index} className={index === 1 ? 'text-black' : 'text-red-600'}>
              {word}{index < title.split(' ').length - 1 && ' '}
            </span>
          ))}
        </h2>
        <p className="text-center text-gray-600 mb-12">{subheading}</p>
      </div>
    </section>
  );
};

export default ProductHeadingSection;
