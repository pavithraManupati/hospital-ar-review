import React from 'react';
import { Users, BarChart3, Check, FileSpreadsheet } from 'lucide-react';

const ProductivityDashboard = ({ productivity }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold">{productivity.totalUsers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Items Processed</p>
            <p className="text-2xl font-semibold">{productivity.totalItemsProcessed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Check className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-semibold">{productivity.completedItems}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FileSpreadsheet className="h-8 w-8 text-orange-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Time/Item</p>
            <p className="text-2xl font-semibold">{productivity.avgTimePerItem.toFixed(1)}m</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityDashboard;
