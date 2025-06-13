import React from 'react';
import UploadSection from './UploadSection';
import ProductivityDashboard from './ProductivityDashboard'; 
import WorkOrderList from './WorkOrderList';
import CompletedWorkAnalytics from './CompletedWorkAnalytics';
import WorkItemReview from './WorkItemReview';

const AdminDashboard = ({
  handleMasterUpload,
  masterWorkOrder,
  productivity,
  userWorkOrders,
  completedWorkOrders,
  handleDownloadWorkOrder,
  handleCompletedWorkOrderUpload,
  handleApproveWorkItem,
  handleRequestWorkItemRework
}) => {
  // Check if there are any completed work orders to show analytics and review
  const hasCompletedWorkOrders = Object.keys(completedWorkOrders).length > 0;
  
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>

        {/* Upload Section */}
        <UploadSection 
          onMasterUpload={handleMasterUpload}
          masterWorkOrder={masterWorkOrder}
        />

        {/* Productivity Dashboard */}
        <ProductivityDashboard productivity={productivity} />

        {/* User Work Orders with Download */}
        {Object.keys(userWorkOrders).length > 0 && (
          <WorkOrderList 
            userWorkOrders={userWorkOrders}
            completedWorkOrders={completedWorkOrders}
            onDownload={handleDownloadWorkOrder}
            onUploadCompleted={handleCompletedWorkOrderUpload}
          />
        )}

        {/* Completed Work Order Analytics and Review */}
        {hasCompletedWorkOrders && (
          <>
            <CompletedWorkAnalytics completedWorkOrders={completedWorkOrders} />
            <WorkItemReview 
              completedWorkOrders={completedWorkOrders}
              onApproveItem={handleApproveWorkItem}
              onRequestRework={handleRequestWorkItemRework}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
