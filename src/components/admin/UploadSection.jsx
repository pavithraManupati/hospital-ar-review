import React from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

const UploadSection = ({ onMasterUpload, masterWorkOrder }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Upload Master Work Order</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={onMasterUpload}
            className="hidden"
          />
          <span className="text-blue-600 hover:text-blue-700">Click to upload Excel file</span>
        </label>
      </div>

      {masterWorkOrder && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400">
          <div className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 text-green-400 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Upload Successful</h4>
              <p className="text-sm text-green-700">
                {masterWorkOrder.fileName} - {masterWorkOrder.totalItems} items processed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
