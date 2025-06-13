import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';

const CompletedWorkAnalytics = ({ completedWorkOrders }) => {
  const [analytics, setAnalytics] = useState({
    totalCompletedItems: 0,
    accuracyRate: 0,
    averageResolutionTime: 0,
    commonCommentTypes: {},
    userPerformance: {},
    qualityByCategory: {},
  });

  useEffect(() => {
    if (Object.keys(completedWorkOrders).length > 0) {
      // Generate analytics from completed work orders
      analyzeCompletedWork(completedWorkOrders);
    }
  }, [completedWorkOrders]);

  const analyzeCompletedWork = (workOrders) => {
    let totalItems = 0;
    let correctItems = 0;
    let totalTime = 0;
    let commentTypes = {};
    let userItems = {};
    let categoryQuality = {
      'Insurance': { total: 0, correct: 0 },
      'Patient': { total: 0, correct: 0 },
      'Billing': { total: 0, correct: 0 },
      'Other': { total: 0, correct: 0 }
    };

    // Process each user's completed work
    Object.entries(workOrders).forEach(([userId, workOrder]) => {
      if (!workOrder || !workOrder.data) return;
      
      const userTotal = workOrder.data.length;
      const userCorrect = workOrder.data.filter(item => !item.needsRework).length;
      
      userItems[userId] = { 
        total: userTotal,
        correct: userCorrect,
        accuracy: userTotal > 0 ? (userCorrect / userTotal * 100).toFixed(1) : 0
      };
      
      totalItems += userTotal;
      correctItems += userCorrect;

      // Calculate processing time if available
      if (workOrder.uploadedAt && workOrder.assignedAt) {
        const processingTime = (new Date(workOrder.uploadedAt) - new Date(workOrder.assignedAt)) / (1000 * 60);
        totalTime += processingTime;
      }
      
      // Analyze comments and categorize them
      workOrder.data.forEach(item => {
        if (item.comment) {
          // Simple categorization based on keywords - can be enhanced
          const commentCategory = categorizeComment(item.comment);
          commentTypes[commentCategory] = (commentTypes[commentCategory] || 0) + 1;
        }
        
        // Group by item category if available, otherwise use "Other"
        const category = item.category || 'Other';
        if (!categoryQuality[category]) {
          categoryQuality[category] = { total: 0, correct: 0 };
        }
        categoryQuality[category].total += 1;
        if (!item.needsRework) {
          categoryQuality[category].correct += 1;
        }
      });
    });

    // Calculate final metrics
    setAnalytics({
      totalCompletedItems: totalItems,
      accuracyRate: totalItems > 0 ? (correctItems / totalItems * 100).toFixed(1) : 0,
      averageResolutionTime: totalItems > 0 ? (totalTime / totalItems).toFixed(1) : 0,
      commonCommentTypes: commentTypes,
      userPerformance: userItems,
      qualityByCategory: categoryQuality,
    });
  };
  
  const categorizeComment = (comment) => {
    const lowerComment = comment.toLowerCase();
    if (lowerComment.includes('insurance') || lowerComment.includes('coverage') || lowerComment.includes('policy')) {
      return 'Insurance';
    } else if (lowerComment.includes('patient') || lowerComment.includes('client')) {
      return 'Patient';
    } else if (lowerComment.includes('bill') || lowerComment.includes('payment') || lowerComment.includes('charge')) {
      return 'Billing';
    } else {
      return 'Other';
    }
  };

  // If no completed work orders, show a message
  if (Object.keys(completedWorkOrders).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Completed Work Orders Available</h3>
          <p className="text-gray-500">
            Wait for at least one work order to be completed to view analytics and trends.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Completed Work Analysis</h3>
        <p className="text-sm text-gray-600 mt-1">Trends and insights from completed work orders</p>
      </div>
      
      <div className="p-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-gray-100 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center">
              <BarChart className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Accuracy Rate</p>
                <p className="text-xl font-semibold">{analytics.accuracyRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-4 bg-green-50">
            <div className="flex items-center">
              <PieChart className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Items</p>
                <p className="text-xl font-semibold">{analytics.totalCompletedItems}</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Resolution Time</p>
                <p className="text-xl font-semibold">{analytics.averageResolutionTime} min</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comment Type Distribution */}
        <div className="mb-8">
          <h4 className="text-md font-medium mb-3">Comment Type Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(analytics.commonCommentTypes).map(([type, count], index) => (
              <div key={type} className="border rounded-lg p-3">
                <p className="text-sm font-medium">{type}</p>
                <div className="flex items-center mt-2">
                  <div 
                    className="h-2 rounded-full bg-blue-600" 
                    style={{ 
                      width: `${(count / analytics.totalCompletedItems * 100)}%`, 
                      minWidth: '20px' 
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-500">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Category Quality */}
        <div>
          <h4 className="text-md font-medium mb-3">Quality by Category</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analytics.qualityByCategory).map(([category, data], index) => {
              if (data.total === 0) return null;
              const qualityRate = data.total > 0 ? (data.correct / data.total * 100).toFixed(1) : 0;
              
              return (
                <div key={category} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{category}</p>
                    <p className="text-sm text-gray-500">{data.correct} / {data.total}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        qualityRate >= 90 ? 'bg-green-600' : 
                        qualityRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${qualityRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-right mt-1">{qualityRate}% Accuracy</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedWorkAnalytics;
