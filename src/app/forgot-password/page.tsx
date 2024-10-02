'use client'
import { useState } from "react";
import { Wrench, Mail } from "lucide-react";
import { workshopName } from "../../../config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Se ha enviado un correo con instrucciones para restablecer tu contraseña.");
      } else {
        const data = await response.json();
        setError(data.error || "Ocurrió un error. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
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
          <p className="text-sm text-gray-600">Restablecer contraseña</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700">Correo electrónico</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>
        <div className="text-sm text-center">
          <a href="/" className="text-orange-600 hover:underline">
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}