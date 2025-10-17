export default function FeatureSection() {
  return (
    <section className="container-fluid  mx-auto px-4 py-16 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Social Business Card */}
        <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl card-hover fade-in">
          <div className="w-24 h-24 mb-4 flex items-center justify-center icon-hover">
            {/* Inline SVG for Social Business icon */}
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C14.21 4 16 5.79 16 8C16 10.21 14.21 12 12 12C9.79 12 8 10.21 8 8C8 5.79 9.79 4 12 4ZM12 20C9.36 20 6.64 18.27 4.29 15.65C4.69 13.56 8.35 12 12 12C15.65 12 19.31 13.56 19.71 15.65C17.36 18.27 14.64 20 12 20Z" fill="#3B82F6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Social Business</h3>
          <div className="mt-4 h-1 w-24 bg-blue-500 rounded-full"></div>
        </div>

        {/* Price Comparison Card */}
        <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl card-hover fade-in">
          <div className="w-24 h-24 mb-4 flex items-center justify-center icon-hover">
            {/* Inline SVG for Price Comparison icon */}
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 14H11V12H9V10H11V8H13V10H15V12H13V14ZM11 16H13V18H11V16ZM11 6H13V8H11V6Z" fill="#FACC15" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Price Comparison</h3>
          <div className="mt-4 h-1 w-24 bg-yellow-400 rounded-full"></div>
        </div>

        {/* Multivendor Store Card */}
        <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl card-hover fade-in">
          <div className="w-24 h-24 mb-4 flex items-center justify-center icon-hover">
            {/* Inline SVG for Multivendor Store icon */}
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4V13H20V7ZM20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2ZM14 19H12V17H14V19ZM10 19H8V17H10V19ZM16 19H18V17H16V19Z" fill="#EF4444" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Multivendor Store</h3>
          <div className="mt-4 h-1 w-24 bg-red-500 rounded-full"></div>
        </div>

        {/* Product Review Card */}
        <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl card-hover fade-in">
          <div className="w-24 h-24 mb-4 flex items-center justify-center icon-hover">
            {/* Inline SVG for Product Review icon */}
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 18C9.33 18 4.67 16.33 4.67 14.67C4.67 13.88 5.46 13.2 6.33 13.33C7.52 13.51 9.33 14 12 14C14.67 14 16.48 13.51 17.67 13.33C18.54 13.2 19.33 13.88 19.33 14.67C19.33 16.33 14.67 18 12 18Z" fill="#3B82F6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Product Review</h3>
          <div className="mt-4 h-1 w-24 bg-blue-500 rounded-full"></div>
        </div>

      </div>
    </section>
  );
}
