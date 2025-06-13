// Mock Excel data processor
const ExcelProcessor = {
  parseWorkOrder: (fileContent) => {
    return [
      {
        id: 1,
        accountNumber: 'A001234',
        patientName: 'John Smith',
        dateOfService: '2024-03-15',
        insuranceType: 'Medicare',
        balance: 1250.00,
        daysOutstanding: 45,
        denialCode: 'CO-50',
        priority: 'High',
        userComments: '',
        actionsTaken: '',
        status: 'Pending',
        timeSpent: 0,
        documentsUploaded: '',
        aiRecommendations: ''
      },
      {
        id: 2,
        accountNumber: 'A001235',
        patientName: 'Mary Johnson',
        dateOfService: '2024-02-20',
        insuranceType: 'Medicaid',
        balance: 890.00,
        daysOutstanding: 78,
        denialCode: 'PR-1',
        priority: 'Medium',
        userComments: '',
        actionsTaken: '',
        status: 'Pending',
        timeSpent: 0,
        documentsUploaded: '',
        aiRecommendations: ''
      },
      {
        id: 3,
        accountNumber: 'A001236',
        patientName: 'Robert Wilson',
        dateOfService: '2024-01-10',
        insuranceType: 'Blue Cross',
        balance: 2100.00,
        daysOutstanding: 125,
        denialCode: 'CO-16',
        priority: 'High',
        userComments: '',
        actionsTaken: '',
        status: 'Pending',
        timeSpent: 0,
        documentsUploaded: '',
        aiRecommendations: ''
      }
    ];
  },

  generateUserWorkOrder: (data, userId) => {
    return {
      fileName: `WorkOrder_${userId}_${Date.now()}.xlsx`,
      data: data,
      assignedAt: new Date().toISOString()
    };
  },

  updateWorkItem: (workOrder, itemIndex, updates) => {
    const updatedData = [...workOrder.data];
    updatedData[itemIndex] = { ...updatedData[itemIndex], ...updates };
    return { ...workOrder, data: updatedData };
  },

  exportCompleted: (workOrder) => {
    return {
      fileName: workOrder.fileName.replace('.xlsx', '_completed.xlsx'),
      completedAt: new Date().toISOString(),
      totalItems: workOrder.data.length,
      completedItems: workOrder.data.filter(item => item.status === 'Completed').length
    };
  }
};

export default ExcelProcessor;
