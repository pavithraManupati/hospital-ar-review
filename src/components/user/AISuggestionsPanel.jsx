import React from 'react';
import { Brain } from 'lucide-react';

const AISuggestionsPanel = ({ suggestions, accountInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          AI Recommendations
        </h3>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">{suggestion}</p>
            </div>
          ))}
        </div>

        {accountInfo && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">
              {accountInfo.insuranceType} - {accountInfo.denialCode}
            </p>
            <p className="text-xs text-yellow-700">
              Priority: {accountInfo.priority} | Days: {accountInfo.daysOutstanding}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
