import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle, faStore, faSmile } from '@fortawesome/free-solid-svg-icons';

export default function WorkflowSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-center items-center gap-0">
        {/* Step 1: Lets Compare */}
        <div className="relative flex-1 p-6 bg-gray-100 rounded-l-lg text-center md:text-left divider-slant">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
              {/* Replaced SVG with FontAwesomeIcon for comparison icon (using faCheckCircle as a placeholder) */}
              <FontAwesomeIcon icon={faCheckCircle} className="w-full h-full text-gray-600" />
            </div>
            {/* Text */}
            <div>
              <h4 className="text-xl font-bold text-gray-800">Lets Compare</h4>
              <p className="text-sm text-gray-600">Choose your product with price comparisons.</p>
            </div>
          </div>
        </div>

        {/* Step 2: Take Review */}
        <div className="relative flex-1 p-6 bg-gray-100 text-center md:text-left divider-slant">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
              <FontAwesomeIcon icon={faStar} className="w-full h-full text-red-500" />
            </div>
            {/* Text */}
            <div>
              <h4 className="text-xl font-bold text-gray-800">Take Review</h4>
              <p className="text-sm text-gray-600">Check your selected product review</p>
            </div>
          </div>
        </div>

        {/* Step 3: Multi-Vendor */}
        <div className="relative flex-1 p-6 bg-gray-100 text-center md:text-left divider-slant">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
              <FontAwesomeIcon icon={faStore} className="w-full h-full text-blue-600" />
            </div>
            {/* Text */}
            <div>
              <h4 className="text-xl font-bold text-gray-800">Multi-Vendor</h4>
              <p className="text-sm text-gray-600">Check your product from vendor store.</p>
            </div>
          </div>
        </div>

        {/* Step 4: Enjoy Result */}
        <div className="relative flex-1 p-6 bg-red-500 rounded-r-lg text-center md:text-left text-white last-child">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
              <FontAwesomeIcon icon={faSmile} className="w-full h-full text-white" />
            </div>
            {/* Text */}
            <div>
              <h4 className="text-xl font-bold">Enjoy Result</h4>
              <p className="text-sm">Enjoy your happy product</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}