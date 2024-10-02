'use client'
import React, { useState } from 'react';
import { Wrench, User, Phone, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { workshopName } from "../../../config";  // Importa la variable de configuración

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    usuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration request');
      }

      router.push('/register-success');
    } catch (err) {
      setError('Error al enviar la solicitud de registro. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-200 rounded-lg shadow-xl border-t-4 border-orange-500">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full">
            <Wrench className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{workshopName}</h2>
          <p className="text-sm text-gray-600">Solicitud de Registro</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-gray-700">Nombre</label>
            <div className="relative">
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="apellido" className="text-gray-700">Apellido</label>
            <div className="relative">
              <input
                id="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="telefono" className="text-gray-700">Teléfono</label>
            <div className="relative">
              <input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="usuario" className="text-gray-700">Usuario</label>
            <div className="relative">
              <input
                id="usuario"
                type="text"
                value={formData.usuario}
                onChange={handleChange}
                required
                className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
}