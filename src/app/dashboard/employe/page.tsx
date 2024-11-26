'use client';
import React, { useState, useEffect } from 'react';
import EmployeeCard from '@/components/EmployeeCard';
import RegistrationRequestCard from '@/components/RegistrationRequestCard';
import { Plus } from 'lucide-react';

type Employee = {
  id: string;
  name: string;
  telefono: number;
};

type RegistrationRequest = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: number;
  usuario: string;
  status: string;
};

export const dynamic = 'force-dynamic';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'employees' | 'requests'>('employees');

  useEffect(() => {
    fetchEmployees();
    fetchRegistrationRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrationRequests = async () => {
    try {
      const response = await fetch('/api/admin/registration-requests');
      const data = await response.json();
      setRegistrationRequests(data);
    } catch (error) {
      console.error('Error fetching registration requests:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/admin/registration-requests/${id}/approve`, { method: 'POST' });
      fetchRegistrationRequests();
      fetchEmployees();
    } catch (error) {
      console.error('Error approving registration request:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/admin/registration-requests/${id}/reject`, { method: 'POST' });
      fetchRegistrationRequests();
    } catch (error) {
      console.error('Error rejecting registration request:', error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-orange-500 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
          <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-orange-100">
            <Plus size={20} className="mr-2" />
            Añadir Empleado
          </button>
        </div>
        <div className="bg-gray-100 px-6 py-2">
          <button
            className={`mr-4 px-4 py-2 rounded-t-lg ${activeTab === 'employees' ? 'bg-white text-orange-500' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('employees')}
          >
            Empleados
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'requests' ? 'bg-white text-orange-500' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('requests')}
          >
            Solicitudes de Registro
          </button>
        </div>
        <div className="p-6">
          {activeTab === 'employees' &&
            employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={() => {}}
                onView={() => {}}
                onDelete={() => {}}
              />
            ))}
          {activeTab === 'requests' &&
            registrationRequests.map((request) => (
              <RegistrationRequestCard
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
