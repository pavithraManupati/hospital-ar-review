import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import WorkItemProcessor from './WorkItemProcessor';
import DocumentUploadSection from './DocumentUploadSection';
import AISuggestionsPanel from './AISuggestionsPanel';
import UserTableView from './UserTableView';

const UserWorkArea = ({ 
  currentUserWorkOrder, 
  currentItem, 
  userViewMode,
  currentItemIndex,
  totalItems,
  handleSaveWorkItem,
  handleCompleteItem,
  setCurrentItemIndex,
  setAiSuggestions,
  aiSuggestions,
  uploadedDocuments,
  documentAnalysis,
  handleDocumentUpload,
  setUserViewMode,
  AIService
}) => {
  
  if (!currentUserWorkOrder || !currentItem) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Order Loaded</h3>
        <p className="text-gray-600">Load a work order to start processing accounts</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Work Order Processing</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setUserViewMode('card')}
            className={`px-3 py-1 rounded text-sm ${
              userViewMode === 'card' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setUserViewMode('table')}
            className={`px-3 py-1 rounded text-sm ${
              userViewMode === 'table' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {userViewMode === 'card' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <WorkItemProcessor
              item={currentItem}
              itemIndex={currentItemIndex}
              totalItems={currentUserWorkOrder.data.length}
              onSave={handleSaveWorkItem}
              onComplete={handleCompleteItem}
              onNext={() => {
                if (currentItemIndex < currentUserWorkOrder.data.length - 1) {
                  setCurrentItemIndex(currentItemIndex + 1);
                  const nextItem = currentUserWorkOrder.data[currentItemIndex + 1];
                  setAiSuggestions(AIService.getRecommendations(nextItem));
                }
              }}
              onPrevious={() => {
                if (currentItemIndex > 0) {
                  setCurrentItemIndex(currentItemIndex - 1);
                  const prevItem = currentUserWorkOrder.data[currentItemIndex - 1];
                  setAiSuggestions(AIService.getRecommendations(prevItem));
                }
              }}
            />
          </div>

          <div className="space-y-6">
            <DocumentUploadSection
              onDocumentUpload={handleDocumentUpload}
              uploadedDocs={Object.values(uploadedDocuments).filter(doc => doc.accountId === currentItem.id)}
              documentAnalysis={documentAnalysis}
            />
            
            <AISuggestionsPanel
              suggestions={aiSuggestions}
              accountInfo={currentItem}
            />
          </div>
        </div>
      ) : (
        <UserTableView
          workOrder={currentUserWorkOrder}
          onSave={handleSaveWorkItem}
          onItemSelect={setCurrentItemIndex}
          currentItemIndex={currentItemIndex}
        />
      )}
    </>
  );
};

export default UserWorkArea;
