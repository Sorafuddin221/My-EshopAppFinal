'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

export default function ChartsAndTablesSection() {
  const salesChartRef = useRef<HTMLCanvasElement>(null);
  const revenueChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Sales Chart
    if (salesChartRef.current) {
      const salesCtx = salesChartRef.current.getContext('2d');
      if (salesCtx) {
        new Chart(salesCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
              label: 'Sales ($)',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: 'rgba(13, 110, 253, 0.2)',
              borderColor: 'var(--primary-color)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      }
    }

    // Revenue Chart
    if (revenueChartRef.current) {
      const revenueCtx = revenueChartRef.current.getContext('2d');
      if (revenueCtx) {
        new Chart(revenueCtx, {
          type: 'pie',
          data: {
            labels: ['Electronics', 'Home Goods', 'Apparel', 'Books'],
            datasets: [{
              label: 'Revenue',
              data: [300, 50, 100, 40],
              backgroundColor: [
                'rgba(13, 110, 253, 0.8)',
                'rgba(25, 135, 84, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(23, 162, 184, 0.8)'
              ],
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
          }
        });
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Sales Overview</h5>
        <canvas id="salesChart" ref={salesChartRef}></canvas>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Revenue by Category</h5>
        <canvas id="revenueChart" ref={revenueChartRef}></canvas>
      </div>
      <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Laptop Pro</td>
                <td className="py-3 px-4">John Doe</td>
                <td className="py-3 px-4">2023-08-01</td>
                <td className="py-3 px-4">$1,200</td>
                <td className="py-3 px-4"><span className="bg-green-200 text-green-800 rounded-full px-3 py-1 text-sm">Completed</span></td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">Wireless Mouse</td>
                <td className="py-3 px-4">Jane Smith</td>
                <td className="py-3 px-4">2023-07-31</td>
                <td className="py-3 px-4">$45</td>
                <td className="py-3 px-4"><span className="bg-yellow-200 text-yellow-800 rounded-full px-3 py-1 text-sm">Pending</span></td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">3</td>
                <td className="py-3 px-4">Mechanical Keyboard</td>
                <td className="py-3 px-4">Peter Jones</td>
                <td className="py-3 px-4">2023-07-30</td>
                <td className="py-3 px-4">$150</td>
                <td className="py-3 px-4"><span className="bg-red-200 text-red-800 rounded-full px-3 py-1 text-sm">Cancelled</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">4</td>
                <td className="py-3 px-4">Gaming Monitor</td>
                <td className="py-3 px-4">Sarah Lee</td>
                <td className="py-3 px-4">2023-07-29</td>
                <td className="py-3 px-4">$450</td>
                <td className="py-3 px-4"><span className="bg-green-200 text-green-800 rounded-full px-3 py-1 text-sm">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
