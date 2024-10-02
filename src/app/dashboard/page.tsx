import React from 'react';
import { Clipboard, Wrench, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardWidget
          title="Órdenes Activas"
          value="12"
          icon={<Clipboard className="w-6 h-6 text-blue-500" />}
          color="blue"
        />
        <DashboardWidget
          title="Inventario Bajo"
          value="3 items"
          icon={<Wrench className="w-6 h-6 text-yellow-500" />}
          color="yellow"
        />
        <DashboardWidget
          title="Tareas Pendientes"
          value="5"
          icon={<CheckSquare className="w-6 h-6 text-green-500" />}
          color="green"
        />
      </div>
    </div>
  );
};

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {icon}
    </div>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export default Dashboard;