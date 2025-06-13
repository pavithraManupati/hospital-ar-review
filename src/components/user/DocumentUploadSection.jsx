import React, { useState } from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';

const DocumentUploadSection = ({ onDocumentUpload, uploadedDocs, documentAnalysis }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleFileUpload = (docType, event) => {
    const file = event.target.files[0];
    if (file) {
      onDocumentUpload(docType, file);
      setShowUpload(false);
    }
  };

  const documentTypes = [
    { id: 'EOB', label: 'EOB (Explanation of Benefits)' },
    { id: 'UB04', label: 'UB-04 Form' },
    { id: 'PatientInfo', label: 'Patient Information' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Documents</h3>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Upload
          </button>
        </div>
      </div>

      <div className="p-6">
        {showUpload && (
          <div className="mb-4 space-y-2">
            {documentTypes.map(docType => (
              <div key={docType.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <span className="text-sm">{docType.label}</span>
                <label className="cursor-pointer text-blue-600 text-sm hover:text-blue-700">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => handleFileUpload(docType.id, e)}
                    className="hidden"
                  />
                  Choose File
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {uploadedDocs.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm">{doc.fileName}</span>
              </div>
              {documentAnalysis[doc.id] && (
                <span className="text-xs text-green-600">Analyzed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
