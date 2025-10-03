import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faStar, faStarHalfAlt, faEye, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar, faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import ProductCard from './ProductCard'; // Import ProductCard

interface ProductSectionProps {
  title: string;
  themeColor: 'orange' | 'red';
  products: any[]; // Add products prop
}

export default function ProductSection({ title, themeColor, products }: ProductSectionProps) {

  return (
    <section className="container mx-auto px-4 py-10 bg-gray-100">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-5">
        <div className="relative">
          <h2 className="text-3xl mb-2 font-bold text-gray-800">
            <span className={`text-${themeColor}-500`}>{title}</span> Top Deals
          </h2>
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-${themeColor}-500 rounded-full`}></div>
        </div>
        {/* Navigation Arrows */}
        <div className="flex space-x-4 text-gray-500">
          <button className={`bg-white p-2 rounded-full shadow-md hover:bg-${themeColor}-500 hover:text-white transition-colors duration-300`}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className={`bg-white p-2 rounded-full shadow-md hover:bg-${themeColor}-500 hover:text-white transition-colors duration-300`}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No products available for this brand yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
 