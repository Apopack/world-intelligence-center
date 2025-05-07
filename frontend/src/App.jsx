// InsightsPanel.jsx - AI insights component
import React from 'react';
import { TrendingUp, MoreHorizontal } from 'lucide-react';

const InsightsPanel = ({ insights }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center font-semibold">
          <TrendingUp size={20} className="text-blue-600 mr-2" />
          AI Strategic Insights
        </div>
        <button className="p-1 rounded hover:bg-gray-100">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className="bg-gray-50 rounded p-4 border-l-4 border-blue-500"
            >
              <h4 className="text-sm font-semibold text-blue-700 mb-2">
                {insight.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {insight.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;