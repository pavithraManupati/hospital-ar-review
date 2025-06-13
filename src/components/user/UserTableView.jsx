import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const UserTableView = ({ workOrder, onSave, onItemSelect, currentItemIndex }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (itemIndex) => {
    setEditingItem(itemIndex);
    setEditData({
      userComments: workOrder.data[itemIndex].userComments || '',
      actionsTaken: workOrder.data[itemIndex].actionsTaken || '',
      timeSpent: workOrder.data[itemIndex].timeSpent || 0
    });
  };

  const handleSave = () => {
    onSave(editData);
    setEditingItem(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditData({});
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workOrder.data.map((item, index) => (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 cursor-pointer ${index === currentItemIndex ? 'bg-blue-50' : ''}`}
                onClick={() => onItemSelect(index)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.accountNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.insuranceType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${item.balance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.daysOutstanding}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  {editingItem === index ? (
                    <textarea
                      value={editData.userComments}
                      onChange={(e) => setEditData(prev => ({ ...prev, userComments: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      rows={2}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="truncate" title={item.userComments}>
                      {item.userComments || 'No comments'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingItem === index ? (
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={handleSave} className="text-green-600 hover:text-green-900">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-red-600 hover:text-red-900">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSave({ status: 'Completed', completedAt: new Date().toISOString() });
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total: {workOrder.data.length} items | 
            Completed: {workOrder.data.filter(item => item.status === 'Completed').length} | 
            Remaining: {workOrder.data.filter(item => item.status !== 'Completed').length}
          </div>
          <div className="text-sm font-medium text-gray-900">
            Total Value: ${workOrder.data.reduce((sum, item) => sum + item.balance, 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTableView;
