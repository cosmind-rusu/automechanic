// components/DistributorWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';
import DashboardWidget from './DashboardWidget';

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
      title="Distribuidores"
      value={value}
      icon={<Truck className="w-8 h-8 text-purple-500" />}
      color="purple"
      onClick={() => router.push('/dashboard/distributors')}
    />
  );
};

export default DistributorWidget;
