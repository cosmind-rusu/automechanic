// components/EmployeeWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, TrendingDown, TrendingUp, Smile, Meh, Frown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EmployeeWidget() {
  const router = useRouter();
  const [value, setValue] = useState<number | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null); // Simula el valor anterior
  const [loading, setLoading] = useState(true);

  const getEmployeeStatus = (count: number) => {
    if (count === 0) {
      return { message: 'No hay empleados registrados', icon: <Frown className="w-8 h-8 text-white" />, color: 'bg-red-600' };
    } else if (count < 5) {
      return { message: 'Equipo en crecimiento', icon: <Meh className="w-8 h-8 text-white" />, color: 'bg-yellow-600' };
    } else if (count < 10) {
      return { message: 'Equipo estable', icon: <Smile className="w-8 h-8 text-white" />, color: 'bg-green-600' };
    } else {
      return { message: 'Un gran equipo', icon: <Users className="w-8 h-8 text-white" />, color: 'bg-blue-600' };
    }
  };

  const { message, icon, color } = getEmployeeStatus(value ?? 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/widget/employeeCount');
        const data = await response.json();
        setPrevValue(value); // Guarda el valor actual como valor anterior antes de actualizar
        setValue(data.count);
      } catch (error) {
        console.error('Error fetching employee count:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trendIcon =
    value !== null && prevValue !== null ? (
      value > prevValue ? (
        <TrendingUp className="w-4 h-4 mr-1 text-white" />
      ) : (
        <TrendingDown className="w-4 h-4 mr-1 text-white" />
      )
    ) : null;

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
      onClick={() => router.push('/dashboard/employe')}
    >
      <CardContent className={`p-6 ${color}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Número de Empleados</h3>
            <p className="text-4xl font-bold text-white">{value ?? 0}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-white/80">
          {trendIcon}
          <span className="text-sm">{message}</span>
        </div>
      </CardContent>
    </Card>
  );
}
