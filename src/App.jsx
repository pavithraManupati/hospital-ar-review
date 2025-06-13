import { useState, useCallback, useEffect } from 'react';
import Header from './components/common/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import TailwindTest from './components/common/TailwindTest';
import ExcelProcessor from './services/ExcelProcessor';
import AIService from './services/AIService';
import './App.css';

function App() {
  // Core state
  const [mode, setMode] = useState('admin');
  const [currentUser, setCurrentUser] = useState('user1');
  
  // Admin state
  const [masterWorkOrder, setMasterWorkOrder] = useState(null);
  const [userWorkOrders, setUserWorkOrders] = useState({});
  const [completedWorkOrders, setCompletedWorkOrders] = useState({});
  const [productivity, setProductivity] = useState({
    totalUsers: 3,
    totalItemsProcessed: 0,
    completedItems: 0,
    avgTimePerItem: 0
  });
  
  // User state
  const [currentUserWorkOrder, setCurrentUserWorkOrder] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [documentAnalysis, setDocumentAnalysis] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [userViewMode, setUserViewMode] = useState('card');

  // Load work order when user changes
  useEffect(() => {
    if (userWorkOrders[currentUser]) {
      setCurrentUserWorkOrder(userWorkOrders[currentUser]);
      setCurrentItemIndex(0);
      if (userWorkOrders[currentUser].data.length > 0) {
        setAiSuggestions(AIService.getRecommendations(userWorkOrders[currentUser].data[0]));
      }
    } else {
      setCurrentUserWorkOrder(null);
    }
  }, [currentUser, userWorkOrders]);

  // Admin: Upload master Excel file
  const handleMasterUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const workOrderData = ExcelProcessor.parseWorkOrder(file);
    setMasterWorkOrder({
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      totalItems: workOrderData.length,
      data: workOrderData
    });

    const users = ['user1', 'user2', 'user3'];
    const newUserWorkOrders = {};
    
    users.forEach((userId, index) => {
      const userItems = workOrderData.filter((_, itemIndex) => itemIndex % users.length === index);
      newUserWorkOrders[userId] = ExcelProcessor.generateUserWorkOrder(userItems, userId);
    });

    setUserWorkOrders(newUserWorkOrders);
    updateProductivity(newUserWorkOrders);
  }, []);

  // Download individual user work order
  const handleDownloadWorkOrder = useCallback((userId, workOrder) => {
    const excelData = {
      fileName: workOrder.fileName,
      assignedTo: userId,
      generatedAt: workOrder.assignedAt,
      data: workOrder.data.map(item => ({
        'Account Number': item.accountNumber,
        'Patient Name': item.patientName,
        'Date of Service': item.dateOfService,
        'Insurance Type': item.insuranceType,
        'Balance': item.balance,
        'Days Outstanding': item.daysOutstanding,
        'Denial Code': item.denialCode,
        'Priority': item.priority,
        'User Comments': '',
        'Actions Taken': '',
        'Status': 'Pending',
        'Last Updated': '',
        'Time Spent (mins)': 0,
        'Documents Uploaded': '',
        'AI Recommendations': ''
      }))
    };

    const blob = new Blob([JSON.stringify(excelData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = workOrder.fileName.replace('.xlsx', '.json');
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // User: Upload work order file
  const handleUserWorkOrderUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let workOrderData;
        
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          workOrderData = JSON.parse(e.target.result);
        } else {
          workOrderData = {
            fileName: file.name,
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
              }
            ]
          };
        }
        
        const userWorkOrder = {
          fileName: workOrderData.fileName || file.name,
          assignedAt: workOrderData.generatedAt || new Date().toISOString(),
          uploadedAt: new Date().toISOString(),
          data: workOrderData.data.map((item, index) => ({
            id: index + 1,
            accountNumber: item['Account Number'] || item.accountNumber || `A00${index + 1}`,
            patientName: item['Patient Name'] || item.patientName || `Patient ${index + 1}`,
            dateOfService: item['Date of Service'] || item.dateOfService || '2024-01-01',
            insuranceType: item['Insurance Type'] || item.insuranceType || 'Medicare',
            balance: parseFloat(item['Balance'] || item.balance) || 1000,
            daysOutstanding: parseInt(item['Days Outstanding'] || item.daysOutstanding) || 30,
            denialCode: item['Denial Code'] || item.denialCode || 'CO-50',
            priority: item['Priority'] || item.priority || 'Medium',
            userComments: item['User Comments'] || item.userComments || '',
            actionsTaken: item['Actions Taken'] || item.actionsTaken || '',
            status: item['Status'] || item.status || 'Pending',
            lastUpdated: item['Last Updated'] || item.lastUpdated || '',
            timeSpent: parseInt(item['Time Spent (mins)'] || item.timeSpent) || 0,
            documentsUploaded: item['Documents Uploaded'] || item.documentsUploaded || '',
            aiRecommendations: item['AI Recommendations'] || item.aiRecommendations || ''
          }))
        };

        setCurrentUserWorkOrder(userWorkOrder);
        setCurrentItemIndex(0);
        
        setUserWorkOrders(prev => ({
          ...prev,
          [currentUser]: userWorkOrder
        }));

        if (userWorkOrder.data.length > 0) {
          setAiSuggestions(AIService.getRecommendations(userWorkOrder.data[0]));
        }

      } catch (error) {
        console.error('Error parsing uploaded work order:', error);
        alert(`Error parsing work order file: ${error.message}`);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  }, [currentUser]);

  // Save work item updates
  const handleSaveWorkItem = useCallback((updates) => {
    if (!currentUserWorkOrder) return;

    const updatedWorkOrder = ExcelProcessor.updateWorkItem(
      currentUserWorkOrder,
      currentItemIndex,
      {
        ...updates,
        lastUpdated: new Date().toISOString(),
        status: updates.status || 'In Progress'
      }
    );

    setCurrentUserWorkOrder(updatedWorkOrder);
    setUserWorkOrders(prev => ({
      ...prev,
      [currentUser]: updatedWorkOrder
    }));

    updateProductivity({ ...userWorkOrders, [currentUser]: updatedWorkOrder });
  }, [currentUserWorkOrder, currentItemIndex, currentUser, userWorkOrders]);

  // Complete work item
  const handleCompleteItem = useCallback(() => {
    if (!currentUserWorkOrder) return;

    const updates = {
      status: 'Completed',
      completedAt: new Date().toISOString()
    };

    handleSaveWorkItem(updates);

    if (currentItemIndex < currentUserWorkOrder.data.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      const nextItem = currentUserWorkOrder.data[currentItemIndex + 1];
      setAiSuggestions(AIService.getRecommendations(nextItem));
    }
  }, [currentUserWorkOrder, currentItemIndex, handleSaveWorkItem]);

  // Document upload simulation
  const handleDocumentUpload = useCallback((docType, file) => {
    const documentId = `${currentUser}_${Date.now()}_${docType}`;
    const newDocument = {
      id: documentId,
      fileName: file.name,
      type: docType,
      uploadedAt: new Date().toISOString(),
      accountId: currentUserWorkOrder?.data[currentItemIndex]?.id
    };

    setUploadedDocuments(prev => ({
      ...prev,
      [documentId]: newDocument
    }));

    setTimeout(() => {
      const analysis = AIService.analyzeDocument(docType);
      setDocumentAnalysis(prev => ({
        ...prev,
        [documentId]: analysis
      }));
    }, 1000);

    return documentId;
  }, [currentUser, currentUserWorkOrder, currentItemIndex]);

  // Export completed work order
  const handleExportWorkOrder = useCallback(() => {
    if (!currentUserWorkOrder) return;

    const exportData = ExcelProcessor.exportCompleted(currentUserWorkOrder);
    
    const blob = new Blob([JSON.stringify(currentUserWorkOrder.data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData.fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentUserWorkOrder]);

  // Update productivity metrics
  const updateProductivity = useCallback((workOrders) => {
    const allItems = Object.values(workOrders).flatMap(wo => wo.data);
    const completedItems = allItems.filter(item => item.status === 'Completed');
    
    setProductivity({
      totalUsers: Object.keys(workOrders).length,
      totalItemsProcessed: allItems.length,
      completedItems: completedItems.length,
      avgTimePerItem: completedItems.length > 0 ? 
        completedItems.reduce((sum, item) => sum + (item.timeSpent || 0), 0) / completedItems.length : 0
    });
  }, []);

  // Admin: Upload completed work order from user
  const handleCompletedWorkOrderUpload = useCallback((userId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let completedData;
        
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          completedData = JSON.parse(e.target.result);
        } else {
          completedData = {
            fileName: file.name,
            completedAt: new Date().toISOString(),
            data: userWorkOrders[userId]?.data.map(item => ({
              ...item,
              status: 'Completed',
              userComments: 'Account reviewed and processed',
              actionsTaken: 'Contacted insurance, verified eligibility',
              timeSpent: Math.floor(Math.random() * 30) + 10,
              completedAt: new Date().toISOString(),
              reviewStatus: 'pending'
            })) || []
          };
        }

        setCompletedWorkOrders(prev => ({
          ...prev,
          [userId]: {
            ...completedData,
            uploadedAt: new Date().toISOString(),
            userId: userId
          }
        }));

        setUserWorkOrders(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            data: prev[userId].data.map(item => ({
              ...item,
              status: 'Completed',
              completedAt: new Date().toISOString(),
              reviewStatus: 'pending'
            }))
          }
        }));

        updateProductivity({
          ...userWorkOrders,
          [userId]: {
            ...userWorkOrders[userId],
            data: userWorkOrders[userId].data.map(item => ({ 
              ...item, 
              status: 'Completed',
              reviewStatus: 'pending'
            }))
          }
        });

      } catch (error) {
        console.error('Error parsing completed work order:', error);
        alert(`Error parsing completed work order: ${error.message}`);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  }, [userWorkOrders, updateProductivity]);
  
  // Admin: Approve a work item
  const handleApproveWorkItem = useCallback((userId, itemId) => {
    setCompletedWorkOrders(prev => {
      if (!prev[userId] || !prev[userId].data) return prev;
      
      const updatedData = prev[userId].data.map(item => {
        if (item.accountId === itemId || item.id === itemId) {
          return {
            ...item,
            reviewStatus: 'approved',
            reviewedAt: new Date().toISOString()
          };
        }
        return item;
      });
      
      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          data: updatedData
        }
      };
    });
    
    // Update the main work order data too
    setUserWorkOrders(prev => {
      if (!prev[userId] || !prev[userId].data) return prev;
      
      const updatedData = prev[userId].data.map(item => {
        if (item.accountId === itemId || item.id === itemId) {
          return {
            ...item,
            reviewStatus: 'approved',
            reviewedAt: new Date().toISOString()
          };
        }
        return item;
      });
      
      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          data: updatedData
        }
      };
    });
  }, []);
  
  // Admin: Request rework on a work item
  const handleRequestWorkItemRework = useCallback((userId, itemId) => {
    setCompletedWorkOrders(prev => {
      if (!prev[userId] || !prev[userId].data) return prev;
      
      const updatedData = prev[userId].data.map(item => {
        if (item.accountId === itemId || item.id === itemId) {
          return {
            ...item,
            reviewStatus: 'rework',
            needsRework: true,
            status: 'Needs Rework',
            reviewedAt: new Date().toISOString()
          };
        }
        return item;
      });
      
      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          data: updatedData
        }
      };
    });
    
    // Update the main work order data too
    setUserWorkOrders(prev => {
      if (!prev[userId] || !prev[userId].data) return prev;
      
      const updatedData = prev[userId].data.map(item => {
        if (item.accountId === itemId || item.id === itemId) {
          return {
            ...item,
            reviewStatus: 'rework',
            needsRework: true,
            status: 'Needs Rework',
            reviewedAt: new Date().toISOString()
          };
        }
        return item;
      });
      
      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          data: updatedData
        }
      };
    });
  }, []);

  const getCurrentItem = () => {
    return currentUserWorkOrder?.data[currentItemIndex];
  };

  const currentItem = getCurrentItem();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        mode={mode} 
        setMode={setMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* Main Content */}
      {mode === 'admin' ? (
        <AdminDashboard 
          handleMasterUpload={handleMasterUpload}
          masterWorkOrder={masterWorkOrder}
          productivity={productivity}
          userWorkOrders={userWorkOrders}
          completedWorkOrders={completedWorkOrders}
          handleDownloadWorkOrder={handleDownloadWorkOrder}
          handleCompletedWorkOrderUpload={handleCompletedWorkOrderUpload}
          handleApproveWorkItem={handleApproveWorkItem}
          handleRequestWorkItemRework={handleRequestWorkItemRework}
        />
      ) : (
        <UserDashboard 
          currentUser={currentUser}
          currentUserWorkOrder={currentUserWorkOrder}
          currentItemIndex={currentItemIndex}
          handleUserWorkOrderUpload={handleUserWorkOrderUpload}
          handleExportWorkOrder={handleExportWorkOrder}
          currentItem={currentItem}
          userViewMode={userViewMode}
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
      )}
    </div>
  )
}

export default App
