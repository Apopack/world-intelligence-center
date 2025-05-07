// IntelCard.jsx - Main card component for displaying intelligence items
import React from 'react';
import { BookmarkIcon, Share2Icon, PlusCircleIcon, ClockIcon } from 'lucide-react';

const IntelCard = ({ intel }) => {
  const { 
    source, 
    title, 
    content, 
    analysis, 
    tags, 
    impact, 
    timestamp
  } = intel;

  // Map impact level to appropriate styling
  const getImpactColor = (level) => {
    switch(level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-blue-600 mr-2">
            {source.logo}
          </div>
          <span className="text-sm font-medium">{source.name}</span>
        </div>
        <div className="flex items-center text-xs">
          <div className={`w-2 h-2 rounded-full ${getImpactColor(impact.level)} mr-1`}></div>
          <span>{impact.label}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{content}</p>
        
        {analysis && (
          <div className="bg-blue-50 p-3 rounded border-l-3 border-blue-500 mb-3">
            <div className="flex items-center text-sm font-semibold text-blue-600 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              AI Analysis
            </div>
            <p className="text-sm text-gray-700">{analysis}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mb-1">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-4 py-2 border-t flex justify-between items-center text-xs text-gray-500">
        <div className="flex gap-4">
          <button className="flex items-center hover:text-blue-600 transition-colors">
            <BookmarkIcon size={14} className="mr-1" />
            Save
          </button>
          <button className="flex items-center hover:text-blue-600 transition-colors">
            <Share2Icon size={14} className="mr-1" />
            Share
          </button>
          <button className="flex items-center hover:text-blue-600 transition-colors">
            <PlusCircleIcon size={14} className="mr-1" />
            More
          </button>
        </div>
        <div className="flex items-center">
          <ClockIcon size={14} className="mr-1" />
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default IntelCard;