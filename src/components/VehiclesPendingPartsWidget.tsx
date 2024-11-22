// components/VehiclesPendingPartsWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, AlertCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

type Vehicle = {
  id: string;
  propietario: string;
  marca: string;
  modelo: string;
  estado: string;
};

export default function VehiclesPendingPartsWidget() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/widget/vehiclesPendingParts');
        const data = await response.json();
        setVehicles(data.vehicles || []);
      } catch (error) {
        console.error('Error fetching vehicles pending parts:', error);
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
      onClick={() => router.push('/dashboard/vehicles?filter=pending-parts')}
    >
      <CardContent className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Vehículos pendientes de piezas</h3>
            <p className="text-4xl font-bold text-white">{vehicles.length}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-white/80">
          {vehicles.length === 0 ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm">No hay vehículos pendientes de piezas</span>
            </>
          ) : (
            <span className="text-sm">{vehicles.length} vehículo(s) pendiente(s)</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
