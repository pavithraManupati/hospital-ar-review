import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

const WorkItemProcessor = ({ item, itemIndex, totalItems, onSave, onComplete, onNext, onPrevious }) => {
  const [comments, setComments] = useState(item.userComments || '');
  const [actions, setActions] = useState(item.actionsTaken || '');
  const [timeSpent, setTimeSpent] = useState(item.timeSpent || 0);

  const handleSave = () => {
    onSave({
      userComments: comments,
      actionsTaken: actions,
      timeSpent: parseInt(timeSpent)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Account Details</h3>
          <div className="flex space-x-2">
            <button
              onClick={onPrevious}
              disabled={itemIndex === 0}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              disabled={itemIndex === totalItems - 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <p className="mt-1 text-sm text-gray-900">{item.accountNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <p className="mt-1 text-sm text-gray-900">{item.patientName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance</label>
            <p className="mt-1 text-sm text-gray-900">{item.insuranceType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Balance</label>
            <p className="mt-1 text-sm text-gray-900 font-semibold">${item.balance.toFixed(2)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Days Outstanding</label>
            <p className="mt-1 text-sm text-gray-900">{item.daysOutstanding}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Denial Code</label>
            <p className="mt-1 text-sm text-gray-900">{item.denialCode}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your comments here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions Taken</label>
            <textarea
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe actions taken..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Spent (minutes)</label>
            <input
              type="number"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
          <button
            onClick={onComplete}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <Check className="h-4 w-4 mr-2" />
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkItemProcessor;
