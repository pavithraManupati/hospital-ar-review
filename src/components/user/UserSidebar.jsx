import React from 'react';
import { Upload, Download } from 'lucide-react';

const UserSidebar = ({ currentUser, currentUserWorkOrder, currentItemIndex, onUserWorkOrderUpload, onExportWorkOrder }) => {
  
  const handleSampleWorkOrder = () => {
    const sampleWorkOrder = {
      fileName: `Sample_WorkOrder_${currentUser}.json`,
      generatedAt: new Date().toISOString(),
      data: [
        {
          'Account Number': 'A001234',
          'Patient Name': 'John Smith',
          'Date of Service': '2024-03-15',
          'Insurance Type': 'Medicare',
          'Balance': 1250.00,
          'Days Outstanding': 45,
          'Denial Code': 'CO-50',
          'Priority': 'High'
        },
        {
          'Account Number': 'A001235',
          'Patient Name': 'Mary Johnson',
          'Date of Service': '2024-02-20',
          'Insurance Type': 'Medicaid',
          'Balance': 890.00,
          'Days Outstanding': 78,
          'Denial Code': 'PR-1',
          'Priority': 'Medium'
        }
      ]
    };

    const blob = new Blob([JSON.stringify(sampleWorkOrder)], { type: 'application/json' });
    const file = new File([blob], sampleWorkOrder.fileName, { type: 'application/json' });
    const mockEvent = { target: { files: [file] } };
    onUserWorkOrderUpload(mockEvent);
  };
  
  return (
    <div className="w-80 bg-white shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Dashboard - {currentUser.toUpperCase()}</h3>
        
        {!currentUserWorkOrder ? (
          <div className="space-y-4">
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Upload your work order file</p>
              <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json,.xlsx,.xls,.csv"
                  onChange={onUserWorkOrderUpload}
                  className="hidden"
                />
                <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </span>
              </label>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">For Testing (Demo Data):</p>
              <button
                onClick={handleSampleWorkOrder}
                className="w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Load Sample Work Order
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Current Work Order</h4>
              <p className="text-sm text-blue-600 mb-1">
                <strong>File:</strong> {currentUserWorkOrder.fileName}
              </p>
              <p className="text-sm text-blue-600 mb-1">
                <strong>Progress:</strong> Item {currentItemIndex + 1} of {currentUserWorkOrder.data.length}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-2">Summary</h4>
              <p className="text-sm text-green-600 mb-1">
                <strong>Total Accounts:</strong> {currentUserWorkOrder.data.length}
              </p>
              <p className="text-sm text-green-600 mb-1">
                <strong>Total Billed:</strong> ${currentUserWorkOrder.data.reduce((sum, item) => sum + item.balance, 0).toFixed(2)}
              </p>
              <p className="text-sm text-green-600">
                <strong>Completed:</strong> {currentUserWorkOrder.data.filter(item => item.status === 'Completed').length}
              </p>
            </div>

            <button
              onClick={onExportWorkOrder}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Completed Work
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;
