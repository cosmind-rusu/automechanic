import React from 'react';
import { User, Eye, Edit, Trash2 } from 'lucide-react';

type Employee = {
  id: string;
  name: string;
  telefono: number;
};

type Props = {
  employee: Employee;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
};

const EmployeeCard: React.FC<Props> = ({ employee, onEdit, onView, onDelete }) => {
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
        <button onClick={() => onView(employee.id)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full">
          <Eye size={20} />
        </button>
        <button onClick={() => onEdit(employee.id)} className="p-2 text-green-500 hover:bg-green-100 rounded-full">
          <Edit size={20} />
        </button>
        <button onClick={() => onDelete(employee.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
