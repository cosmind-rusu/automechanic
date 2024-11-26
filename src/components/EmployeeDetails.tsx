'use client';

import React, { useEffect, useState } from 'react';

type Employee = {
  id: string;
  name: string;
  telefono: number;
  rol: string;
};

type EmployeeDetailsProps = {
  employeeId: string;
  onClose: () => void;
};

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del empleado');
      }
      const data = await response.json();
      setEmployee(data);
    } catch (err) {
      setError('No se pudieron cargar los detalles del empleado');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center">Cargando detalles del empleado...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!employee) {
    return <p className="text-center text-red-500">Empleado no encontrado</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Detalles del Empleado</h2>
      <p><strong>Nombre Completo:</strong> {employee.name}</p>
      <p><strong>Teléfono:</strong> {employee.telefono}</p>
      <p><strong>Rol:</strong> {employee.rol}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Cerrar
      </button>
    </div>
  );
};

export default EmployeeDetails;
