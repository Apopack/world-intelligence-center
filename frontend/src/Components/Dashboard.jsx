// Dashboard.jsx - Main dashboard component
import React, { useState, useEffect } from 'react';
import IntelCard from './IntelCard';
import InsightsPanel from './InsightsPanel';
import { Search } from 'lucide-react';

const FilterBar = ({ filters, activeFilter, onFilterChange }) => (
  <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
    {filters.map((filter) => (
      <button
        key={filter.id}
        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
          activeFilter === filter.id
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200 hover:bg-blue-50'
        }`}
        onClick={() => onFilterChange(filter.id)}
      >
        {filter.label}
      </button>
    ))}
  </div>
);

const Dashboard = () => {
  const [intelItems, setIntelItems] = useState([]);
  const [insights, setInsights] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all-regions');
  const [loading, setLoading] = useState(true);

  // Available filters
  const filters = [
    { id: 'all-regions', label: 'All Regions' },
    { id: 'politics', label: 'Politics' },
    { id: 'economics', label: 'Economics' },
    { id: 'governance', label: 'Governance' },
    { id: 'civil-society', label: 'Civil Society' },
    { id: 'high-impact', label: 'High Impact' },
    { id: 'trending', label: 'Trending' },
    { id: 'conflicts', label: 'Conflicts' },
    { id: 'climate', label: 'Climate' },
  ];

  // Fetch intel items and insights
  useEffect(() => {
    // In a real application, this would call the API
    // For demo purposes, we'll simulate API calls with timeouts
    
    const fetchIntelItems = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockData = [
          {
            id: '1',
            source: { 
              name: 'Reuters', 
              logo: 'R'
            },
            title: "Brazil's Central Bank Raises Interest Rates to 11.75% as Inflation Concerns Mount",
            content: "Brazil's central bank raised its benchmark interest rate by 50 basis points to 11.75% on Wednesday, a larger hike than expected, as policymakers work to tame inflation that has remained stubbornly above the bank's target.",
            analysis: "This is the third consecutive rate increase, signaling the government's prioritization of inflation control over economic growth. The move may strain Brazil's recovery amid slowing global demand for commodities and could impact upcoming fiscal policy decisions.",
            tags: ['Economics', 'Americas', 'Monetary Policy'],
            impact: {
              level: 'high',
              label: 'High Impact'
            },
            timestamp: '3 hours ago'
          },
          {
            id: '2',
            source: { 
              name: 'Al Jazeera', 
              logo: 'AJ'
            },
            title: "Chinese Foreign Minister Outlines New Economic Partnership with East African Nations",
            content: "China's foreign minister announced a comprehensive development package during his visit to Tanzania, including infrastructure investments worth $8.7 billion and increased agricultural partnerships.",
            analysis: "This represents a significant extension of China's Belt and Road Initiative in East Africa, directly competing with Western development programs. The focus on agricultural technology transfers indicates a strategic shift toward addressing food security concerns while securing long-term resource access.",
            tags: ['Politics', 'Africa', 'Foreign Relations'],
            impact: {
              level: 'high',
              label: 'High Impact'
            },
            timestamp: '5 hours ago'
          },
          {
            id: '3',
            source: { 
              name: 'The Economist', 
              logo: 'EC'
            },
            title: "EU Parliament Approves New Digital Markets Regulation with Bipartisan Support",
            content: "The European Parliament voted overwhelmingly to approve the Digital Markets Act, establishing new regulations for large tech platforms operating in the EU, with enhanced power to impose fines and require algorithmic transparency.",
            analysis: "This legislation establishes the EU as the global leader in tech regulation, likely forcing changes to business models of major platforms worldwide. The bipartisan support (587-56) signals broad consensus on tech oversight that transcends traditional political divides, potentially influencing similar legislation in other jurisdictions.",
            tags: ['Governance', 'Europe', 'Technology'],
            impact: {
              level: 'medium',
              label: 'Medium Impact'
            },
            timestamp: '8 hours ago'
          },
          {
            id: '4',
            source: { 
              name: 'ReliefWeb', 
              logo: 'RW'
            },
            title: "Record Number of Indigenous Land Defenders Murdered in Amazon Region as Illegal Mining Expands",
            content: "Human rights organizations report that 212 indigenous environmental activists were killed in the past year across Brazil, Peru, and Colombia, marking a 34% increase as conflicts escalate over resource extraction in protected areas.",
            analysis: "This alarming trend indicates a breakdown in environmental governance across the Amazon basin, coinciding with rising commodity prices and new mining operations. The involvement of criminal organizations in these killings suggests state institutions are failing to maintain authority in remote areas, creating governance voids that threaten both human rights and critical ecosystems.",
            tags: ['Civil Society', 'Americas', 'Human Rights'],
            impact: {
              level: 'high',
              label: 'High Impact'
            },
            timestamp: '10 hours ago'
          }
        ];
        
        setIntelItems(mockData);
        setLoading(false);
      }, 500);
    };

    const fetchInsights = async () => {
      // Simulate API call for insights
      setTimeout(() => {
        const mockInsights = [
          {
            id: '1',
            title: 'Monetary Policy Divergence',
            content: 'Emerging markets are tightening monetary policy while developed economies maintain accommodative stances, creating potential capital flow volatility in the coming quarter.'
          },
          {
            id: '2',
            title: 'Resource Governance Challenges',
            content: 'Rising commodity prices are testing the governance capacity of resource-rich nations, with implications for political stability and civil society safety.'
          },
          {
            id: '3',
            title: 'Regulatory Competition',
            content: "The EU's digital markets regulation establishes a new global standard that may force other jurisdictions to adapt similar frameworks or risk regulatory arbitrage."
          },
          {
            id: '4',
            title: 'Shifting Development Models',
            content: "China's comprehensive approach to East African partnerships signals a shift from project-based to sector-based development support, challenging Western approaches."
          }
        ];
        
        setInsights(mockInsights);
      }, 800);
    };

    fetchIntelItems();
    fetchInsights();
  }, [activeFilter]);

  // Filter handling
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    // In real app, this would trigger a new API call with filter parameters
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-96">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for regions, countries, or topics..."
            className="w-full outline-none text-sm"
          />
        </div>
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            SA
          </div>
        </div>
      </div>

      <FilterBar 
        filters={filters} 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md h-64 animate-pulse">
              <div className="h-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {intelItems.map((item) => (
              <IntelCard key={item.id} intel={item} />
            ))}
          </div>

          <InsightsPanel insights={insights} />
        </>
      )}
    </div>
  );
};

export default Dashboard;