/* dashboard/vehicles/page.tsx */
'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    propietario: '',
    telefono: '',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    cilindrada: 0,
    combustible: '',
    kilometraje: 0,
    bastidor: '',
    empleados: [] as string[],
    comentarios: '',
    estado: 'En reparación',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      setVehicles(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading vehicles');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = currentVehicle ? `/api/vehicles/${currentVehicle.id}` : '/api/vehicles';
      const method = currentVehicle ? 'PUT' : 'POST';
      
      // Creamos una copia de formData para modificar
      const submissionData = { ...formData };
      
      // Si no hay empleados seleccionados, enviamos un array vacío
      if (submissionData.empleados.length === 0) {
        submissionData.empleados = [];
      }
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save vehicle');
      }
  
      fetchVehicles();
      setIsModalOpen(false);
      setCurrentVehicle(null);
      setFormData({
        propietario: '',
        telefono: '',
        marca: '',
        modelo: '',
        ano: new Date().getFullYear(),
        cilindrada: 0,
        combustible: '',
        kilometraje: 0,
        bastidor: '',
        empleados: [],
        comentarios: '',
        estado: 'En reparación',
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      propietario: vehicle.propietario,
      telefono: vehicle.telefono,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: vehicle.ano,
      cilindrada: vehicle.cilindrada,
      combustible: vehicle.combustible,
      kilometraje: vehicle.kilometraje,
      bastidor: vehicle.bastidor,
      empleados: vehicle.empleados.map(emp => emp.id),
      comentarios: vehicle.comentarios || '',
      estado: vehicle.estado,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Estas a punto de eliminar un vehículo. ¿Estás seguro?')) {
      try {
        const response = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete vehicle');
        }
        fetchVehicles();
      } catch (err) {
        setError('Error deleting vehicle');
      }
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehículos en Reparación</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Añadir Vehículo
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vehicle.propietario}</div>
                  <div className="text-sm text-gray-500">{vehicle.telefono}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vehicle.marca} {vehicle.modelo}</div>
                  <div className="text-sm text-gray-500">{vehicle.ano}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {vehicle.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-900 mr-2"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button>
                  <Link href={`/dashboard/vehicles/${vehicle.id}`} className="text-blue-600 hover:text-blue-900">
                    <Eye size={18} />
                  </Link>
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-2xl shadow-lg rounded-md bg-white">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        {currentVehicle ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Propietario</label>
            <input
              type="text"
              value={formData.propietario}
              onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Modelo</label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Año</label>
            <input
              type="number"
              value={formData.ano}
              onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cilindrada</label>
            <input
              type="number"
              value={formData.cilindrada}
              onChange={(e) => setFormData({ ...formData, cilindrada: parseInt(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Combustible</label>
            <select
              value={formData.combustible}
              onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Seleccione combustible</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kilometraje</label>
            <input
              type="number"
              value={formData.kilometraje}
              onChange={(e) => setFormData({ ...formData, kilometraje: parseInt(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bastidor</label>
            <input
              type="text"
              value={formData.bastidor}
              onChange={(e) => setFormData({ ...formData, bastidor: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="En reparación">En reparación</option>
              <option value="Pendiente de piezas">Pendiente de piezas</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Empleados asignados</label>
          {/* Aquí deberías incluir un componente de selección múltiple para los empleados */}
          {/* Por ejemplo, podrías usar react-select o un componente personalizado */}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Comentarios</label>
          <textarea
            value={formData.comentarios}
            onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setCurrentVehicle(null);
              setFormData({
                propietario: '',
                telefono: '',
                marca: '',
                modelo: '',
                ano: new Date().getFullYear(),
                cilindrada: 0,
                combustible: '',
                kilometraje: 0,
                bastidor: '',
                empleados: [],
                comentarios: '',
                estado: 'En reparación',
              });
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentVehicle ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}