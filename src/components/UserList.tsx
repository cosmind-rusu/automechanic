'use client';

import React, { useState, useEffect } from 'react';
import { User, Eye, Edit, Trash2 } from 'lucide-react';

type User = {
  id: string;
  name: string;
  telefono: number;
  rol: string;
};

type UserListProps = {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const UserList: React.FC<UserListProps> = ({ onView, onEdit, onDelete }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsers(data); // Asegurarse de usar los datos tal como llegan
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center">Cargando usuarios...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white shadow rounded-lg p-4 mb-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <User className="h-10 w-10 text-gray-400 mr-4" />
            <div>
              <div className="text-lg font-medium text-gray-900">
                {user.name}
              </div>
              <div className="text-sm text-gray-500">Teléfono: {user.telefono}</div>
              <div className="text-sm text-gray-500">Rol: {user.rol}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onView(user.id)}
              className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors duration-200"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={() => onEdit(user.id)}
              className="p-2 text-green-500 hover:bg-green-100 rounded-full transition-colors duration-200"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-200"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
