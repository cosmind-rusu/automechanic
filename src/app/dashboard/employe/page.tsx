'use client'
import React, { useState, useEffect } from 'react'
import { User, Plus, Edit, Eye, Trash2, Check, X } from 'lucide-react'

export const dynamic = 'force-dynamic';

type Employee = {
  id: string
  name: string
  telefono: number
}

type RegistrationRequest = {
  id: string
  nombre: string
  apellido: string
  telefono: number
  usuario: string
  status: string
}

const EmployeeCard: React.FC<{ 
  employee: Employee, 
  onEdit: (id: string) => void, 
  onView: (id: string) => void,
  onDelete: (id: string) => void
}> = ({ employee, onEdit, onView, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <User className="h-10 w-10 text-gray-400 mr-4" />
        <div>
          <div className="text-lg font-medium text-gray-900">{employee.name}</div>
          <div className="text-sm text-gray-500">Teléfono: {employee.telefono}</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onView(employee.id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors duration-200">
          <Eye size={20} />
        </button>
        <button onClick={() => onEdit(employee.id)} className="p-2 text-green-500 hover:bg-green-100 rounded-full transition-colors duration-200">
          <Edit size={20} />
        </button>
        <button onClick={() => onDelete(employee.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-200">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}

const RegistrationRequestCard: React.FC<{
  request: RegistrationRequest,
  onApprove: (id: string) => void,
  onReject: (id: string) => void
}> = ({ request, onApprove, onReject }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{request.nombre} {request.apellido}</p>
        <p className="text-sm text-gray-600">{request.usuario}</p>
        <p className="text-sm text-gray-600">Teléfono: {request.telefono}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onApprove(request.id)}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          <Check size={20} />
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', telefono: '', rol: 'EMPLEADO' });
  const [activeTab, setActiveTab] = useState<'employees' | 'requests'>('employees');

  useEffect(() => {
    fetchEmployees();
    fetchRegistrationRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading employees');
      setIsLoading(false);
    }
  };

  const fetchRegistrationRequests = async () => {
    try {
      const response = await fetch('/api/admin/registration-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch registration requests');
      }
      const data = await response.json();
      setRegistrationRequests(data);
    } catch (err) {
      setError('Error loading registration requests');
    }
  };

  const handleView = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({ name: employee.name, telefono: employee.telefono.toString(), rol: 'EMPLEADO' });
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }
        fetchEmployees();
      } catch (err) {
        setError('Error deleting employee');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditModalOpen ? `/api/employees/${selectedEmployee?.id}` : '/api/employees';
    const method = isEditModalOpen ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, telefono: parseInt(formData.telefono), rol: formData.rol }),
      });

      if (!response.ok) {
        throw new Error('Failed to save employee');
      }

      fetchEmployees();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Error saving employee');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/registration-requests/${id}/approve`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to approve request');
      }
      fetchRegistrationRequests();
      fetchEmployees();
    } catch (err) {
      setError('Error approving request');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/registration-requests/${id}/reject`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      fetchRegistrationRequests();
    } catch (err) {
      setError('Error rejecting request');
    }
  };

  if (isLoading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-orange-500 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-orange-100 transition-colors duration-200">
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
          {activeTab === 'employees' && employees.map((employee) => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee} 
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
          {activeTab === 'requests' && registrationRequests.map((request) => (
            <RegistrationRequestCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      </div>

      {/* Modal de Vista */}
      {isViewModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Detalles del Empleado</h2>
            <p>Nombre: {selectedEmployee.name}</p>
            <p>Teléfono: {selectedEmployee.telefono}</p>
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Añadir/Editar */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{isEditModalOpen ? 'Editar' : 'Añadir'} Empleado</h2>
            <form onSubmit={handleSubmit}>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
      Nombre
    </label>
    <input
      type="text"
      id="name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      required
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
      Teléfono
    </label>
    <input
      type="tel"
      id="telefono"
      value={formData.telefono}
      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      required
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rol">
      Rol
    </label>
    <select
      id="rol"
      value={formData.rol}
      onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      required
    >
      <option value="EMPLEADO">Empleado</option>
      <option value="PRACTICAS">Prácticas</option>
      <option value="MECANICO">Mecánico</option>
      <option value="APRENDIZ">Aprendiz</option>
      <option value="JEFE_MECANICO">Jefe Mecánico</option>
    </select>
  </div>
  
  <div className="flex justify-end">
    <button
      type="button"
      onClick={() => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
      }}
      className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="bg-green-500 text-white px-4 py-2 rounded"
    >
      Guardar
    </button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  )
}