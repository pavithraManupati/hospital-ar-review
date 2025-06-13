import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Search, RefreshCw, ArrowUpDown } from 'lucide-react';

const WorkItemReview = ({ completedWorkOrders, onApproveItem, onRequestRework }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, pending, approved, rework
  const [sortBy, setSortBy] = useState('date'); // date, user
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  
  // Compile all completed items from all users into a flat list
  const allCompletedItems = useMemo(() => {
    const items = [];
    
    Object.entries(completedWorkOrders).forEach(([userId, workOrder]) => {
      if (workOrder && workOrder.data) {
        workOrder.data.forEach(item => {
          items.push({
            ...item,
            userId,
            reviewStatus: item.reviewStatus || 'pending', // pending, approved, rework
            uploadedAt: workOrder.uploadedAt || new Date().toISOString(),
          });
        });
      }
    });
    
    return items;
  }, [completedWorkOrders]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return allCompletedItems
      .filter(item => {
        // Apply search term filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' || 
          (item.accountId && item.accountId.toLowerCase().includes(searchLower)) ||
          (item.patientName && item.patientName.toLowerCase().includes(searchLower)) ||
          (item.comment && item.comment.toLowerCase().includes(searchLower)) ||
          item.userId.toLowerCase().includes(searchLower);
        
        // Apply status filter
        const matchesFilter = 
          filterBy === 'all' || 
          (filterBy === 'pending' && item.reviewStatus === 'pending') ||
          (filterBy === 'approved' && item.reviewStatus === 'approved') ||
          (filterBy === 'rework' && item.reviewStatus === 'rework');
        
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === 'date') {
          return sortOrder === 'asc' 
            ? new Date(a.uploadedAt) - new Date(b.uploadedAt)
            : new Date(b.uploadedAt) - new Date(a.uploadedAt);
        } else if (sortBy === 'user') {
          return sortOrder === 'asc'
            ? a.userId.localeCompare(b.userId)
            : b.userId.localeCompare(a.userId);
        }
        return 0;
      });
  }, [allCompletedItems, searchTerm, filterBy, sortBy, sortOrder]);

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // If no completed work orders, show a message
  if (Object.keys(completedWorkOrders).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="text-center py-8">
          <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Items to Review</h3>
          <p className="text-gray-500">
            Completed work orders will appear here for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Work Item Review</h3>
        <p className="text-sm text-gray-600 mt-1">Review and manage completed work items</p>
      </div>
      
      <div className="p-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by account, name, comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rework">Needs Rework</option>
            </select>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              onClick={() => toggleSort('date')}
            >
              <span>Date</span>
              {sortBy === 'date' && (
                <ArrowUpDown className="h-3 w-3 text-gray-500" />
              )}
            </button>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              onClick={() => toggleSort('user')}
            >
              <span>User</span>
              {sortBy === 'user' && (
                <ArrowUpDown className="h-3 w-3 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        {/* Items list */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-gray-500">No items matching your criteria</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div 
                key={`${item.userId}-${item.accountId || index}`}
                className={`border rounded-lg p-4 ${
                  item.reviewStatus === 'approved' ? 'bg-green-50' : 
                  item.reviewStatus === 'rework' ? 'bg-red-50' : 'bg-white'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Item details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{item.accountId || `Item #${index + 1}`}</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        Processed by: {item.userId.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.reviewStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                        item.reviewStatus === 'rework' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.reviewStatus === 'approved' ? 'Approved' : 
                         item.reviewStatus === 'rework' ? 'Needs Rework' : 
                         'Pending Review'}
                      </span>
                    </div>
                    
                    {item.patientName && (
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Patient:</strong> {item.patientName}
                      </p>
                    )}
                    
                    {item.balance && (
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Balance:</strong> ${item.balance.toFixed(2)}
                      </p>
                    )}
                    
                    {/* Comment section */}
                    {item.comment && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium">Comment:</p>
                        <p className="text-sm text-gray-600">{item.comment}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  {item.reviewStatus === 'pending' && (
                    <div className="flex flex-row md:flex-col gap-2 justify-end items-center md:items-end min-w-[120px]">
                      <button
                        onClick={() => onApproveItem(item.userId, item.accountId || index)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => onRequestRework(item.userId, item.accountId || index)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        <XCircle className="h-4 w-4" />
                        Request Rework
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkItemReview;
