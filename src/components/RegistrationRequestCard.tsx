import React from 'react';
import { Check, X } from 'lucide-react';

type RegistrationRequest = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: number;
  usuario: string;
  status: string;
};

type Props = {
  request: RegistrationRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

const RegistrationRequestCard: React.FC<Props> = ({ request, onApprove, onReject }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{request.nombre} {request.apellido}</p>
        <p className="text-sm text-gray-600">{request.usuario}</p>
        <p className="text-sm text-gray-600">Teléfono: {request.telefono}</p>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onApprove(request.id)} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
          <Check size={20} />
        </button>
        <button onClick={() => onReject(request.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default RegistrationRequestCard;
