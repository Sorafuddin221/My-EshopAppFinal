import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faChartLine, faCartShopping, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function WidgetsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full p-4 mr-4"><FontAwesomeIcon icon={faDollarSign} className="text-3xl" /></div>
          <div>
            <h5 className="text-gray-500 mb-1">Total Sales</h5>
            <h3 className="text-2xl font-bold text-gray-800">$2,345</h3>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
          <div className="bg-green-500 text-white rounded-full p-4 mr-4"><FontAwesomeIcon icon={faChartLine} className="text-3xl" /></div>
          <div>
            <h5 className="text-gray-500 mb-1">Revenue</h5>
            <h3 className="text-2xl font-bold text-gray-800">$1,234</h3>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
          <div className="bg-yellow-500 text-white rounded-full p-4 mr-4"><FontAwesomeIcon icon={faCartShopping} className="text-3xl" /></div>
          <div>
            <h5 className="text-gray-500 mb-1">Orders</h5>
            <h3 className="text-2xl font-bold text-gray-800">128</h3>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
          <div className="bg-indigo-500 text-white rounded-full p-4 mr-4"><FontAwesomeIcon icon={faUsers} className="text-3xl" /></div>
          <div>
            <h5 className="text-gray-500 mb-1">New Users</h5>
            <h3 className="text-2xl font-bold text-gray-800">54</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
