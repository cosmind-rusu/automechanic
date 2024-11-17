// components/DistributorWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, TrendingUp } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const DistributorWidget = () => {
  const router = useRouter();
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/widget/distributorCount');
        const data = await response.json();
        setValue(data.count);
      } catch (error) {
        console.error('Error fetching distributor count:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-16 w-24 mb-4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      onClick={() => router.push('/dashboard/distributors')}
    >
      <CardContent className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Distribuidores</h3>
            <p className="text-4xl font-bold text-white">{value ?? 0}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Truck className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-white/80">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm">5% más que el mes pasado</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributorWidget;