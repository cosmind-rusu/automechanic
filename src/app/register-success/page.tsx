import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function RegisterSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-200 rounded-lg shadow-xl border-t-4 border-green-500 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold text-gray-800">¡Solicitud Enviada!</h2>
        <p className="text-gray-600">
          Tu solicitud de registro ha sido enviada con éxito. Un administrador revisará tu solicitud y te notificaremos cuando sea aprobada.
        </p>
        <Link href="/" className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}