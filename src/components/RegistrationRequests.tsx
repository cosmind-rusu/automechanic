'use client';

import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

type RegistrationRequest = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: number;
  usuario: string;
  status: string;
};

const RegistrationRequests = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/registration-requests');
      if (!response.ok) {
        throw new Error('Error al obtener las solicitudes de registro');
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las solicitudes de registro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/registration-requests/${id}/approve`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Error al aprobar la solicitud');
      }
      alert('Solicitud aprobada con éxito');
      fetchRequests(); // Refresca la lista de solicitudes
    } catch (err) {
      console.error(err);
      alert('Error al aprobar la solicitud');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/registration-requests/${id}/reject`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Error al rechazar la solicitud');
      }
      alert('Solicitud rechazada con éxito');
      fetchRequests(); // Refresca la lista de solicitudes
    } catch (err) {
      console.error(err);
      alert('Error al rechazar la solicitud');
    }
  };

  if (isLoading) {
    return <p className="text-center">Cargando solicitudes de registro...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white shadow rounded-lg p-4 mb-4 flex items-center justify-between"
        >
          <div>
            <p className="text-lg font-semibold">{`${request.nombre} ${request.apellido}`}</p>
            <p className="text-sm text-gray-500">Teléfono: {request.telefono}</p>
            <p className="text-sm text-gray-500">Usuario: {request.usuario}</p>
            <p className="text-sm text-gray-500">Estado: {request.status}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleApprove(request.id)}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => handleReject(request.id)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegistrationRequests;
