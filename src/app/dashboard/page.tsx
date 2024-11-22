// dashboard/page.tsx
'use client'

import React from 'react';
import EmployeeWidget from '@/components/EmployeeWidget';
import RepairedVehiclesWidget from '@/components/RepairedVehiclesWidget';
import DistributorWidget from '@/components/DistributorWidget';
import ClockInWidget from '@/components/ClockInWidget';
import TaskList from '@/components/TaskList';
import EmployeeVehiclesWidget from '@/components/EmployeeVehiclesWidget';
/* import ChatBot from '@/components/Chat'; */
import DashboardAlert from '@/components/DashboardAlert';
import VehiclesPendingPartsWidget from '@/components/VehiclesPendingPartsWidget';
import TotalWorkedHoursWidget from '@/components/TotalWorkedHoursWidget';


const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <DashboardAlert />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-4">
        <EmployeeWidget />
        <RepairedVehiclesWidget />
        <DistributorWidget />

      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <EmployeeVehiclesWidget />
        <VehiclesPendingPartsWidget />
        <TotalWorkedHoursWidget />
      </div>
      <div className="mt-8">
        <ClockInWidget />
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard;