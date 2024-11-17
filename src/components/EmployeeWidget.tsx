// components/EmployeeWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, TrendingDown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EmployeeWidget() {
  const router = useRouter();
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/widget/employeeCount');
        const data = await response.json();
        setValue(data.count);
      } catch (error) {
        console.error('Error fetching employee count:', error);
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
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-16 w-24 mb-4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      onClick={() => router.push('/dashboard/employees')}
    >
      <CardContent className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Número de Empleados</h3>
            <p className="text-4xl font-bold text-white">{value ?? 0}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-white/80">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span className="text-sm">2% menos que el mes pasado</span>
        </div>
      </CardContent>
    </Card>
  );
}