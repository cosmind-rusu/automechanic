'use client';

import React, { useState } from 'react';
import UserList from '@/components/UserList';
import EmployeeDetails from '@/components/EmployeeDetails';
import RegistrationRequests from '@/components/RegistrationRequests';
import EditEmployeeForm from '@/components/EditEmployeeForm';
import { Plus } from 'lucide-react';

const EmployeesPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); // Nuevo estado para el modal de edición
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'employees' | 'requests'>('employees');

  // Función para abrir el modal de detalles
  const handleView = (id: string) => {
    setSelectedUserId(id);
    setIsDetailOpen(true);
  };

  // Función para abrir el modal de edición
  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setIsEditOpen(true);
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeletePrompt = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Función para borrar el empleado
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/employees/${userToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el empleado');
      }

      alert('Empleado eliminado correctamente');
      setIsDeleteModalOpen(false);

      // Actualiza la lista de empleados
      window.location.reload(); // O usa un estado local para refrescar sin recargar la página
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      alert('Error al eliminar el empleado');
    }
  };

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

        {/* Tabs */}
        <div className="bg-gray-100 px-6 py-2">
          <button
            className={`mr-4 px-4 py-2 rounded-t-lg ${
              activeTab === 'employees' ? 'bg-white text-orange-500' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('employees')}
          >
            Empleados
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'requests' ? 'bg-white text-orange-500' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            Solicitudes de Registro
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {activeTab === 'employees' && (
            <UserList
              onView={handleView}
              onEdit={handleEdit} // Nueva función para edición
              onDelete={handleDeletePrompt}
            />
          )}
          {activeTab === 'requests' && <RegistrationRequests />}
        </div>
      </div>

      {/* Modal para Detalles del Usuario */}
      {isDetailOpen && selectedUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <EmployeeDetails employeeId={selectedUserId} onClose={() => setIsDetailOpen(false)} />
        </div>
      )}

      {/* Modal para Editar el Usuario */}
      {isEditOpen && selectedUserId && (
        <EditEmployeeForm
          employeeId={selectedUserId}
          onClose={() => setIsEditOpen(false)}
          onUpdate={() => window.location.reload()} // Actualiza la lista tras la edición
        />
      )}

      {/* Modal para Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
