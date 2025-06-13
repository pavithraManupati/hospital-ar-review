import React from 'react';
import UserSidebar from './UserSidebar';
import UserWorkArea from './UserWorkArea';

const UserDashboard = ({
  currentUser,
  currentUserWorkOrder,
  currentItemIndex,
  handleUserWorkOrderUpload,
  handleExportWorkOrder,
  currentItem,
  userViewMode,
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
  return (
    <div className="flex">
      {/* Sidebar - User Dashboard */}
      <UserSidebar 
        currentUser={currentUser}
        currentUserWorkOrder={currentUserWorkOrder}
        currentItemIndex={currentItemIndex}
        onUserWorkOrderUpload={handleUserWorkOrderUpload}
        onExportWorkOrder={handleExportWorkOrder}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <UserWorkArea 
          currentUserWorkOrder={currentUserWorkOrder}
          currentItem={currentItem}
          userViewMode={userViewMode}
          currentItemIndex={currentItemIndex}
          totalItems={currentUserWorkOrder?.data?.length || 0}
          handleSaveWorkItem={handleSaveWorkItem}
          handleCompleteItem={handleCompleteItem}
          setCurrentItemIndex={setCurrentItemIndex}
          setAiSuggestions={setAiSuggestions}
          aiSuggestions={aiSuggestions}
          uploadedDocuments={uploadedDocuments}
          documentAnalysis={documentAnalysis}
          handleDocumentUpload={handleDocumentUpload}
          setUserViewMode={setUserViewMode}
          AIService={AIService}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
