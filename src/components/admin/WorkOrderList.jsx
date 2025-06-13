import React from 'react';
import { Download, Upload, CheckCircle } from 'lucide-react';

const WorkOrderList = ({ userWorkOrders, completedWorkOrders, onDownload, onUploadCompleted }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Generated Work Orders</h3>
        <p className="text-sm text-gray-600 mt-1">Download individual work orders to distribute to users</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(userWorkOrders).map(([userId, workOrder]) => {
            const isCompleted = completedWorkOrders[userId];
            const completionRate = (workOrder.data.filter(item => item.status === 'Completed').length / workOrder.data.length) * 100;
            
            return (
              <div key={userId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-lg">{userId.toUpperCase()}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {workOrder.data.filter(item => item.status === 'Completed').length}/{workOrder.data.length}
                    </span>
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Uploaded
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Items:</strong> {workOrder.data.length} accounts
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Total Value:</strong> ${workOrder.data.reduce((sum, item) => sum + item.balance, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Generated:</strong> {new Date(workOrder.assignedAt).toLocaleDateString()}
                  </p>
                  {isCompleted && (
                    <p className="text-sm text-green-600">
                      <strong>Completed:</strong> {new Date(isCompleted.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        completionRate === 100 ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(completionRate)}% Complete
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => onDownload(userId, workOrder)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Work Order
                  </button>

                  {!isCompleted ? (
                    <div>
                      <label className="cursor-pointer w-full">
                        <input
                          type="file"
                          accept=".json,.xlsx,.xls,.csv"
                          onChange={(e) => onUploadCompleted(userId, e)}
                          className="hidden"
                        />
                        <span className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center text-sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Completed
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-500 px-4 py-2 rounded-md flex items-center justify-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed Work Received
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderList;
