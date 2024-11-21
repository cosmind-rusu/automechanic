'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Edit } from 'lucide-react';

type Vehicle = {
  id: string;
  propietario: string;
  telefono: string;
  marca: string;
  modelo: string;
  ano: number;
  cilindrada: number;
  combustible: string;
  kilometraje: number;
  bastidor: string;
  empleados: { id: string; nombre: string; apellido: string }[];
  comentarios?: string;
  estado: string;
};

export default function VehicleDetailPage() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Fetch all vehicles for navigation
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError('Error loading vehicles');
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    // Fetch individual vehicle details
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle');
        }
        const data = await response.json();
        setVehicle(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error loading vehicle');
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchVehicle();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/dashboard/vehicles/edit/${vehicle?.id}`);
  };

  const handlePrevious = () => {
    const currentIndex = vehicles.findIndex((v) => v.id === vehicle?.id);
    if (currentIndex > 0) {
      router.push(`/dashboard/vehicles/${vehicles[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    const currentIndex = vehicles.findIndex((v) => v.id === vehicle?.id);
    if (currentIndex < vehicles.length - 1) {
      router.push(`/dashboard/vehicles/${vehicles[currentIndex + 1].id}`);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  if (!vehicle) return <div className="text-center p-4">No vehicle found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard/vehicles")}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handlePrevious}
            className="flex items-center bg-gray-700 text-white px-3 py-1.5 rounded hover:bg-gray-700 disabled:opacity-50"
            disabled={vehicles.findIndex((v) => v.id === vehicle.id) === 0}
          >
            <ArrowLeft className="mr-1" size={14} />
            Anterior
          </button>
          <button
            onClick={handleNext}
            className="flex items-center bg-gray-700 text-white px-3 py-1.5 rounded hover:bg-gray-700 disabled:opacity-50"
            disabled={
              vehicles.findIndex((v) => v.id === vehicle.id) ===
              vehicles.length - 1
            }
          >
            Siguiente
            <ArrowRight className="ml-1" size={14} />
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Edit className="mr-2" size={20} />
            Editar
          </button>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Detalles del Vehículo
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {vehicle.marca} {vehicle.modelo} - {vehicle.ano}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Propietario</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {vehicle.propietario}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {vehicle.telefono}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Bastidor</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {vehicle.bastidor}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cilindrada</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {vehicle.cilindrada} cc
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Combustible</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {vehicle.combustible}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Kilometraje</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {vehicle.kilometraje} km
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vehicle.estado === "En reparación"
                      ? "bg-yellow-100 text-yellow-800"
                      : vehicle.estado === "Pendiente de piezas"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {vehicle.estado}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Empleados asignados
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {vehicle.empleados.map((empleado) => (
                    <li
                      key={empleado.id}
                      className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          {empleado.nombre} {empleado.apellido}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Comentarios</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {vehicle.comentarios || "Sin comentarios"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
