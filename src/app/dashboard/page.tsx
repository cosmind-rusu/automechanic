'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
      onClick={() => router.push('/dashboard/employe')}
    />
  );
};

const RepairedVehiclesWidget = () => {
  const router = useRouter();
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
      onClick={() => router.push('/dashboard/vehicles')}
    />
  );
};

const DistributorWidget = () => {
  const router = useRouter();
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
      onClick={() => router.push('/dashboard/distributors')}
    />
  );
};

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
    className={`
      bg-white rounded-lg shadow-md p-4 border-l-4 border-${color}-500
      transition-all duration-300 ease-in-out
      hover:scale-105 hover:shadow-lg
      cursor-pointer
    `}
  >
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {icon}
    </div>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export default Dashboard;
