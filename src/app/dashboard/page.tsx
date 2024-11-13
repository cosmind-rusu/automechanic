'use client'
import React, { useEffect, useState } from 'react';
import { Users, Truck, Wrench } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <EmployeeWidget />
        <RepairedVehiclesWidget />
        <DistributorWidget />
      </div>
    </div>
  );
};

const EmployeeWidget = () => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/widget/employeeCount');
      const data = await response.json();
      setValue(data.count);
    };
    fetchData();
  }, []);

  return (
    <DashboardWidget
      title="Número de Empleados"
      value={value}
      icon={<Users className="w-6 h-6 text-blue-500" />}
      color="blue"
    />
  );
};

const RepairedVehiclesWidget = () => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/widget/repairedVehiclesCount');
      const data = await response.json();
      setValue(data.count);
    };
    fetchData();
  }, []);

  return (
    <DashboardWidget
      title="Vehículos Reparados"
      value={value}
      icon={<Wrench className="w-6 h-6 text-green-500" />}
      color="green"
    />
  );
};

const DistributorWidget = () => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/widget/distributorCount');
      const data = await response.json();
      setValue(data.count);
    };
    fetchData();
  }, []);

  return (
    <DashboardWidget
      title="Proveedores"
      value={value}
      icon={<Truck className="w-6 h-6 text-yellow-500" />}
      color="yellow"
    />
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
