// components/EmployeeWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import DashboardWidget from './DashboardWidget';

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
      icon={<Users className="w-8 h-8 text-blue-500" />}
      color="blue"
      onClick={() => router.push('/dashboard/employe')}
    />
  );
};

export default EmployeeWidget;
