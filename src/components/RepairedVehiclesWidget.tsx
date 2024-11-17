// components/RepairedVehiclesWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench } from 'lucide-react';
import DashboardWidget from './DashboardWidget';

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
      title="Vehículos en reparación"
      value={value}
      icon={<Wrench className="w-8 h-8 text-orange-500" />}
      color="orange"
      onClick={() => router.push('/dashboard/vehicles')}
    />
  );
};

export default RepairedVehiclesWidget;
