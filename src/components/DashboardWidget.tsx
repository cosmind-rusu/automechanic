// components/DashboardWidget.tsx
'use client';
import React from 'react';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, value, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer`}
  >
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {icon}
    </div>
    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export default DashboardWidget;
