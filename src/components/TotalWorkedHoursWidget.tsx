// components/TotalWorkedHoursWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Clock9, TrendingUp, Minus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TotalWorkedHoursWidget() {
  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/widget/totalWorkedHours');
        const data = await response.json();
        setTotalHours(data.totalHours || 0);
      } catch (error) {
        console.error('Error fetching total worked hours:', error);
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
    >
      <CardContent className="p-6 bg-gradient-to-br from-green-500 to-teal-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Horas trabajadas esta semana</h3>
            <p className="text-4xl font-bold text-white">{totalHours ?? 0} h</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Clock9 className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-white/80">
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="text-sm">¡Sigue con el buen trabajo! 🎉</span>
        </div>
      </CardContent>
    </Card>
  );
}
