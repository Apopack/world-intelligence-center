// Sidebar.jsx - Navigation sidebar component
import React from 'react';
import { Home, FileText, Calendar, Star, Map, Activity, 
         Building, DollarSign, Users } from 'lucide-react';

const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center p-3 rounded-lg mb-1 cursor-pointer 
    font-medium transition-all ${active ? 'bg-blue-50 text-blue-600' : 
    'hover:bg-blue-50 hover:text-blue-600'}`}>
    {icon}
    <span className="ml-3">{label}</span>
  </div>
);

const NavSection = ({ title, children }) => (
  <div className="mt-6 mb-3">
    <div className="text-xs font-semibold text-gray-500 px-3 mb-2">
      {title}
    </div>
    {children}
  </div>
);

const Sidebar = () => {
  return (
    <div className="bg-white border-r border-gray-200 w-60 h-screen sticky top-0 overflow-y-auto p-4">
      <div className="flex items-center font-bold text-xl text-blue-600 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
          strokeLinejoin="round" className="mr-2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        World Intelligence
      </div>

      <NavItem 
        icon={<Home size={20} />} 
        label="Dashboard" 
        active={true} 
      />
      <NavItem 
        icon={<FileText size={20} />} 
        label="Daily Briefing" 
      />
      <NavItem 
        icon={<Calendar size={20} />} 
        label="Archive" 
      />
      <NavItem 
        icon={<Star size={20} />} 
        label="Bookmarked" 
      />

      <NavSection title="REGIONS">
        <NavItem icon={<Map size={20} />} label="Africa" />
        <NavItem icon={<Map size={20} />} label="Americas" />
        <NavItem icon={<Map size={20} />} label="Asia Pacific" />
        <NavItem icon={<Map size={20} />} label="Europe" />
        <NavItem icon={<Map size={20} />} label="Middle East" />
      </NavSection>

      <NavSection title="SECTORS">
        <NavItem icon={<Activity size={20} />} label="Politics" />
        <NavItem icon={<Building size={20} />} label="Governance" />
        <NavItem icon={<DollarSign size={20} />} label="Economics" />
        <NavItem icon={<Users size={20} />} label="Civil Society" />
      </NavSection>
    </div>
  );
};

export default Sidebar;