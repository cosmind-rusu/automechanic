// components/EmployeeVehiclesWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, ClipboardList } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EmployeeVehiclesWidget() {
  const router = useRouter();
  const [data, setData] = useState<{ employee: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/widget/employeeVehiclesCount');
        if (!response.ok) {
          throw new Error('Failed to fetch employee vehicles count');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching employee vehicles count:', error);
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
          <Skeleton className="h-16 w-full mb-4" />
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
      <CardContent className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Vehículos por empleado</h3>
            <ul className="text-white">
              {data.map(({ employee, count }) => (
                <li key={employee} className="flex justify-between">
                  <span>{employee}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-white/80">
          <ClipboardList className="w-4 h-4 mr-1" />
          <span className="text-sm">Asignaciones actuales</span>
        </div>
      </CardContent>
    </Card>
  );
}
