
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

import { Product } from '@/app/types/Product';

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-105 ring-1 ring-transparent hover:ring-blue-500 ring-offset-2 ring-offset-white transition-all ease-in-out">
            <Link href={`/single-product/${product._id}`}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover mb-4" />

                <div className="flex items-center text-orange-500 text-sm mb-2">
                    {[...Array(5)].map((_, i) => {
                        const ratingValue = i + 1;
                        return (
                            <FontAwesomeIcon
                                key={i}
                                icon={ratingValue <= product.rating ? faStar : (ratingValue - 0.5 === product.rating ? faStarHalfAlt : farStar)}
                            />
                        );
                    })}
                    <span className="text-gray-500 ml-2 text-xs">{product.rating.toFixed(1)}</span>
                    <span className="ml-auto text-gray-500 text-xs">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />{product.views}
                    </span>
                </div>

                <h4 className="font-semibold text-lg text-gray-800 mb-1">{product.name}</h4>
                <p className="text-gray-500 text-sm mb-2">{product.category.name}</p>
                <p className="text-gray-400 text-xs mb-2">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
                <p className="text-red-500 font-bold text-sm mb-4">
                    ${product.price}
                </p>
            </Link>
        </div>
    );
};

export default ProductCard;
