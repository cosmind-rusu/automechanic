'use client';

import React, { useState, useEffect } from 'react';

type EditEmployeeFormProps = {
  employeeId: string;
  onClose: () => void;
  onUpdate: () => void; // Para refrescar la lista después de la edición
};

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ employeeId, onClose, onUpdate }) => {
  const [employeeData, setEmployeeData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    rol: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del empleado');
      }
      const data = await response.json();
      setEmployeeData({
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono.toString(),
        rol: data.rol,
      });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la información del empleado');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: employeeData.nombre.trim(),
          apellido: employeeData.apellido.trim(),
          telefono: parseInt(employeeData.telefono.trim(), 10), // Convertir a número
          rol: employeeData.rol,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.error || 'Error al actualizar el empleado');
      }

      alert('Empleado actualizado correctamente');
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message || 'Error al actualizar el empleado');
      } else {
        alert('Error al actualizar el empleado');
      }
    }
  };

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Editar Empleado</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={employeeData.nombre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={employeeData.apellido}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
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
              name="telefono"
              value={employeeData.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rol">
              Rol
            </label>
            <select
              id="rol"
              name="rol"
              value={employeeData.rol}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="EMPLEADO">Empleado</option>
              <option value="PRACTICAS">Prácticas</option>
              <option value="MECANICO">Mecánico</option>
              <option value="APRENDIZ">Aprendiz</option>
              <option value="JEFE_MECANICO">Jefe Mecánico</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
