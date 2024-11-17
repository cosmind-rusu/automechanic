// components/RepairedVehiclesWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, TrendingUp } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function RepairedVehiclesWidget() {
  const router = useRouter();
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/widget/repairedVehiclesCount');
        const data = await response.json();
        setValue(data.count);
      } catch (error) {
        console.error('Error fetching repaired vehicles count:', error);
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
          <Skeleton className="h-8 w-56 mb-4" />
          <Skeleton className="h-16 w-24 mb-4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      onClick={() => router.push('/dashboard/vehicles')}
    >
      <CardContent className="p-6 bg-gradient-to-br from-orange-500 to-amber-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Vehículos en reparación</h3>
            <p className="text-4xl font-bold text-white">{value ?? 0}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Wrench className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-white/80">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm">10% más que la semana pasada</span>
        </div>
      </CardContent>
    </Card>
  );
}
